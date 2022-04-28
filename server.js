require("dotenv").config()
const express = require("express")
const app = express()
const db = require("./database")
const Course = require("./models/course")
const User = require("./models/user")

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.set("view engine", "ejs")

app.use(express.static("./public"))

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

app.post("/login_usr", (req, res) => {

    if(req.body.username === "admin" && req.body.password === "password"){
        res.render("admin_panel")
    }
    else{
        res.sendStatus(418)
    }
})

app.get("/register", (req, res) => {
    res.render("register", {
        name: "Register Page",
    })
})

app.get("/courses", async (req, res) => {
    // TODO: get user from session
    const udata = (await db.promise().query(`SELECT * FROM users WHERE id = 1`))[0][0]
    const user = new User(udata)
    const courses = await Promise.all(
        user.courses.map(async (id) => {
            const cdata = (await db.promise().query(`SELECT * FROM courses WHERE id = ${id}`))[0][0]
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
    const nick = ""
    const courses = ""
    admin = 0
    db.promise()
        .query(`INSERT INTO users (firstname, lastname, age, email, password, nick, courses, admin) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`, [
            firstname,
            lastname,
            age,
            email,
            password,
            nick,
            courses,
            admin,
        ])
        .catch(console.error)
    // TODO: add session to localstorage
    res.send(201).redirect("/courses")
})

app.listen(3000, () => {
    console.log("Server started on port 3000")
})
