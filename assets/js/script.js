var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];

var taskFormHandler = function(event) {
    event.preventDefault();
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    //check for blanks in task inputs
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to complete the fields first!!");
        return false;
    }
    formEl.reset();
//check for a new or current task by seeing if it has the data-task-id
    var isEdit = formEl.hasAttribute("data-task-id");

    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    else {
    //capturing the tasks for persistence to put in the array var tasks = []
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
        status: "to do"
    };
    //send it as an argument to createTAskE1
    createTaskEl(taskDataObj);
    }
};
var createTaskEl = function(taskDataObj) {
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

//add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    tasksToDoEl.appendChild(listItemEl);

    //adding the persistence for the tasks upon refresh
    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);
    saveTasks();
//increase counter by one for each added by user
    taskIdCounter++;

};
var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";
//edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

//delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

//add the dropdown to change the task status
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++) {
        //create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
    
    statusSelectEl.appendChild(statusOptionEl);
    }
     return actionContainerEl;
};

var completeEditTask = function(taskName, taskType, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    //looking up te task by id so we can store it and delete it with a loop
    for (var o = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };
    saveTasks();
    alert("Task is updated!");
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
};

var taskButtonHandler = function(event) {
//get target element from event
    var targetEl = event.target;
    //if edit is clicked:
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    //if delete is clicked:
    else if (targetEl.matches(".delete-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
 };
    

var editTask = function(taskId) {
    console.log("editing task #" + taskId);
    //get task list element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    //get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value= taskType;

    formEl.setAttribute("data-task-id", taskId);

    formEl.querySelector("#save-task").textContent = "Save Task";
};

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    //create new array to hold updated list of tasks
    var updatedTaskArr = [];
    //loop thru them
    for (var i = 0; i < tasks.length; i++) {
        //if tasks[i]id doesn't match the value of taskId then we keep the task
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }
    //reassign tasks arraay to be same as updatedTaskArr
    tasks = updatedTaskArr;
    saveTasks();
};

var taskStatusChangeHandler = function(event) {
    var taskId = event.target.getAttribute("data-task-id");

    var statusValue = event.target.value.toLowerCase();

    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    } else if (statusValue === "in progress") {
            tasksInProgressEl.appendChild(taskSelected);
        } else if (statusValue === "completed") {
            tasksCompletedEl.appendChild(taskSelected);
    }
    //update tasks in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id ===parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    saveTasks();
};
    //this will retrieve tasks from localstorage for the same user
    var loadTasks = function() {
        //retrieve from localstorage
        var savedTasks = localStorage.getItem("tasks");
        //if no tasks then set an empty array and move on
        console.log("did we retrieve from localstorage?");
        if (!savedTasks) {
            return false;

        }
        console.log("we got tasks!");
        //or load the found tasks and parse to the array
        savedTasks = JSON.parse(savedTasks);
        //loop thru the savedTasks array
        for (var i = 0;i < savedTasks.length; i++) {
            createTaskEl(savedTasks[i]);
        }
    };
    // var createTaskEl = function(taskDataObj) {
    //     var listItemEl = document.createElement("li");
    //     listItemEl.className = "task-item";
    
    // //add task id as a custom attribute
    //     listItemEl.setAttribute("data-task-id", taskIdCounter);
    
    //     var taskInfoEl = document.createElement("div");
    //     taskInfoEl.className = "task-info";
    //     taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    //     listItemEl.appendChild(taskInfoEl);
    
    //     var taskActionsEl = createTaskActions(taskIdCounter);
    //     listItemEl.appendChild(taskActionsEl);
    
    //     tasksToDoEl.appendChild(listItemEl);
    
    //     //adding the persistence for the tasks upon refresh
    //     taskDataObj.id = taskIdCounter;
    //     tasks.push(taskDataObj);
    //     saveTasks();
    // //increase counter by one for each added by user
    //     taskIdCounter++;
    
    


//this will push created tasks to local storage for retrieval later by same user
var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

formEl.addEventListener("submit", taskFormHandler);

pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);

loadTasks();