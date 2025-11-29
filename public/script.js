// Redirect logged-in users
if (localStorage.getItem("loggedIn") === "true" && window.location.pathname.endsWith("index.html")) {
    window.location.href = "dashboard.html";
}

// Login & Logout
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if(username === "admin" && password === "1234") {
        localStorage.setItem("loggedIn", "true");
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid username or password");
    }
}

function logout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "index.html";
}

// API base URL
const apiUrl = '/patients';

// GET patients
async function getPatients() {
    try {
        const res = await fetch(apiUrl);
        const patients = await res.json();
        const tbody = document.querySelector('#patientsTable tbody');
        tbody.innerHTML = '';
        patients.forEach(p => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${p.name}</td>
                <td>${p.age}</td>
                <td>${p.gender}</td>
                <td>${p.condition}</td>
                <td>
                    <button onclick='populateEditForm(${JSON.stringify(p)})'>Edit</button>
                    <button onclick="deletePatient('${p._id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error(err);
    }
}

// ADD patient
async function addPatient() {
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const condition = document.getElementById('condition').value;

    if (!name) return alert('Name is required');

    await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age, gender, condition })
    });

    document.getElementById('name').value = '';
    document.getElementById('age').value = '';
    document.getElementById('gender').value = '';
    document.getElementById('condition').value = '';
    getPatients();
}

// DELETE patient
async function deletePatient(id) {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    getPatients();
}

// EDIT patient
function populateEditForm(patient) {
    document.getElementById('editId').value = patient._id;
    document.getElementById('editName').value = patient.name;
    document.getElementById('editAge').value = patient.age;
    document.getElementById('editGender').value = patient.gender;
    document.getElementById('editCondition').value = patient.condition;
}

// UPDATE patient
async function updatePatient() {
    const id = document.getElementById('editId').value;
    const name = document.getElementById('editName').value;
    const age = document.getElementById('editAge').value;
    const gender = document.getElementById('editGender').value;
    const condition = document.getElementById('editCondition').value;

    if (!id) return alert("No patient selected");

    await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age, gender, condition })
    });

    document.getElementById('editId').value = '';
    document.getElementById('editName').value = '';
    document.getElementById('editAge').value = '';
    document.getElementById('editGender').value = '';
    document.getElementById('editCondition').value = '';
    getPatients();
}

// Auto-load patients if dashboard is open
if (window.location.pathname.endsWith("dashboard.html")) getPatients();
