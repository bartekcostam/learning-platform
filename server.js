require("dotenv").config()
const express = require("express")
const app = express()
const db = require("./database")
const Util = require("./util")
const utils = new Util(db)
const cookieParser = require("cookie-parser")
const session = require("express-session")
const CookieStore = require("connect-mysql")(session)
const CookieStoreOptions = {
    config: Util.dbConfig,
}
const path = require("path")

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.set("view engine", "ejs")

app.use(express.static(path.join(__dirname, "public")))

app.use(cookieParser())

const oneDay = 1000 * 60 * 60 * 24

//session middleware
app.use(
    session({
        secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
        saveUninitialized: true,
        cookie: { maxAge: oneDay, expires: new Date(new Date().getTime() + oneDay) },
        resave: false,
        store: new CookieStore(CookieStoreOptions),
    })
)

app.get("/", async (req, res) => {
    res.render("index", {
        name: "Homepage",
        session: req.session,
    })
})

app.get("/login", (req, res) => {
    if (req.session.user) {
        res.redirect("/panel")
    } else {
        res.render("login", {
            name: "Login Page",
            session: req.session,
        })
    }
})

app.get("/register", (req, res) => {
    if (req.session.user) {
        res.redirect("/panel")
    } else {
        res.render("register", {
            name: "Register Page",
            session: req.session,
        })
    }
})

app.post("/api/login", async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const user = await utils.getUserByEmail(email)
    if (user.password == password) {
        req.session.user = user
        res.status(200).redirect("/panel")
    } else {
        res.sendStatus(418)
    }
})

app.get("/api/logout", (req, res) => {
    req.session.destroy()
    res.redirect("/")
})

app.get("/panel", async (req, res) => {
    if (req.session.user) {
        const user = req.session.user
        const courses = await utils.getUserCourses(user.id)
        res.render("user_panel", { name: "User Panel", user, courses, session: req.session })
    } else {
        res.redirect("/login")
    }
})

app.get("/browse", async (req, res) => {
    const courses = await utils.getAllCourses()
    res.render("course_list", { name: "Browse Courses", session: req.session, courses })
})

app.get("/admin", async (req, res) => {
    res.render("admin_panel", { name: "Admin Panel", session: req.session })
})

app.get("/courses", async (req, res) => {
    if (req.session.user) {
        const user = req.session.user
        const courses = await utils.getUserCourses(user.id)
        res.render("courses", {
            name: "Your courses",
            courses,
            session: req.session,
        })
    } else {
        res.redirect("/login")
    }
})

app.get("/courses/:id", async (req, res) => {
    const course = await utils.getCourse(req.params.id)
    const user = req.session.user
    res.render("course_details", {
        course,
        name: `${course.title} - Course Details`,
        user,
        session: req.session,
    })
})

app.get("/courses/:id/delete", async (req, res) => {
    const course = await utils.getCourse(req.params.id)
    const user = req.session.user
    if (user?.admin) {
        await utils.deleteCourse(course.id)
    }
    res.redirect("/courses")
})

app.post("/api/course/:id", async (req, res) => {
    const course = await utils.getCourse(req.params.id)
    if (course.id) {
        return res.status(200).send(JSON.stringify(course))
    } else {
        return res.status(418).send("Course not found")
    }
})

app.post("/api/course/:id/edit", async (req, res) => {
    const course = await utils.getCourse(req.params.id)
    const user = req.session.user
    if (user?.admin) {
        if (course.id) {
            await utils.updateCourse(course.id, req.body)
            return res.status(200).redirect(req.get("referer"))
        } else {
            return res.status(418).send("Course not found")
        }
    } else {
        res.redirect("/courses")
    }
})

app.post("/api/register", async (req, res) => {
    const { firstname, lastname, age, email, password } = req.body
    const emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            error: "Invalid email",
        })
    }
    const emailExists = (await db.promise().query(`SELECT * FROM users WHERE email = ?`, [email]))[0].length > 0
    if (emailExists) {
        return res.status(400).json({
            error: "Email already exists",
        })
    }
    const username = ""
    const courses = ""
    admin = 0
    db.promise()
        .query(`INSERT INTO users (firstname, lastname, age, email, password, nick, courses, admin) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`, [
            firstname,
            lastname,
            age,
            email,
            password,
            username,
            courses,
            admin,
        ])
        .catch(console.error)
    req.session.user = await utils.getUserByEmail(email)
    res.send(201).redirect("/courses")
})

app.listen(3000, () => {
    console.log("Server started on http://localhost:3000")
})
