// Todo App Logic

// Date Display
const dateElement = document.getElementById('date');
const options = { weekday: 'long', month: 'short', day: 'numeric' };
dateElement.innerText = new Date().toLocaleDateString('en-US', options);

// Selectors
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const itemsLeft = document.getElementById('items-left');
const clearCompletedBtn = document.getElementById('clear-completed');

// State
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Event Listeners
document.addEventListener('DOMContentLoaded', getTodos);
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') addTodo(e);
});
clearCompletedBtn.addEventListener('click', clearCompleted);

// Functions
function getTodos() {
    renderTodos();
}

function saveLocalTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    updateItemsLeft();
}

function addTodo(event) {
    event.preventDefault(); // Prevent form submission if in form
    const text = todoInput.value;
    if (text === '') return;

    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    todos.push(newTodo);
    saveLocalTodos();
    renderTodos();
    todoInput.value = '';
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveLocalTodos();
    renderTodos();
}

function toggleComplete(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    saveLocalTodos();
    renderTodos();
}

function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveLocalTodos();
    renderTodos();
}

function updateItemsLeft() {
    const count = todos.filter(todo => !todo.completed).length;
    itemsLeft.innerText = `${count} item${count !== 1 ? 's' : ''} left`;
}

function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach(todo => {
        // Create Todo Item
        const todoItem = document.createElement('li');
        todoItem.classList.add('todo-item');
        if (todo.completed) todoItem.classList.add('completed');

        // Check Button
        const checkBtn = document.createElement('button');
        checkBtn.innerHTML = '<i class="fas fa-check"></i>';
        checkBtn.classList.add('check-btn');
        checkBtn.onclick = () => toggleComplete(todo.id);

        // Text
        const todoText = document.createElement('span');
        todoText.classList.add('todo-text');
        todoText.innerText = todo.text;

        // Delete Button
        const trashBtn = document.createElement('button');
        trashBtn.innerHTML = '<i class="fas fa-trash"></i>';
        trashBtn.classList.add('delete-btn');
        trashBtn.onclick = () => deleteTodo(todo.id);

        // Append to Item
        todoItem.appendChild(checkBtn);
        todoItem.appendChild(todoText);
        todoItem.appendChild(trashBtn);

        // Append to List
        todoList.appendChild(todoItem);
    });
    updateItemsLeft();
}
