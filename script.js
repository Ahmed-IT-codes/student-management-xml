
let students = [];

const studentTable = document.getElementById("studentTable");
const recordCount = document.getElementById("recordCount");

// Display records
function displayStudents(data) {

    studentTable.innerHTML = "";

    recordCount.textContent = "Showing " + data.length + " students";

    document.getElementById("totalStudents").textContent = students.length;

    const departments = new Set(
        students.map(student => student.department)
    );

    document.getElementById("totalDepartments").textContent =
        departments.size;

    if (data.length === 0) {
        studentTable.innerHTML =
            '<tr><td colspan="5" class="empty">No student records found.</td></tr>';
        return;
    }

    data.forEach(student => {

        const row = document.createElement("tr");

        const values = [
            student.id,
            student.name,
            student.age,
            student.department,
            student.email
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        studentTable.appendChild(row);

    });
}

// Load XML
async function loadXML() {

    try {

        const response = await fetch("students.xml");

        if (!response.ok) {
            throw new Error("Unable to load XML file.");
        }

        const xmlText = await response.text();

        const parser = new DOMParser();

        const xmlDoc = parser.parseFromString(
            xmlText,
            "application/xml"
        );

        if (xmlDoc.querySelector("parsererror")) {
            throw new Error("Invalid XML document.");
        }

        const records = xmlDoc.getElementsByTagName("student");

        students = [];

        for (let i = 0; i < records.length; i++) {

            const record = records[i];

            students.push({
                id: record.querySelector("id").textContent,
                name: record.querySelector("name").textContent,
                age: record.querySelector("age").textContent,
                department: record.querySelector("department").textContent,
                email: record.querySelector("email").textContent
            });

        }

        document.getElementById("searchInput").value = "";

        displayStudents(students);

        alert("XML data loaded successfully!");

    } catch (error) {

        alert(error.message);
        console.error(error);

    }
}

// Load JSON
async function loadJSON() {

    try {

        const response = await fetch("students.json");

        if (!response.ok) {
            throw new Error("Unable to load JSON file.");
        }

        const data = await response.json();

        students = data.students;

        document.getElementById("searchInput").value = "";

        displayStudents(students);

        alert("JSON data loaded successfully!");

    } catch (error) {

        alert(error.message);
        console.error(error);

    }
}

// Search by student name
document.getElementById("searchInput")
.addEventListener("input", function() {

    const keyword = this.value.toLowerCase().trim();

    const results = students.filter(student =>
        student.name.toLowerCase().includes(keyword)
    );

    displayStudents(results);

});

// Add new student
document.getElementById("studentForm")
.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("studentName").value.trim();
    const age = document.getElementById("studentAge").value;
    const department = document.getElementById("studentDepartment").value.trim();
    const email = document.getElementById("studentEmail").value.trim();

    if (!name || !age || !department || !email) {
        alert("Please fill in all fields.");
        return;
    }

    const newStudent = {

        id: students.length > 0
            ? Math.max(...students.map(s => Number(s.id))) + 1
            : 101,

        name: name,
        age: age,
        department: department,
        email: email

    };

    students.push(newStudent);

    document.getElementById("searchInput").value = "";

    displayStudents(students);

    this.reset();

    alert("Student registered successfully!");

});

// Automatically load JSON data when website opens
window.addEventListener("DOMContentLoaded", function() {
    loadJSON();
});
