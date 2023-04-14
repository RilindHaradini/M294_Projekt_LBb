//GET
const token = sessionStorage.getItem("Key");
if (!token) {
	window.location.href = "/public/login.html";
}

const headers = {
	"Content-Type": "application/json",
	Authorization: `Bearer ${token}`,
};

function showAllTasks() {
	document.addEventListener("DOMContentLoaded", () => {
		const taskList = document.querySelector(".mytasks");

		fetch("http://localhost:3000/auth/jwt/tasks", {
			headers: headers,
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(
						"Die Netzwerk-Antwort war nicht in Ordnung"
					);
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
}

//DELETE
const taskList = document.querySelector(".mytasks");

function createTaskCard(task) {
	const card = document.createElement("div");
	card.className = "card";
	card.setAttribute("data-id", task.id);

	const title = document.createElement("h2");
	title.textContent = task.title;
	card.appendChild(title);

	const taskID = document.createElement("p");
	taskID.className = "taskID";
	taskID.textContent = `ID: ${task.id}`;
	card.appendChild(taskID);

	const completed = document.createElement("p");
	completed.className = "completed";
	completed.textContent = `Erledigt: ${task.completed}`;
	card.appendChild(completed);

	const trashButton = document.createElement("i");
	trashButton.className = "trashButton fa-sharp fa-solid fa-trash fa-lg";
	trashButton.addEventListener("click", () => {
		deleteTask(task.id);
		card.remove();
	});
	const penButton = document.createElement("i");
	penButton.className = "penButton fa-sharp fa-solid fa-pen fa-lg";
	penButton.addEventListener("click", () => {
		EditPrompt(task.id);
	});
	card.appendChild(trashButton);
	card.appendChild(penButton);

	return card;
}

function deleteTask(taskId) {
	fetch(`http://localhost:3000/auth/jwt/task/${taskId}`, {
		method: "DELETE",
		headers: headers,
		body: JSON.stringify({ taskId: taskId }),
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Die Netzwerk-Antwort war nicht in Ordnung");
			}
			return response.json();
		})
		.then((data) => {
			alert("Aufgabe wurde erfolgreich entfernt:", data);
		})
		.catch((error) => {
			alert("Fehler aufgetreten beim entfernen der Aufgabe:", error);
		});
}

//POST
const taskInput = document.querySelector(".task-input");
const erledigtJa = document.querySelector("#erledigt-ja");
const erledigtNein = document.querySelector("#erledigt-nein");

const addButton = document.querySelector(".addBtn");
addButton.addEventListener("click", () => {
	const data = {
		title: taskInput.value,
		completed: erledigtJa.checked,
	};

	fetch("http://localhost:3000/auth/jwt/tasks", {
		method: "POST",
		headers: headers,
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

function EditPrompt(taskId) {
	const card = document.querySelector(`.card[data-id="${taskId}"]`);
	const title = card.querySelector("h2").innerHTML;
	const erledigtStatus = card.querySelector(".completed").innerHTML;

	const newTitle = prompt("Gebe einen neuen Titel ein:", title);
	const newCompleted = confirm("Ist die Aufgabe erledigt?");

	const data = {
		id: taskId,
		title: newTitle,
		completed: newCompleted,
	};

	fetch(`http://localhost:3000/auth/jwt/tasks`, {
		method: "PUT",
		headers: headers,
		body: JSON.stringify(data),
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Die Netzwerk-Antwort war nicht in Ordnung");
			}
			return response.json();
		})
		.then((updatedTask) => {
			card.querySelector("h2").textContent = updatedTask.title;
			card.querySelector(".completed").textContent = updatedTask.completed
				? "true"
				: "false";
			alert("Aufgabe erfolgreich aktualisiert!");
			location.reload();
		})
		.catch((error) => {
			alert("Fehler beim Aktualisieren der Aufgabe:", error);
		});
}

// GET task by ID
function getTaskById(taskId) {
	const url = `http://localhost:3000/auth/jwt/task/${taskId}`;
	return fetch(url, {
		headers: headers,
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Die Netzwerk-Antwort war nicht in Ordnung");
			}
			return response.json();
		})
		.then((task) => {
			const taskCard = createTaskCard(task);
			const taskContainer = document.querySelector(".mytasks");
			document.getElementsByClassName("titleDiv")[0].innerHTML =
				"Meine Aufgabe";

			taskContainer.innerHTML = "";
			taskContainer.appendChild(taskCard);
		})
		.catch((error) => {
			console.error("Fehler beim Laden der Aufgabe:", error);
		});
}
showId();
function showId() {
	const urlParams = new URLSearchParams(window.location.search);
	const taskId = urlParams.get("id");
	if (taskId) {
		getTaskById(taskId);
	} else {
		showAllTasks();
	}
}

//Ich habe manche Errors mit ChatGPT untersucht