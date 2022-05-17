/**
 * Course data model
 */
module.exports = class Course {
    id
    title
    price
    author
    description
    constructor(data) {
        Object.assign(this, data)
    }
}
