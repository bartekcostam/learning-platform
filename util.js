const User = require("./models/user")
const Course = require("./models/course")
module.exports = class Util {
    constructor(db) {
        this.db = db
    }

    static dbConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    }

    async getUser(id) {
        return new User((await this.db.promise().query(`SELECT * FROM users WHERE id = ?`, [id]))[0][0])
    }

    async getUserByEmail(email) {
        return new User((await this.db.promise().query(`SELECT * FROM users WHERE email = ?`, [email]))[0][0])
    }

    async getCourse(id) {
        return new Course((await this.db.promise().query(`SELECT * FROM courses WHERE id = ?`, [id]))[0][0])
    }

    async getUserCourses(id) {
        const user = await this.getUser(id)
        const courses = []
        for (const id of user.courses) {
            courses.push(await this.getCourse(id))
        }
        return courses
    }
}
