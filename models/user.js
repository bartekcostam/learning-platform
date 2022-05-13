module.exports = class User {
    id
    firstname
    lastname
    username
    age
    email
    courses
    password
    admin
    constructor(data) {
        Object.assign(this, data)
        this.courses = this.courses.split(",").map((c) => Number(c))
    }
}
