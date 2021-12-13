var formE1 = document.querySelector("#task-form");
var tasksToDoE1 = document.querySelector("#tasks-to-do");

var taskFormHandler = function(event) {
    event.preventDefault();
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    //check for blanks in task inputs
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to complete the fields first!!");
        return false;
    }
    formE1.reset();
    //package resulting data as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };
    //send it as an argument to createTAskE1
    createTaskE1(taskDataObj);
}
var createTaskE1 = function(taskDataObj) {
    var listItemE1 = document.createElement("li");
    listItemE1.className = "task-item";
    var taskInfoE1 = document.createElement("div");
    taskInfoE1.className = "task-info";
    taskInfoE1.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemE1.appendChild(taskInfoE1);

    tasksToDoE1.appendChild(listItemE1);

}
formE1.addEventListener("submit", taskFormHandler);


