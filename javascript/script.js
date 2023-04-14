const token = sessionStorage.getItem("Key");
if (!token) {
	window.location.href = "/public/login.html";
}

document.addEventListener("DOMContentLoaded", () => {
	const taskList = document.querySelector(".mytasks");

	fetch("http://localhost:3000/tasks")
		.then((response) => {
			if (!response.ok) {
				throw new Error("Die Netzwerk-Antwort war nicht in Ordnung");
			}
			return response.json();
		})
		.then((tasks) => {
			tasks.forEach((task) => {
				const taskCard = createTaskCard(task);
				taskList.appendChild(taskCard);
			});
		})
		.catch((error) => {
			console.error("Fehler beim Laden der Aufgaben:", error);
		});
});

function createTaskCard(task) {
	const taskCard = document.createElement("div");
	taskCard.classList.add("taskcard");
	taskCard.innerHTML = `
	  <h2>${task.title}</h2>
	  <p>Erledigt?: <span class="${task.completed ? "completed" : ""}">${
		task.completed ? "Ja" : "Nein"
	}</span></p>
	  <h1></h1><p>id: ${task.id}</p>`;
	return taskCard;
}

const taskList = document.querySelector(".mytasks");

function createTaskCard(task) {
	const card = document.createElement("div");
	card.className = "card";

	const title = document.createElement("h2");
	title.textContent = task.title;
	card.appendChild(title);

	const taskID = document.createElement("p");
	taskID.className = "taskID";
	taskID.textContent = `ID: ${task.id}`;
	card.appendChild(taskID);

	const completed = document.createElement("p");
	completed.textContent = `Erledigt?: ${task.completed}`;
	card.appendChild(completed);

	const deleteButton = document.createElement("i");
	deleteButton.className = "deleteButton fa-sharp fa-solid fa-trash fa-lg";
	deleteButton.addEventListener("click", () => {
		deleteTask(task.id);
		card.remove();
	});
	card.appendChild(deleteButton);

	return card;
}

function deleteTask(taskId) {
	fetch(`http://localhost:3000/task/${taskId}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ taskId: taskId }),
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Die Netzwerk-Antwort war nicht in Ordnung");
			}
			return response.json();
		})
		.then((data) => {
			console.log("Aufgabe wurde erfolgreich entfernt:", data);
		})
		.catch((error) => {
			console.error("Fehler beim entfernen der Aufgabe:", error);
		});
}

const taskInput = document.querySelector(".task-input");
const erledigtJa = document.querySelector("#erledigt-ja");
const erledigtNein = document.querySelector("#erledigt-nein");

const addButton = document.querySelector(".addBtn");
addButton.addEventListener("click", () => {
	const data = {
		title: taskInput.value,
		completed: erledigtJa.checked,
	};

	fetch("http://localhost:3000/tasks", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	}).then((response) => {
		if (!response.ok) {
			alert("Fehler beim Hinzufügen der Aufgabe");
		} else {
			alert("Hinzufügen der Aufgabe war erfolgreich");
			const card = createTaskCard(data);
			taskList.appendChild(card);
			location.reload();
		}
	});
});
