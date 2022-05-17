const User = require("./models/user")
const Course = require("./models/course")
/**
 * Includes all of the utility functions
 */
module.exports = class Util {
    constructor(db) {
        this.db = db
    }

    /**
     * Database Config Template
     */
    static dbConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    }

    /**
     * Returns a user with the given id from the database
     * @param {number} id
     * @returns {User}
     */
    async getUser(id) {
        return new User((await this.db.promise().query(`SELECT * FROM users WHERE id = ?`, [id]))[0][0])
    }

    /**
     * Returns a user with the given email from the database
     * @param {string} email
     * @returns {User}
     */
    async getUserByEmail(email) {
        return new User((await this.db.promise().query(`SELECT * FROM users WHERE email = ?`, [email]))[0][0])
    }

    /**
     * Returns a course with the given id from the database
     * @param {number} id
     * @returns {User}
     */
    async getCourse(id) {
        return new Course((await this.db.promise().query(`SELECT * FROM courses WHERE id = ?`, [id]))[0][0])
    }

    /**
     * Returns a list of all courses from the database
     * @returns {Course[]}
     */
    async getAllCourses() {
        const courses = []
        for (const course of (await this.db.promise().query(`SELECT * FROM courses`))[0]) {
            courses.push(new Course(course))
        }
        return courses
    }

    /**
     * Returns a list of all courses owner by a user with the given id
     * @param {number} id
     * @returns {Course[]}
     */
    async getUserCourses(id) {
        const user = await this.getUser(id)
        const courses = []
        for (const id of user.courses) {
            const c = await this.getCourse(id)
            if (!c.id) continue
            courses.push(c)
        }
        return courses
    }

    /**
     * Deletes a course with a given id from the database
     * @param {number} id
     */
    async deleteCourse(id) {
        await this.db.promise().query(`DELETE FROM courses WHERE id = ?`, [id])
    }

    /**
     *
     * @param {number} id
     * @param {Object} data
     */
    async updateCourse(id, data) {
        const current = await this.getCourse(id)
        await this.db
            .promise()
            .query(`UPDATE courses SET title = ?, description = ?, price = ? WHERE id = ?`, [
                data.title || current.title,
                data.description || current.description,
                data.price || current.price,
                id,
            ])
    }
}
