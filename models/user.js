module.exports = class User {
    id
    firstname
    lastname
    nick
    age
    email
    courses
    password
    constructor(data) {
        Object.assign(this, data)
        this.courses = this.courses.split(",")
    }
}
