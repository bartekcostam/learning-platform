require("dotenv").config()
const express = require("express")
const app = express()
const db = require("./database")

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.set("view engine", "ejs")

app.use(express.static("./public"))

app.get("/", async (req, res) => {
    let wyniki

    try {
        wyniki = await db.promise().query(`SELECT * FROM user`)
    } catch (err) {
        console.log(err)
    }

    console.log(wyniki[0])

    res.render("index")
})

app.get("/login", (req, res) => {
  

  res.render("login")
})

app.listen(3000, () => {
    console.log("Server started on port 3000")
})
