fetch("http://localhost:3000/tasks")
	.then((response) => response.json())
	.then((tasks) => {
		tasks.forEach((task) => {
			const taskCard = document.createElement("div");
			taskCard.classList.add("taskcard");
			taskCard.innerHTML = `
       <h2>${task.title}</h2>
	   <p>Erledigt?: <span class="${task.completed ? 'completed' : ''}">${task.completed ? 'Ja' : 'Nein'}</span></p>
       <h1></h1><p>id: ${task.id}</p>`;
			document.querySelector(".mytasks").appendChild(taskCard);
		});
	});
