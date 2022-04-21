module.exports = class User {
    id
    firstname
    lastname
    nick
    age
    email
    courses
    password
    admin
    constructor(data) {
        Object.assign(this, data)
        this.courses = this.courses.split(",")
    }
}
