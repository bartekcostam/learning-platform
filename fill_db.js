require("dotenv").config()
const { faker } = require("@faker-js/faker")
const db = require("./database")

const randomName = faker.name.firstName()
const randomSurname = "Kowalski"
const age = Math.floor(Math.random() * 100)
const randomEmail = faker.internet.email() // Kassandra.Haley@erich.biz
const password = faker.internet.password()
const nick = faker.animal.type()

const courses = [1, 2, 3, 4]
const randomCourses = Math.floor(Math.random() * courses.length)

db.promise().query(`INSERT INTO users (firstname, lastname,username, age, email, courses, password, admin) VALUES(?,?,?,?,?,?,?,?)`, [
    randomName,
    randomSurname,
    nick,
    age,
    randomEmail,
    courses[randomCourses],
    password,
    0,
])
console.log(randomName, age, randomEmail, password, nick, coursesPick, admin)
