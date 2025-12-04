// -------------------- Create Account --------------------
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
document.getElementById("name").value = "";
document.getElementById("age").value = "";
document.getElementById("gender").value = "";
document.getElementById("condition").value = "";

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
  const name = document.getElementById("editName").value;
  const age = document.getElementById("editAge").value;
  const gender = document.getElementById("editGender").value;
  const condition = document.getElementById("editCondition").value;

  if (!id) {
    alert("Please select a patient from the list first.");
    return;
  }

  if (!name || !age || !gender || !condition) {
    alert("All fields are required before updating.");
    return;
  }

  await fetch(`/patients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, age, gender, condition })
  });

  alert("Patient updated!");
  getPatients();

  // Clear edit fields AFTER update
  document.getElementById("editId").value = "";
  document.getElementById("editName").value = "";
  document.getElementById("editAge").value = "";
  document.getElementById("editGender").value = "";
  document.getElementById("editCondition").value = "";
}


// -------------------- DELETE PATIENT --------------------
async function deletePatient(id) {
  await fetch(`/patients/${id}`, { method: "DELETE" });
  alert("Patient deleted!");
  getPatients();
}
function showCreateAccount() {
  document.getElementById("createAccountBox").style.display = "block";
}

function hideCreateAccount() {
  document.getElementById("createAccountBox").style.display = "none";
}
