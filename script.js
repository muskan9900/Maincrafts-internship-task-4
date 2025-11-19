// var const let difference in js 
// var is function-scoped and can be redeclared and updated
// let is block-scoped and can be updated but not redeclared
// const is block-scoped and cannot be updated or redeclared 
// hoisting difference
// var declarations are hoisted and initialized with undefined
// let and const declarations are hoisted but not initialized
/* hoisting refers to behaviour of moving variable and function
 declarations to the top of their scope before 
 code execution*/

 // Get all the elements we need from HTML
 /*What this does:
Grabs HTML elements so JavaScript can work with them
getElementById() finds elements by their ID
We store them in variables for easy access*/

/*PART 1: Getting Elements from HTML*/

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');
const filterSelect = document.getElementById('filterSelect');


/*PART 2: Task Data Management*/
// Array to store all tasks
let tasks = [];

//What this does:
/*Creates an empty array to hold all our tasks
Each task will be an object with properties like: id, text, completed*/

/*PART 3: Load and Save Tasks to LocalStorage*/

// Load tasks from LocalStorage when page loads
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTasks();
    }
}

// Call this function when page loads
loadTasks(); 

/*What this does:

localStorage.getItem('tasks') - Gets saved tasks from browser storage
JSON.parse() - Converts text back into JavaScript array
renderTasks() - Displays the tasks on screen
Why? So tasks don't disappear when you refresh the page!*/

/*PART 4: Save Tasks to LocalStorage*/

// Save tasks to LocalStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
/*What this does:

JSON.stringify(tasks) - Converts array into text format
localStorage.setItem() - Saves to browser storage
Call this function every time tasks change (add, edit, delete)*/


/*PART 5: Add New Task*/

// Add new task
function addTask() {
    const taskText = taskInput.value.trim();
    
    // Validation: Check if input is empty
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    // Create new task object
    const newTask = {
        id: Date.now(), // Unique ID using timestamp
        text: taskText,
        completed: false
    };
    
    // Add to array
    tasks.push(newTask);
    
    // Clear input field
    taskInput.value = '';
    
    // Save to LocalStorage
    saveTasks();
    
    // Display updated tasks
    renderTasks();
}

// Listen for button click
addTaskBtn.addEventListener('click', addTask);

// Listen for Enter key press
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

/*What this does:

Gets text from input field
.trim() removes extra spaces
Validates: if empty, show alert
Creates task object with unique ID (using Date.now())
Adds to tasks array
Clears input
Saves and displays
Two ways to trigger: Click button OR press Enter key*/


/*PART 6: Render/Display Tasks*/

// Display tasks on screen
function renderTasks(filter = 'all', searchTerm = '') {
    // Clear current list
    taskList.innerHTML = '';
    
    // Filter tasks based on dropdown
    let filteredTasks = tasks;
    
    if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (filter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    }
    
    // Search filter
    if (searchTerm) {
        filteredTasks = filteredTasks.filter(task => 
            task.text.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    // Show empty state if no tasks
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<div class="empty-state">No tasks found</div>';
        return;
    }
    
    // Create HTML for each task
    filteredTasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        taskItem.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleComplete(${task.id})">
            <span class="task-text">${task.text}</span>
            <div class="task-buttons">
                <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        
        taskList.appendChild(taskItem);
    });
}

/*What this does:

Clears existing tasks (innerHTML = '')
Filters tasks based on dropdown (all/completed/pending)
Filters by search term
.filter() creates new array with matching items
.forEach() loops through each task
Creates HTML for each task dynamically
Adds checkbox, text, edit and delete buttons
${task.completed ? 'completed' : ''} adds "completed" class if task is done*/


/*PART 7: Toggle Task Completion/incomplete */

// Mark task as complete/incomplete
function toggleComplete(id) {
    const task = tasks.find(task => task.id === id);
    
    if (task) {
        task.completed = !task.completed; // Flip true/false
        saveTasks();
        renderTasks(filterSelect.value, searchInput.value);
    }
}

/*What this does:

.find() searches array for task with matching ID
!task.completed flips the value (true becomes false, false becomes true)
Saves and re-displays*/

/*PART 8: Delete Task*/
// Delete a task
function deleteTask(id) {
    // Confirm before deleting
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks(filterSelect.value, searchInput.value);
    }
}

/* What this does:

Shows confirmation dialog
.filter() keeps all tasks EXCEPT the one with matching ID
Saves and re-displays */

/*PART 9: Edit Task*/

// Edit a task
function editTask(id) {
    const task = tasks.find(task => task.id === id);
    
    if (task) {
        const newText = prompt('Edit task:', task.text);
        
        if (newText !== null && newText.trim() !== '') {
            task.text = newText.trim();
            saveTasks();
            renderTasks(filterSelect.value, searchInput.value);
        }
    }
}

/* What this does:

Finds task by ID
prompt() shows dialog box with current text
If user enters new text, update the task
Saves and re-displays*/


/*PART 10: Search Functionality*/

// Search tasks
searchInput.addEventListener('input', function() {
    renderTasks(filterSelect.value, searchInput.value);
});

/*What this does:

Listens for typing in search box
'input' event fires on every keystroke
Re-renders tasks with search filter applied*/

/*PART 11: Filter Dropdown*/

// Filter tasks by status
filterSelect.addEventListener('change', function() {
    renderTasks(filterSelect.value, searchInput.value);
});

/*What this does:

Listens for dropdown change
Re-renders tasks with selected filter (all/completed/pending)*/





