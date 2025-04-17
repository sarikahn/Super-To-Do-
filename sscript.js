const taskInput = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const category = document.getElementById("category");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("search");
const statusFilter = document.getElementById("statusFilter");
const categoryFilter = document.getElementById("categoryFilter");
const themeToggle = document.getElementById("toggleTheme");

let tasks = JSON.parse(localStorage.getItem("advancedTasks")) || [];

function saveTasks() {
  localStorage.setItem("advancedTasks", JSON.stringify(tasks));
}

function renderTasks() {
  const query = searchInput.value.toLowerCase();
  const status = statusFilter.value;
  const cat = categoryFilter.value;

  taskList.innerHTML = "";

  tasks
    .filter(task =>
      (status === "all" || (status === "completed") === task.completed) &&
      (cat === "all" || task.category === cat) &&
      task.text.toLowerCase().includes(query)
    )
    .forEach(task => {
      const li = document.createElement("li");
      li.className = `task ${task.completed ? "completed" : ""}`;

      const daysLeft = getDaysUntil(task.due);
      let urgency = "";
      if (daysLeft <= 1) urgency = "soon";
      else if (daysLeft <= 3) urgency = "later";
      else urgency = "future";

      li.innerHTML = `
        <div>
          <div class="text"><strong>${task.text}</strong></div>
          <div class="meta">
            <span class="due ${urgency}">📅 ${task.due || "No due date"}</span> • 
            <span class="category">🏷️ ${task.category}</span>
          </div>
        </div>
        <div class="actions">
          <button onclick="toggleTask(${task.id})">✔️</button>
          <button onclick="editTask(${task.id})">✏️</button>
          <button onclick="deleteTask(${task.id})">🗑️</button>
        </div>
      `;
      taskList.appendChild(li);
    });
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const task = {
    id: Date.now(),
    text,
    due: dueDate.value || null,
    category: category.value,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  taskInput.value = "";
  dueDate.value = "";
}

function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newText = prompt("Edit your task:", task.text);
  if (newText !== null) {
    task.text = newText.trim() || task.text;
    saveTasks();
    renderTasks();
  }
}

function getDaysUntil(dateStr) {
  if (!dateStr) return Infinity;
  const today = new Date();
  const due = new Date(dateStr);
  const diff = (due - today) / (1000 * 60 * 60 * 24);
  return Math.ceil(diff);
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", e => e.key === "Enter" && addTask());
searchInput.addEventListener("input", renderTasks);
statusFilter.addEventListener("change", renderTasks);
categoryFilter.addEventListener("change", renderTasks);
themeToggle.addEventListener("click", toggleTheme);

window.onload = () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
  }
  renderTasks();
};


