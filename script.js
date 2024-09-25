function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText === '') return;

    const task = {
        id: Date.now(),
        text: taskText,
        status: 'pending', 
        addedAt: new Date().toLocaleString(),
        completedAt: null
    };

    addToList(task);
    taskInput.value = ''; 
}

function addToList(task) {
    const li = document.createElement('li');
    li.classList.add(task.status);
    li.innerHTML = `
        <span>${task.text}</span>
        <span class="timestamp">(Added: ${task.addedAt})</span>
        <div>
            <button onclick="editTask(${task.id})">Edit</button>
            <button onclick="completeTask(${task.id})">Complete</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `;
    li.setAttribute('id', task.id);

    if (task.status === 'pending') {
        document.getElementById('pendingTasks').appendChild(li);
    } else {
        document.getElementById('completedTasks').appendChild(li);
    }

    saveTask(task);
}

function editTask(taskId) {
    const taskText = prompt('Edit your task:');
    if (taskText) {
        const task = updateTask(taskId, { text: taskText });
        document.getElementById(task.id).querySelector('span').textContent = task.text;
    }
}

function completeTask(taskId) {
    const task = updateTask(taskId, {
        status: 'completed',
        completedAt: new Date().toLocaleString()
    });

    const li = document.getElementById(taskId);
    li.classList.remove('pending');
    li.classList.add('completed');
    li.querySelector('.timestamp').textContent = `(Completed: ${task.completedAt})`;
    li.querySelector('button:nth-child(2)').remove(); 
    document.getElementById('completedTasks').appendChild(li);
}

function deleteTask(taskId) {
    document.getElementById(taskId).remove();
    removeTask(taskId);
}

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
function saveTask(task) {
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTask(taskId, updates) {
    tasks = tasks.map(task => task.id === taskId ? { ...task, ...updates } : task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    return tasks.find(task => task.id === taskId);
}

function removeTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

window.onload = () => {
    tasks.forEach(task => addToList(task));
};

