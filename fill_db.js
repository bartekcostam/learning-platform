const { faker } = require('@faker-js/faker')
const db = require("./database")
//for(var x =0; x<10;x++){

const randomName = faker.name.firstName()
const randomSurname = "Kowalski"
const age = Math.floor(Math.random() * 100)
const randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
const password = faker.internet.password()
const nick = faker.animal.type()

const courses = ["Programowanie w C++","Programowanie w C","Programowanie w Java","Programowanie w Python"]
const randomCourses = Math.floor(Math.random() * courses.length)
let coursesPick = (randomCourses, courses[randomCourses])

const admin = 0


db.promise()
.query(`INSERT INTO users (id,firstname, lastname, age, email, password, nick, courses, admin) VALUES(?,${randomName}, ${randomSurname}, ${age}, ${randomEmail}, ${password}, ${nick}, ${coursesPick}, ${admin})`)
.catch(console.error)

//db.promise().query(`SELECT * FROM users WHERE firstname="user"`)

    console.log(randomName,age, randomEmail, password, nick,coursesPick, admin)

