// -------------------- REGISTER --------------------
async function register() {
  const username = document.getElementById("regUser").value;
  const password = document.getElementById("regPass").value;

  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  alert(data.message);
}

// -------------------- LOGIN --------------------
async function login() {
  const username = document.getElementById("loginUser").value;
  const password = document.getElementById("loginPass").value;

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (data.success) {
    alert("Login successful!");
    window.location.href = "dashboard.html";
  } else {
    alert(data.message);
  }
}

// -------------------- LOGOUT --------------------
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// -------------------- GET ALL PATIENTS --------------------
async function getPatients() {
  const res = await fetch("/patients");
  const patients = await res.json();

  const tbody = document.querySelector("#patientsTable tbody");
  tbody.innerHTML = "";

  patients.forEach(p => {
    tbody.innerHTML += `
      <tr>
        <td>${p.name}</td>
        <td>${p.age}</td>
        <td>${p.gender}</td>
        <td>${p.condition}</td>
        <td>
          <button onclick="editPatient('${p._id}', '${p.name}', '${p.age}', '${p.gender}', '${p.condition}')">Edit</button>
          <button onclick="deletePatient('${p._id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

// -------------------- ADD PATIENT --------------------
async function addPatient() {
  const patient = {
    name: document.getElementById("name").value,
    age: document.getElementById("age").value,
    gender: document.getElementById("gender").value,
    condition: document.getElementById("condition").value
  };

  const res = await fetch("/patients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patient)
  });

  alert("Patient added!");
  getPatients();
}

// -------------------- PREFILL EDIT FORM --------------------
function editPatient(id, name, age, gender, condition) {
  document.getElementById("editId").value = id;
  document.getElementById("editName").value = name;
  document.getElementById("editAge").value = age;
  document.getElementById("editGender").value = gender;
  document.getElementById("editCondition").value = condition;
}

// -------------------- UPDATE PATIENT --------------------
async function updatePatient() {
  const id = document.getElementById("editId").value;

  const updated = {
    name: document.getElementById("editName").value,
    age: document.getElementById("editAge").value,
    gender: document.getElementById("editGender").value,
    condition: document.getElementById("editCondition").value
  };

  await fetch(`/patients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated)
  });

  alert("Patient updated!");
  getPatients();
}

// -------------------- DELETE PATIENT --------------------
async function deletePatient(id) {
  await fetch(`/patients/${id}`, { method: "DELETE" });
  alert("Patient deleted!");
  getPatients();
}
