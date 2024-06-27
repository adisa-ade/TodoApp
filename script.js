let tasks = [];
const itemsOrder = document.querySelector('.items-order')
const errorMsg = document.querySelector('.error')
const emptyTask = document.querySelector('.empty-task')

// add tast
function addTodo() {
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();    
    if (taskText === '') {
        errorMsg.style.display = 'block'
    }
    else{
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        tasks.push(task);
        taskInput.value = '';
        renderTasks();
        errorMsg.style.display = 'none'        
        emptyTask.style.display = 'none'
        if(tasks.length > 1){
            itemsOrder.style.display = 'block'
        }
    }
    
}

// display task list, if not empty
function renderTasks() {       
    const taskList = document.getElementById('task-list');    
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.setAttribute('data-id', task.id);
        li.setAttribute('draggable', true);
        li.className = task.completed ? 'completed' : '';
        li.innerHTML = `
            <span>${task.text}</span>
            <div class="buttons">
                <button class="edit" onclick="editTask(${task.id})">Edit</button>
                <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
                <button class="complete" onclick="toggleComplete(${task.id})">${task.completed ? 'Undo' : 'Complete'}</button>
            </div>
        `;
        li.addEventListener('dragstart', dragStart);
        li.addEventListener('dragover', dragOver);
        li.addEventListener('drop', drop);
        taskList.appendChild(li);
    
    });
}

// edit task
function editTask(id) {
    const newTaskText = prompt('Edit the task');
    newTaskText.value = 'asdfsa'

    if (newTaskText === null || newTaskText.trim() === '') {
        errorMsg.style.display = 'block'
    }
    else{
        tasks = tasks.map(task => task.id === id ? { ...task, text: newTaskText } : task);
        renderTasks();
        errorMsg.style.display = 'none'
    }
    
}

// delete task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
    errorMsg.style.display = 'none'    
    if(tasks.length === 0){
        emptyTask.style.display = 'flex'
    }
    if(tasks.length < 2){
        itemsOrder.style.display = 'none'    
    }
}

// completed task
function toggleComplete(id) {
    tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    renderTasks();
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.id);
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    const draggedTaskId = event.dataTransfer.getData('text/plain');
    const targetTaskId = event.target.closest('li').dataset.id;
    const draggedTaskIndex = tasks.findIndex(task => task.id == draggedTaskId);
    const targetTaskIndex = tasks.findIndex(task => task.id == targetTaskId);
    const [draggedTask] = tasks.splice(draggedTaskIndex, 1);
    tasks.splice(targetTaskIndex, 0, draggedTask);
    renderTasks();
}

document.addEventListener('DOMContentLoaded', renderTasks);
