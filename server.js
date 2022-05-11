require("dotenv").config()
const express = require("express")
const app = express()
const db = require("./database")
const utils = new (require("./utils"))(db)
const Course = require("./models/course")
const User = require("./models/user")
const cookieParser = require("cookie-parser")
const sessions = require("express-session")

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.set("view engine", "ejs")

app.use(express.static("./public"))

app.use(cookieParser())

const oneDay = 1000 * 60 * 60 * 24

//session middleware
app.use(
    sessions({
        secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
        saveUninitialized: true,
        cookie: { maxAge: oneDay },
        resave: false,
    })
)

app.get("/", async (req, res) => {
    res.render("index", {
        name: "Homepage",
    })
})

app.get("/login", (req, res) => {
    res.render("login", {
        name: "Login Page",
    })
})

app.get("/register", (req, res) => {
    res.render("register", {
        name: "Register Page",
    })
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

app.get("/panel", async (req, res) => {
    if (req.session.user) {
        const user = req.session.user
        const courses = await utils.getUserCourses(user.id)
        res.render("user_panel", { name: "User Panel", user, courses })
    } else {
        res.redirect("/login")
    }
})

app.get("/admin", async (req, res) => {
    res.render("admin_panel", { name: "Admin Panel" })
})

app.get("/courses", async (req, res) => {
    // TODO: get user from session
    const user = utils.getUser(id)
    const courses = await Promise.all(
        user.courses.map(async (c) => {
            const cdata = (await db.promise().query(`SELECT * FROM courses WHERE id = ${c.id}`))[0][0]
            return new Course(cdata)
        })
    )
    res.render("courses", {
        name: "Your courses",
        user,
        courses,
    })
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
    // TODO: add session to localstorage
    req.session.user = await utils.getUserByEmail(email)
    res.send(201).redirect("/courses")
})

app.listen(3000, () => {
    console.log("Server started on port 3000")
})
