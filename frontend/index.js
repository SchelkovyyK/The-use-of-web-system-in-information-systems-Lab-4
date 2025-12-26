const API_URL = "http://localhost:3000/api/records";

const form = document.getElementById("recordForm");
const titleInput = document.getElementById("title");
const descInput = document.getElementById("description");
const list = document.getElementById("recordList");

// Load records on page load
fetchRecords();

// GET all records
function fetchRecords() {
  fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      list.innerHTML = "";

      data.forEach((record) => {
        const li = document.createElement("li");
        li.textContent = `${record.title} – ${record.description}`;

        // DELETE
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.onclick = () => deleteRecord(record.id);

        // EDIT
        const editBtn = document.createElement("button");
        editBtn.textContent = "✏️";
        editBtn.onclick = () => editRecord(record);

        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        list.appendChild(li);
      });
    });
}

// POST new record
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const newRecord = {
    title: titleInput.value,
    description: descInput.value,
  };

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newRecord),
  })
    .then((res) => {
      if (!res.ok) {
        alert("Validation error");
        return;
      }
      return res.json();
    })
    .then(() => {
      titleInput.value = "";
      descInput.value = "";
      fetchRecords();
    });
});

// DELETE record
function deleteRecord(id) {
  fetch(`${API_URL}/${id}`, { method: "DELETE" }).then(() => fetchRecords());
}
function editRecord(record) {
  const newTitle = prompt("Edit title:", record.title);
  if (!newTitle) return;

  const newDescription = prompt("Edit description:", record.description);

  fetch(`${API_URL}/${record.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: newTitle,
      description: newDescription,
    }),
  }).then(() => fetchRecords());
}
