// This script adds a random user to the database fill with data from faker-js generator

require("dotenv").config()
const { faker } = require("@faker-js/faker")
const db = require("./database")

const randomName = faker.name.firstName()
const randomSurname = "Kowalski"
const age = Math.floor(Math.random() * 100)
const email = faker.internet.email()
const password = faker.internet.password()
const username = faker.animal.type()

const courses = [1, 2, 3, 4]
const randomCourses = Math.floor(Math.random() * courses.length)

;(async () => {
    await db
        .promise()
        .query(`INSERT INTO users (firstname, lastname,username, age, email, courses, password, admin) VALUES(?,?,?,?,?,?,?,?)`, [
            randomName,
            randomSurname,
            username,
            age,
            email,
            courses[randomCourses],
            password,
            0,
        ])

    const newUser = (await db.promise().query(`SELECT * FROM users WHERE email = ?`, [email]))[0]
    console.log(newUser)
})()
