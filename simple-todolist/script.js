const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const clearAllBtn = document.getElementById("clearAllBtn");
const taskCount = document.getElementById("taskCount");

function updateTaskCount() {
    const count = todoList.children.length;
    if (count === 0) {
        taskCount.textContent = "No tasks yet";
    } else {
        taskCount.textContent = `${count} task${count !== 1 ? 's' : ''}`;
    }
}

window.addEventListener("load", () => {
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    savedTodos.forEach(task => createTodoItem(task));
    updateTaskCount();
});

addBtn.addEventListener("click", addTodo);
todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTodo();
});

function addTodo() {
    const task = todoInput.value.trim();

    if (!task) {
        todoInput.style.borderColor = "#E84820";
        todoInput.placeholder = "Please enter a task...";
        setTimeout(() => {
            todoInput.style.borderColor = "";
            todoInput.placeholder = "What needs to be done?";
        }, 2000);
        return;
    }

    if (Array.from(todoList.children).some(li => li.firstChild.textContent === task)) {
        alert("Task already exists!");
        return;
    }

    createTodoItem(task);
    saveTodoToLocalStorage(task);
    todoInput.value = "";
    updateTaskCount();
}

function createTodoItem(task) {
    const todoItem = document.createElement("li");
    const taskText = document.createElement("span");
    taskText.textContent = task;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "\u2715";
    deleteBtn.classList.add("delete-todo-btn");

    deleteBtn.addEventListener("click", () => {
        todoItem.style.transform = "translateX(100%)";
        todoItem.style.opacity = "0";
        setTimeout(() => {
            todoItem.remove();
            removeTodoFromLocalStorage(task);
            updateTaskCount();
        }, 200);
    });

    todoItem.appendChild(taskText);
    todoItem.appendChild(deleteBtn);
    todoList.appendChild(todoItem);
}

function saveTodoToLocalStorage(task) {
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    savedTodos.push(task);
    localStorage.setItem("todos", JSON.stringify(savedTodos));
}

function removeTodoFromLocalStorage(task) {
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    const updatedTodos = savedTodos.filter(t => t !== task);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
}

clearAllBtn.addEventListener("click", () => {
    if (todoList.children.length === 0) return;
    if (confirm("Are you sure you want to clear all tasks?")) {
        todoList.innerHTML = "";
        localStorage.removeItem("todos");
        updateTaskCount();
    }
});
