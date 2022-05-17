// This script makes so when you open course edit modal it automatically fills the inputs with current data

const courseEditModal = document.getElementById("editModal")
courseEditModal.addEventListener("show.bs.modal", async (event) => {
    const courseId = window.location.href.split("/")[4]
    const course = await (await fetch("/api/course/" + courseId, { method: "POST" })).json()

    const titleInput = document.getElementById("inputTitle")
    const authorInput = document.getElementById("inputAuthor")
    const priceInput = document.getElementById("inputPrice")
    const descriptionInput = document.getElementById("inputDescription")

    titleInput.value = course.title
    authorInput.value = course.author
    priceInput.value = course.price
    descriptionInput.value = course.description
})
