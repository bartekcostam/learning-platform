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

app.get("/register", (req, res) => {
    res.render("register", {
        name: "Register Page",
    })
})

app.get("/courses", async (req, res) => {
    const udata = (await db.promise().query(`SELECT * FROM users WHERE id = 6`))[0][0]
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
app.post("/usr_register", (req, res) => {
    console.log(req.body)
    res.send(201)
})


app.listen(3000, () => {
    console.log("Server started on port 3000")
})
