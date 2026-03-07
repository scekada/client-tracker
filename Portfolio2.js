document.addEventListener("DOMContentLoaded",function() {
    const nameInput = document.getElementById("clientName");
    const companyInput = document.getElementById("company");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const notesInput = document.getElementById("notes");
    const clientList = document.getElementById("clientList");
    const addBtn = document.getElementById("addClientBtn");
    const dropDown = document.getElementById("dropdown");
    const taskTitle = document.getElementById("task-title");
    const taskDeadline = document.getElementById("task-deadline");
    const taskRequirements = document.getElementById("task-requirements");
    const taskPayment = document.getElementById("task-payment");
    const taskPaymentStatus = document.getElementById("task-payment-status");
    const taskProgress = document.getElementById("task-progress");
    const submit = document.getElementById("submit");
    const taskList = document.getElementById("taskList");

    if ( addBtn ) {
        addBtn.addEventListener("click",addClient);
    }
    if(submit) {
        submit.addEventListener("click", function() {
            alert("You have submitted successfully!");
        });
    }

    const taskForm = document.getElementById("task-form");

    if (taskForm) {
        taskForm.addEventListener("submit", function(event) {
            event.preventDefault(); // stop the refresh
            addTask();
        });
    }

    if ( dropDown ) {
        dropDown.addEventListener("change",displayTasksForClient);
    }

    displayClients();
    dropDownClients();

    let editingIndex = null;
    let editingTaskIndex = null;

    function addClient() {
        const client = {
            name: nameInput.value.trim(),
            company: companyInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(), 
            notes: notesInput.value.trim(), 
            timestamp: new Date().toLocaleString(),
        };

        if ( !client.name || !client.email ) {
            alert("Client name and email are required! ");
            return
        }

        let clients = JSON.parse(localStorage.getItem("clients")) || [];
        
        if ( editingIndex !== null ) {
            client.tasks = clients[editingIndex].tasks || [];
            clients[editingIndex] = client;
            editingIndex = null;
            addBtn.textContent = "Add client";
        }
        else {
            clients.push(client);
        }
            
        localStorage.setItem("clients",JSON.stringify(clients));
        
        nameInput.value = "";
        companyInput.value = "";
        emailInput.value = "";
        phoneInput.value = "";
        notesInput.value = "";

        displayClients();
        dropDownClients();
    }
    function addTask() {
        const selectedIndex = dropDown.value;
        if ( selectedIndex === "" ) {
            alert("Please select a client! ");
            return;
        }
        const task = {
            title: taskTitle.value.trim(),
            deadline: taskDeadline.value.trim(),
            requirements: taskRequirements.value.trim(),
            payment: taskPayment.value.trim(),
            paymentStatus: taskPaymentStatus.value.trim(),
            paymentDate: taskPaymentStatus.value.trim() === "paid" ? new Date().toISOString() : null,
            progress: taskProgress.value.trim(),
            timeStamp: new Date().toLocaleString(),
        };

        let clients = JSON.parse(localStorage.getItem("clients")) || [];
        clients[selectedIndex].tasks = clients[selectedIndex].tasks || [];

        if ( editingTaskIndex !== null ) {
            clients[selectedIndex].tasks[editingTaskIndex] = task;
            editingTaskIndex = null;
            submit.textContent = "Add Task";
            alert("Task updated successfully!");
        }
        else {
            clients[selectedIndex].tasks.push(task);
            alert("Task added successfully! ");
        }
        localStorage.setItem("clients",JSON.stringify(clients));

        taskTitle.value = "";
        taskDeadline.value = "";
        taskRequirements.value = "";
        taskPayment.value = "";
        taskPaymentStatus.value = "";
        taskProgress.value = "";

        displayTasksForClient();

    }


    function displayClients() {
        if (!clientList) return;

        let clients = JSON.parse(localStorage.getItem("clients")) || [];
        clientList.innerHTML = "";

        if ( clients.length === 0 ) {
            clientList.innerHTML = "<p>No clients found.</p>";
            return;
        }

        clients.forEach((client,index) => {
            const div = document.createElement("div");
            div.className = "clientCard";
            div.innerHTML = `
            <div class = "cc">
            <p><strong>${client.name}</strong> (${client.company})</p>
            <p>Email: ${client.email}</p>
            <p>Phone: ${client.phone}</p>
            <p class = "notes">Notes: ${client.notes}</p>
            <p><em>Added: ${client.timestamp}</em></p>
            <button class = "editBtn" data-index = "${index}">Edit</button>
            <button class = "removeBtn" data-index = "${index}">Remove</button>
            </div>
            `;
            clientList.appendChild(div);
        });

        const removeButtons = document.querySelectorAll(".removeBtn");
        removeButtons.forEach(button => {
            button.addEventListener("click",function() {
                const index = this.dataset.index;
                removeClient(index);
            });
        });

        const editButtons = document.querySelectorAll(".editBtn");
        editButtons.forEach(button => {
            button.addEventListener("click",function() {
                const index = this.dataset.index;
                startEditClient(index);
            });
        });
    }

    function startEditClient(index) {
        let clients = JSON.parse(localStorage.getItem("clients")) || [];
        let client = clients[index];

        nameInput.value = client.name;
        companyInput.value = client.company;
        emailInput.value = client.email;
        phoneInput.value = client.phone;
        notesInput.value = client.notes;

        editingIndex = index;
        addBtn.textContent = "Save Changes";
    }

    function dropDownClients() {
        if ( !dropDown ) {
            return;
        }

        dropDown.innerHTML = `<option value = "">Select Client</option>`;
        let clients = JSON.parse(localStorage.getItem("clients")) || [];
        clients.forEach((client,index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = client.name;
            dropDown.appendChild(option);
        });
    }
    
    function displayTasksForClient() {
        const selectedIndex = dropDown.value;
        taskList.innerHTML = "";
        if ( selectedIndex === "" ) {
            taskList.innerHTML = "<p>Please select a client to view tasks!</p>";
            return;
        }

        let clients = JSON.parse(localStorage.getItem("clients")) || [];
        const client = clients[selectedIndex];

        if ( !client.tasks || client.tasks.length === 0 ) {
            taskList.innerHTML = "<p>No task found for this client!</p>";
            return;
        }

        client.tasks.forEach((task,index) => {
            const div = document.createElement("div");
            div.className = "taskCard";
            div.innerHTML = `
            <h3>${task.title}</h3>
            <p><strong>Deadline:</strong>${task.deadline}</p>
            <p><strong>Requirements:</strong> ${task.requirements}</p>
            <p><strong>Payment:</strong> ${task.payment}$</p>
            <p><strong>Payment Status:</strong> ${task.paymentStatus}</p>
            <p><strong>Progress:</strong> ${task.progress}%</p>
            <p><em>Added: ${task.timeStamp}</em></p>
            <button type = "button" class = "editTaskBtn" data-index = "${index}">Edit</button>
            <button type = "button" class = "removeTaskBtn" data-index = "${index}">Remove</button>
            ${task.paymentStatus !== "paid" ? `<button type = "button" class = "markPaidBtn" data-index = "${index}">Mark As Paid</button>` : ""}
            `;
            taskList.appendChild(div);
        });
        document.querySelectorAll(".removeTaskBtn").forEach(button => {
            button.addEventListener("click", function() {
                const taskIndex = this.dataset.index;
                removeTask(taskIndex);
            })
        });
        document.querySelectorAll(".editTaskBtn").forEach(button => {
            button.addEventListener("click",function() {
                const taskIndex = this.dataset.index;
                editTask(taskIndex);
            })
        });
        document.querySelectorAll(".markPaidBtn").forEach(button => {
            button.addEventListener("click",function() {
                const taskIndex = this.dataset.index;
                markTaskAsPaid(taskIndex);
            });
        });
    }

    function removeClient(index) {
        let clients = JSON.parse(localStorage.getItem("clients")) || [];
        clients.splice(index,1);
        localStorage.setItem("clients",JSON.stringify(clients));
        displayClients();
        dropDownClients();
    }
    function removeTask(taskIndex) {
        const selectedIndex = dropDown.value;
        let clients = JSON.parse(localStorage.getItem("clients")) || [];
        clients[selectedIndex].tasks.splice(taskIndex, 1);
        localStorage.setItem("clients",JSON.stringify(clients));
        displayTasksForClient();
    }

    function editTask(taskIndex) {
        const selectedIndex = dropDown.value;
        let clients = JSON.parse(localStorage.getItem("clients")) || [];
        const task = clients[selectedIndex].tasks[taskIndex];

        taskTitle.value = task.title;
        taskDeadline.value = task.deadline;
        taskRequirements.value = task.requirements;
        taskPayment.value = task.payment;
        taskProgress.value = task.progress;
        editingTaskIndex = taskIndex;
        submit.textContent = "Save Task Changes"; 
    }

    function markTaskAsPaid(taskIndex) {
        const selectedIndex = dropDown.value;
        let clients = JSON.parse(localStorage.getItem("clients")) || [];
        let task = clients[selectedIndex].tasks[taskIndex];

        task.paymentStatus = "paid";
        task.paymentDate = new Date().toISOString();

        localStorage.setItem("clients",JSON.stringify(clients));
        displayTasksForClient();
    }

});
