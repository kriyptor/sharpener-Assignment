document.addEventListener('DOMContentLoaded', function() {
    // Get elements from the page
    let form = document.getElementById('expenseForm');
    let list = document.getElementById('expense-list');
    
    // Variable to track if we're editing
    let isEditing = false;
    let editingIndex = null;
    
    // Load saved expenses when page loads
    let savedExpenses = localStorage.getItem('expenses');
    let expenses = [];
    
    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
        
        // Show all saved expenses
        for(let i = 0; i < expenses.length; i++) {
            let expense = expenses[i];
            addExpenseToList(expense.amount, expense.description, expense.category, i);
        }
    }
    
    // When form is submitted
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get values from form
        let amount = document.getElementById('expenseAmount').value;
        let description = document.getElementById('expenseDescription').value;
        let category = document.getElementById('expenseCategory').value;
        
        if (isEditing) {
            // Update existing expense
            expenses[editingIndex] = {
                amount: amount,
                description: description,
                category: category
            };
            
            // Clear the list and show updated expenses
            list.innerHTML = '';
            for(let i = 0; i < expenses.length; i++) {
                let exp = expenses[i];
                addExpenseToList(exp.amount, exp.description, exp.category, i);
            }
            
            // Reset editing state
            isEditing = false;
            editingIndex = null;
        } else {
            // Add new expense
            addExpenseToList(amount, description, category, expenses.length);
            
            // Save to array
            let expense = {
                amount: amount,
                description: description,
                category: category
            };
            expenses.push(expense);
        }
        
        // Save to storage
        localStorage.setItem('expenses', JSON.stringify(expenses));
        
        // Clear form
        form.reset();
    });
    
    // Function to add expense to the list
    function addExpenseToList(amount, description, category, index) {
        // Create new list item
        let li = document.createElement('li');
        li.innerHTML = amount + " is for " + description + ", " + category;
        
        // Add delete button
        let deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'Delete';
        deleteButton.className = 'btn btn-danger mx-2';
        
        // Add edit button
        let editButton = document.createElement('button');
        editButton.innerHTML = 'Edit';
        editButton.className = 'btn btn-warning';
        
        // When delete button is clicked
        deleteButton.onclick = function() {
            // Remove from list
            li.remove();
            
            // Remove from array
            expenses.splice(index, 1);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            
            // Refresh the list to update indexes
            list.innerHTML = '';
            for(let i = 0; i < expenses.length; i++) {
                let exp = expenses[i];
                addExpenseToList(exp.amount, exp.description, exp.category, i);
            }
        };
        
        // When edit button is clicked
        editButton.onclick = function() {
            // Fill form with expense details
            document.getElementById('expenseAmount').value = amount;
            document.getElementById('expenseDescription').value = description;
            document.getElementById('expenseCategory').value = category;
            
            // Set editing state
            isEditing = true;
            editingIndex = index;
        };
        
        // Add buttons to list item
        li.appendChild(deleteButton);
        li.appendChild(editButton);
        
        // Add to list
        list.appendChild(li);
    }
});