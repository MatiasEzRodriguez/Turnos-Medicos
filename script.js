class Patient {
    constructor(_name, _lastName, _dni, _mail, _id) {
        this.name = _name;
        this.lastName = _lastName;
        this.dni = _dni;
        this.mail = _mail;
        this.id = _id ? _id : 0;
    }
}
class Turn {
    constructor(_date, _patientName, _patientLastName, _patientDni, _id) {
        this.date = _date;
        this.patientName = _patientName;
        this.patientLastName = _patientLastName;
        this.patientDni = _patientDni;
        this.id = _id ? _id : 0;
    }
}
var name = "";
var lastName = "";
var dni = "";
var mail = "";
var patientList = []
var turnList = []
var idToDelete = "";
var nameToDelete = "";
var lastNameToDelete = "";
var dateToDelete = new Date();

document.addEventListener("DOMContentLoaded", () => {
    fetch('http://localhost:3000/patients')
        .then(response => response.json())
        .then(data => {
            // Manejar la respuesta JSON recibida del endpoint
            // console.log('Respuesta del endpoint:', data);
            data.forEach(element => {
                var patientToAdd = new Patient(element.name, element.lastName, element.dni, element.mail, element.id)
                patientList.push(patientToAdd);
                var patientOption = document.createElement('option');
                patientOption.innerHTML = 'Nombre: ' + patientToAdd.name + '  ' + '-' + ' ' + 'Apellido: ' + patientToAdd.lastName;
                patientOption.value = patientToAdd.dni;
                document.getElementById('patientSelect').appendChild(patientOption);
            });
            showPatientList();
        })
        .catch(error => {
            console.error('Error al hacer la solicitud Fetch:', error);
        });

    fetch('http://localhost:3000/medical-dates')
        .then(response => response.json())
        .then(data => {
            // Manejar la respuesta JSON recibida del endpoint
            // console.log('Respuesta del endpoint:', data);
            data.forEach(element => {
                var turnToAdd = new Turn(element.date, element.name, element.lastName, element.dni, element.turnId)
                turnList.push(turnToAdd);
            });
            showTurnList();
        })
        .catch(error => {
            console.error('Error al hacer la solicitud Fetch:', error);
        });

});

function showPatientList() {
    const patientsDivList = document.getElementById('patientsList');
    patientsDivList.innerHTML = '';
    // Recorrer la array de pacientes y crear elementos HTML para cada paciente
    patientList.forEach(patient => {
        const patientDiv = document.createElement('div');
        patientDiv.classList.add('row');

        // Crear elementos para name y lastName
        const nameDiv = document.createElement('div');
        nameDiv.classList.add('col-3');
        nameDiv.textContent = `${patient.name} ${patient.lastName}`;
        patientDiv.appendChild(nameDiv);

        // Crear elemento para dni
        const dniDiv = document.createElement('div');
        dniDiv.classList.add('col-3');
        dniDiv.textContent = `DNI: ${patient.dni}`;
        patientDiv.appendChild(dniDiv);

        // Crear elemento para mail
        const mailDiv = document.createElement('div');
        mailDiv.classList.add('col-3');
        mailDiv.textContent = `Mail: ${patient.mail}`;
        patientDiv.appendChild(mailDiv);

        // Crear elementos para los botones de editar y eliminar
        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('col-3');

        const editBtn = document.createElement('button');
        editBtn.textContent = 'E';
        editBtn.classList.add('btn', 'btn-primary');
        editBtn.addEventListener('click', () => editPatient(patient)); // Asociar evento click para editar

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'D';
        deleteBtn.classList.add('btn', 'btn-danger');
        deleteBtn.setAttribute('data-bs-toggle', 'modal');
        deleteBtn.setAttribute('data-bs-target', '#confirmDeletePatientModal');
        deleteBtn.addEventListener('click', () => deletePatientHandler(patient)); // Asociar evento click para eliminar

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        patientDiv.appendChild(actionsDiv);

        // Agregar el div del paciente al contenedor principal
        patientsDivList.appendChild(patientDiv);
    });
}

function showTurnList() {
    const turnsDivList = document.getElementById('turnList');
    turnsDivList.innerHTML = '';
    // Recorrer la array de pacientes y crear elementos HTML para cada paciente
    turnList.forEach(turn => {
        const turnDiv = document.createElement('div');
        turnDiv.classList.add('row');
        // Formatear la fecha
        const dateToAdd = new Date(turn.date);
        const formatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const formatDate = dateToAdd.toLocaleString('es-AR', formatOptions);
        // Crear elementos para la fecha
        const dateDiv = document.createElement('div');
        dateDiv.classList.add('col-3');
        dateDiv.textContent = `${formatDate}`;
        turnDiv.appendChild(dateDiv);

        // Crear elementos para name y lastName
        const nameDiv = document.createElement('div');
        nameDiv.classList.add('col-3');
        nameDiv.textContent = `${turn.patientName} ${turn.patientLastName}`;
        turnDiv.appendChild(nameDiv);

        // Crear elemento para dni
        const dniDiv = document.createElement('div');
        dniDiv.classList.add('col-3');
        dniDiv.textContent = `DNI: ${turn.patientDni}`;
        turnDiv.appendChild(dniDiv);

        // Crear elementos para los botones de editar y eliminar
        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('col-3');

        const editBtn = document.createElement('button');
        editBtn.textContent = 'E';
        editBtn.classList.add('btn', 'btn-primary');
        editBtn.addEventListener('click', () => editTurn(turn)); // Asociar evento click para editar

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'D';
        deleteBtn.classList.add('btn', 'btn-danger');
        deleteBtn.setAttribute('data-bs-toggle', 'modal');
        deleteBtn.setAttribute('data-bs-target', '#confirmDeleteTurnModal');
        deleteBtn.addEventListener('click', () => deleteTurnHandler(turn)); // Asociar evento click para eliminar

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        turnDiv.appendChild(actionsDiv);

        // Agregar el div del turno al contenedor principal
        turnsDivList.appendChild(turnDiv);
    });
}

// Función para editar un paciente
function editPatient(patient) {
    var editName = document.getElementById('name');
    var editLastName = document.getElementById('lastName');
    var editDni = document.getElementById('dni');
    var editMail = document.getElementById('mail');
    editName.value = patient.name;
    editLastName.value = patient.lastName;
    editDni.value = patient.dni;
    editMail.value = patient.mail;
}
//funcion para editar un turno
function editTurn(turn) {
    var editDate = document.getElementById('turnDate');
    var editPatient = document.getElementById('patientSelect');
    var isoDate = turn.date; // Fecha y hora en formato ISO 8601
    var dateObj = new Date(isoDate); // Convertir la cadena ISO a objeto Date
    var year = dateObj.getFullYear();
    var month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // El mes va de 0 a 11 en JavaScript
    var day = dateObj.getDate().toString().padStart(2, '0');
    var hours = dateObj.getHours().toString().padStart(2, '0');
    var minutes = dateObj.getMinutes().toString().padStart(2, '0');
    // Formatear la fecha y hora en el formato requerido para datetime-local
    var formattedDate = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes;
    // Asignar el valor al input de tipo datetime-local
    editDate.value = formattedDate;
    var patientDni = turn.patientDni;
    // Iterar sobre las opciones del select para encontrar la opción con el valor deseado
    for (var i = 0; i < editPatient.options.length; i++) {
        if (editPatient.options[i].value == patientDni) {
            editPatient.selectedIndex = i; // Seleccionar la opción encontrada
            break; // Salir del bucle una vez encontrada la opción
        }
    }
}

// Función para eliminar un paciente
function deletePatient() {
    fetch('http://localhost:3000/patients/' + idToDelete, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log('respuesta del servidor: ', data);
            patientList = patientList.filter(patient => patient.id !== idToDelete);
            showPatientList();
            alert("El paciente " + nameToDelete + " " + lastNameToDelete + " fue eliminado con exito!");
        })
        .catch(error => {
            console.error('No se pudo borrar el paciente:', error);
        });
    // Cierra el modal después de la confirmación
    const confirmDeletePatientModal = document.getElementById('confirmDeletePatientModal');
    const bootstrapPatientModal = bootstrap.Modal.getInstance(confirmDeletePatientModal);
    bootstrapPatientModal.hide();
}

function addPatient(event) {
    event.preventDefault(); // Evita que se recargue la página al enviar el formulario

    // Obtener los valores ingresados por el usuario
    var name = document.getElementById('name').value;
    var lastName = document.getElementById('lastName').value;
    var dni = document.getElementById('dni').value;
    var mail = document.getElementById('mail').value;
    var patientToAdd = new Patient(name, lastName, dni, mail);

    if (patientList.find(patient => patient.dni == patientToAdd.dni)) {
        var index = patientList.findIndex((patient) => patient.dni == patientToAdd.dni);
        const reqBody = {
            name: name,
            lastName: lastName,
            dni: dni,
            mail: mail,
        }
        console.log('reqBody: ', reqBody)
        fetch('http://localhost:3000/patients/' + patientList[index].id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqBody)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Respuesta del servidor:', data);
                const updatedPatient = patientList.find(patientInList => patientInList.id == data.id)
                if (updatedPatient) {
                    updatedPatient.name = data.name;
                    updatedPatient.lastName = data.lastName;
                    updatedPatient.dni = data.dni;
                    updatedPatient.mail = data.mail;
                }
                console.log('list after update: ', patientList);
                showPatientList();
                document.getElementById('patientForm').reset();
            })
            .catch(error => {
                console.error('Error al editar paciente:', error);
            });

    }
    else {
        // Realizar una solicitud Fetch para enviar el paciente al backend
        fetch('http://localhost:3000/patients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patientToAdd),
        })
            .then(response => response.json())
            .then(data => {
                // Manejar la respuesta del servidor si es necesario
                console.log('Respuesta del servidor:', data);
                patientToAdd.id = data.id;
                patientList.push(patientToAdd);
                var patientOption = document.createElement('option');
                patientOption.innerHTML = 'Nombre: ' + name + '  ' + '-' + ' ' + 'Apellido: ' + lastName;
                patientOption.value = dni;
                document.getElementById('patientSelect').appendChild(patientOption);
                showPatientList();
                // Limpiar el formulario después de enviar
                document.getElementById('patientForm').reset();
            })
            .catch(error => {
                console.error('Error al enviar el paciente:', error);
            });
    }
}

// Función para mostrar el modal de confirmación al hacer clic en el botón "Eliminar"
function deletePatientHandler(patient) {
    idToDelete = patient.id;
    nameToDelete = patient.name;
    lastNameToDelete = patient.lastName;
}
function deleteTurnHandler(turn) {
    idToDelete = turn.id;
    nameToDelete = turn.patientName;
    lastNameToDelete = turn.patientLastName;
    dateToDelete = turn.date;
}

function addTurn(event) {
    event.preventDefault();
    var selectedDni = document.getElementById('patientSelect').value;
    var selectedDate = document.getElementById('turnDate').value;
    //formatear la hora
    const dateToFormat = new Date(selectedDate);
    //const formatedDate = dateToFormat.toISOString().replace('T', ' ').slice(0, 19);
    const formatedDate = dateToFormat.toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', hour12: false });
    const formatedDateQuoted = '"' + formatedDate + '"';
    var selectedPatient = patientList.find((patient) => patient.dni == selectedDni) // devuelve el primer paciente que satisface la condicion
    var turnToAdd = new Turn(selectedDate, selectedPatient.name, selectedPatient.lastName, selectedPatient.dni);
    if (turnList.find(turn => turn.date.slice(0, -8) == selectedDate)) {
        alert("La fecha del turno que se intenta ingresar ya se encuentra reservada");
    }
    else {
        if (turnList.find(turn => turn.patientDni == selectedDni)) {
            var index = turnList.findIndex((turn) => turn.patientDni == selectedDni);
            const reqBody = {
            date: formatedDateQuoted,
            id: selectedPatient.id,
        }
        console.log('reqBody: ', reqBody)
        fetch('http://localhost:3000/medical-dates/' + turnList[index].id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqBody)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Respuesta del servidor:', data);
                const updatedTurn = turnList.find(turnInList => turnInList.id == data.turnId)
                if (updatedTurn) {
                    updatedTurn.date = data.date;
                }
                console.log('list after update: ', turnList);
                showTurnList();
                document.getElementById('turnsForm').reset();
            })
            .catch(error => {
                console.error('Error al editar turno:', error);
            });
        }
        else {
            const turnToCreate = { date: formatedDateQuoted, id: selectedPatient.id };
            // Realizar una solicitud Fetch para enviar el turno al backend
            fetch('http://localhost:3000/medical-dates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(turnToCreate),
            })
                .then(response => response.json())
                .then(data => {
                    turnToAdd.id = data.turnId;
                    console.log('turnId: ', turnToAdd.id);
                    turnList.push(turnToAdd);
                    console.log('list after CREATE', turnList);
                    showTurnList();
                    // Limpiar el formulario después de enviar
                    document.getElementById('turnsForm').reset();
                })
                .catch(error => {
                    console.error('Error al enviar el paciente:', error);
                });
        }
    }
}

function deleteTurn() {
    fetch('http://localhost:3000/medical-dates/' + idToDelete, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (response.status === 500) {
                throw new Error("SERVER ERROR");
            }
            response.json()
        })
        .then(data => {
            console.log('respuesta del servidor: ', data);
            turnList = turnList.filter(turn => turn.id !== idToDelete);
            showTurnList();
            alert("El turno correspondiente a " + nameToDelete + " " + lastNameToDelete + " con fecha " + dateToDelete + " fue eliminado con exito!");
        })
        .catch(error => {
            console.error('No se pudo borrar el paciente:', error);
            alert("El turno no pudo ser borrado");
        });
    // Cierra el modal después de la confirmación
    const confirmDeleteTurnModal = document.getElementById('confirmDeleteTurnModal');
    const bootstrapTurnModal = bootstrap.Modal.getInstance(confirmDeleteTurnModal);
    bootstrapTurnModal.hide();
}


// mostrar / ocultar formularios ---
var patientsLink = document.getElementById('patientsLink');
var turnsLink = document.getElementById('turnsLink');
var turnsDiv = document.getElementById('turnsDiv');
var patientDiv = document.getElementById('patientDiv');

function showPatientForm(event) {
    patientDiv.style.display = 'flex';
    turnsDiv.style.display = 'none';
    patientsLink.classList.add("active");
    turnsLink.classList.remove("active");
}

function showTurnsForm(event) {
    turnsDiv.style.display = 'flex';
    patientDiv.style.display = 'none';
    turnsLink.classList.add("active");
    patientsLink.classList.remove("active");
}

document.getElementById('confirmDeleteTurnBtn').addEventListener('click', () => deleteTurn());
document.getElementById('confirmDeletePatientBtn').addEventListener('click', () => deletePatient());
document.getElementById('patientForm').addEventListener('submit', () => addPatient(event));
document.getElementById('turnsForm').addEventListener('submit', () => addTurn(event));
document.getElementById('patientsLink').addEventListener('click', () => showPatientForm(event));
document.getElementById('turnsLink').addEventListener('click', () => showTurnsForm(event));




