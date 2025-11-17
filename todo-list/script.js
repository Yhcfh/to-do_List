// =============================================
// DOM ELEMENT SELECTIONS
// =============================================

// Get references to the main DOM elements we need to work with
const input = document.getElementById('todo-input') // Input field for new todos
const addBtn = document.getElementById('add-btn')   // Add button
const list = document.getElementById('todo-list')   // List container for todos

// =============================================
// DATA MANAGEMENT
// =============================================

// Try to load saved todos from browser's localStorage (if any exist)
// localStorage persists data even when browser is closed
const saved = localStorage.getItem('todos');

// If there are saved todos, parse them from JSON string to JavaScript array
// If no saved todos, start with an empty array
const todos = saved ? JSON.parse(saved) : [];

// =============================================
// CORE FUNCTIONS
// =============================================

/**
 * Saves the current todos array to localStorage
 * This function is called whenever todos are added, edited, completed, or deleted
 */
function saveTodos() {
    // Convert JavaScript array to JSON string and save in localStorage
    localStorage.setItem('todos', JSON.stringify(todos));
}

/**
 * Creates a DOM element for a single todo item and sets up all its functionality
 * @param {Object} todo - The todo object containing text and completion status
 * @param {number} index - The position of this todo in the todos array
 * @returns {HTMLElement} - The complete list item element ready to be added to DOM
 */
function createTodoNode(todo, index) {
    // Create the main list item container
    const li = document.createElement('li');

    // ========== CHECKBOX FOR COMPLETION STATUS ==========
    // Create checkbox to mark todo as complete/incomplete
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!todo.completed; // Convert to boolean (true/false)
    
    // Add event listener for when checkbox state changes
    checkbox.addEventListener("change", () => {
        // Update the todo's completion status based on checkbox
        todo.completed = checkbox.checked;

        // Update visual appearance: strike-through text when completed
        textSpan.style.textDecoration = todo.completed ? 'line-through' : "";
        
        // Save the updated state to localStorage
        saveTodos();
    })

    // ========== TODO TEXT DISPLAY ==========
    // Create span element to display the todo text
    const textSpan = document.createElement("span");
    textSpan.textContent = todo.text; // Set the text content
    textSpan.style.margin = '0 8px'; // Add spacing around text
    
    // If todo is already completed, show strike-through style
    if (todo.completed) {
        textSpan.style.textDecoration = 'line-through';
    }
    
    // Add double-click event to enable editing
    textSpan.addEventListener("dblclick", () => {
        // Show prompt for user to edit todo text
        const newText = prompt("Edit todo", todo.text);
        
        // If user entered something (didn't cancel)
        if (newText !== null) {
            // Update todo text and remove any extra spaces
            todo.text = newText.trim()
            
            // Update the displayed text
            textSpan.textContent = todo.text;
            
            // Save changes to localStorage
            saveTodos();
        }
    })

    // ========== DELETE BUTTON ==========
    // Create button to delete this todo
    const delBtn = document.createElement('button');
    delBtn.textContent = "Delete"; // Button text
    
    // Add click event to handle deletion
    delBtn.addEventListener('click', () => {
        // Remove this todo from the array using its index
        todos.splice(index, 1);
        
        // Re-render the entire list to reflect the deletion
        render();
        
        // Save the updated list to localStorage
        saveTodos();
    })

    // ========== ASSEMBLE THE TODO ITEM ==========
    // Add all elements to the list item in the correct order
    li.appendChild(checkbox);  // Checkbox first
    li.appendChild(textSpan);  // Text in middle
    li.appendChild(delBtn);    // Delete button last

    return li; // Return the complete todo item
}

/**
 * Clears and re-renders the entire todo list
 * This function is called whenever the list needs to be updated
 */
function render() {
    // Clear the entire list container
    list.innerHTML = '';

    // Recreate and add each todo item to the list
    todos.forEach((todo, index) => {
        // Create DOM node for this todo
        const node = createTodoNode(todo, index);
        
        // Add it to the list container
        list.appendChild(node)
    });
}

/**
 * Adds a new todo to the list based on input field value
 */
function addTodo() {
    // Get the text from input field and remove extra spaces
    const text = input.value.trim();
    
    // If input is empty, do nothing
    if (!text) {
        return
    }

    // Add new todo object to the todos array
    // New todos start as not completed (completed: false)
    todos.push({ text: text, completed: false });
    
    // Clear the input field for next todo
    input.value = '';
    
    // Re-render the list to show the new todo
    render()
    
    // Save the updated list to localStorage
    saveTodos()
}

// =============================================
// EVENT LISTENERS
// =============================================

// Add click event to the Add button
// When clicked, the addTodo function will be called
addBtn.addEventListener("click", addTodo);

// Add keyboard event to the input field
// When user presses Enter key, add the todo
input.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
        addTodo();
    }
})

// =============================================
// INITIALIZATION
// =============================================

// Render the initial todo list when page loads
// This will display any todos loaded from localStorage
render();