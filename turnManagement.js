import { Turn } from './turn.js';
import { showTurnList } from './ui.js';
import { patientList } from './patientManagement.js';

export var turnList = [];
export var idToDelete = "";
export var idToEdit = "";
export var nameToDelete = "";
export var lastNameToDelete = "";
export var dateToDelete = new Date();

export function fetchTurns() {
    fetch('http://localhost:3000/medical-dates')
        .then(response => response.json())
        .then(data => {
            data.forEach(element => {
                var turnToAdd = new Turn(element.date, element.name, element.lastName, element.dni, element.turnId);
                turnList.push(turnToAdd);
            });
            showTurnList();
        })
        .catch(error => {
            console.error('Error al hacer la solicitud Fetch:', error);
        });
}

export function addTurn(event) {
    event.preventDefault();
    var selectedDni = document.getElementById('patientSelect').value;
    var selectedDate = document.getElementById('turnDate').value;
    const dateToFormat = new Date(selectedDate);
    const formatedDate = dateToFormat.toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', hour12: false });
    const formatedDateQuoted = '"' + formatedDate + '"';
    var selectedPatient = patientList.find((patient) => patient.dni == selectedDni);
    var turnToAdd = new Turn(selectedDate, selectedPatient.name, selectedPatient.lastName, selectedPatient.dni);

    if (turnList.find(turn => turn.date.slice(0, -8) == selectedDate)) {
        alert("La fecha y horario del turno que se intenta ingresar ya se encuentra reservada");
    } else {
        if (turnList.find(turn => turn.id == idToEdit)) {
            const reqBody = { date: formatedDateQuoted, id: selectedPatient.id };
            fetch('http://localhost:3000/medical-dates/' + idToEdit, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reqBody)
            })
                .then(response => response.json())
                .then(data => {
                    const updatedTurn = turnList.find(turnInList => turnInList.id == data.turnId);
                    if (updatedTurn) {
                        updatedTurn.date = data.date;
                    }
                    showTurnList();
                    document.getElementById('turnsForm').reset();
                    idToEdit = undefined;
                })
                .catch(error => {
                    console.error('Error al editar turno:', error);
                });
        } else {
            const turnToCreate = { date: formatedDateQuoted, id: selectedPatient.id };
            fetch('http://localhost:3000/medical-dates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(turnToCreate),
            })
                .then(response => response.json())
                .then(data => {
                    turnToAdd.id = data.turnId;
                    turnList.push(turnToAdd);
                    showTurnList();
                    document.getElementById('turnsForm').reset();
                })
                .catch(error => {
                    console.error('Error al enviar el paciente:', error);
                });
        }
    }
}

export function deleteTurn() {
    fetch('http://localhost:3000/medical-dates/' + idToDelete, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => {
            if (response.status === 500) {
                throw new Error("SERVER ERROR");
            }
            response.json();
        })
        .then(data => {
            turnList = turnList.filter(turn => turn.id !== idToDelete);
            showTurnList();
            alert("El turno correspondiente a " + nameToDelete + " " + lastNameToDelete + " con fecha " + dateToDelete + " fue eliminado con exito!");
        })
        .catch(error => {
            console.error('No se pudo borrar el paciente:', error);
            alert("El turno no pudo ser borrado");
        });

    const confirmDeleteTurnModal = document.getElementById('confirmDeleteTurnModal');
    const bootstrapTurnModal = bootstrap.Modal.getInstance(confirmDeleteTurnModal);
    bootstrapTurnModal.hide();
}

export function editTurn(turn) {
    var editDate = document.getElementById('turnDate');
    var editPatient = document.getElementById('patientSelect');
    var isoDate = turn.date;
    var dateObj = new Date(isoDate);
    var year = dateObj.getFullYear();
    var month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    var day = dateObj.getDate().toString().padStart(2, '0');
    var hours = dateObj.getHours().toString().padStart(2, '0');
    var minutes = dateObj.getMinutes().toString().padStart(2, '0');
    var formattedDate = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes;
    editDate.value = formattedDate;
    var patientDni = turn.patientDni;
    idToEdit = turn.id;
    const cancelEdit = document.getElementById('cancelEditTurn');
    cancelEdit.style.display = 'flex';

    for (var i = 0; i < editPatient.options.length; i++) {
        if (editPatient.options[i].value == patientDni) {
            editPatient.selectedIndex = i;
            break;
        }
    }
}

export function cancelEditTurn() {
    const cancelEdit = document.getElementById('cancelEditTurn');
    cancelEdit.style.display = 'none';
    idToEdit = undefined;
    document.getElementById('turnsForm').reset();
}

export function deleteTurnHandler(turn) {
    idToDelete = turn.id;
    nameToDelete = turn.patientName;
    lastNameToDelete = turn.patientLastName;
    dateToDelete = turn.date;
}
