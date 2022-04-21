module.exports = class Course {
    id
    title
    price
    author
    constructor(data) {
        Object.assign(this, data)
    }
}
