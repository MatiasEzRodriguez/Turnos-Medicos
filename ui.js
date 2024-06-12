import { patientList, editPatient, deletePatientHandler } from './patientManagement.js';
import { turnList, editTurn, deleteTurnHandler } from './turnManagement.js';

export function showPatientList() {
    const patientsDivList = document.getElementById('patientsList');
    patientsDivList.innerHTML = '';
    patientList.forEach(patient => {
        const patientDiv = document.createElement('div');
        patientDiv.classList.add('row');
        const nameDiv = document.createElement('div');
        nameDiv.classList.add('col-3');
        nameDiv.textContent = `${patient.name} ${patient.lastName}`;
        patientDiv.appendChild(nameDiv);
        const dniDiv = document.createElement('div');
        dniDiv.classList.add('col-3');
        dniDiv.textContent = `DNI: ${patient.dni}`;
        patientDiv.appendChild(dniDiv);
        const mailDiv = document.createElement('div');
        mailDiv.classList.add('col-3');
        mailDiv.textContent = `Mail: ${patient.mail}`;
        patientDiv.appendChild(mailDiv);
        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('col-3');
        const editBtn = document.createElement('button');
        editBtn.textContent = 'E';
        editBtn.classList.add('btn', 'btn-primary');
        editBtn.addEventListener('click', () => editPatient(patient));
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'D';
        deleteBtn.classList.add('btn', 'btn-danger');
        deleteBtn.setAttribute('data-bs-toggle', 'modal');
        deleteBtn.setAttribute('data-bs-target', '#confirmDeletePatientModal');
        deleteBtn.addEventListener('click', () => deletePatientHandler(patient));
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        patientDiv.appendChild(actionsDiv);
        patientsDivList.appendChild(patientDiv);
    });
}

export function showTurnList() {
    const turnsDivList = document.getElementById('turnList');
    turnsDivList.innerHTML = '';
    turnList.forEach(turn => {
        const turnDiv = document.createElement('div');
        turnDiv.classList.add('row');
        const dateToAdd = new Date(turn.date);
        const formatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const formatDate = dateToAdd.toLocaleString('es-AR', formatOptions);
        const dateDiv = document.createElement('div');
        dateDiv.classList.add('col-3');
        dateDiv.textContent = `${formatDate}`;
        turnDiv.appendChild(dateDiv);
        const nameDiv = document.createElement('div');
        nameDiv.classList.add('col-3');
        nameDiv.textContent = `${turn.patientName} ${turn.patientLastName}`;
        turnDiv.appendChild(nameDiv);
        const dniDiv = document.createElement('div');
        dniDiv.classList.add('col-3');
        dniDiv.textContent = `DNI: ${turn.patientDni}`;
        turnDiv.appendChild(dniDiv);
        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('col-3');
        const editBtn = document.createElement('button');
        editBtn.textContent = 'E';
        editBtn.classList.add('btn', 'btn-primary');
        editBtn.addEventListener('click', () => editTurn(turn));
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'D';
        deleteBtn.classList.add('btn', 'btn-danger');
        deleteBtn.setAttribute('data-bs-toggle', 'modal');
        deleteBtn.setAttribute('data-bs-target', '#confirmDeleteTurnModal');
        deleteBtn.addEventListener('click', () => deleteTurnHandler(turn));
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        turnDiv.appendChild(actionsDiv);
        turnsDivList.appendChild(turnDiv);
    });
}

export function showPatientForm(event) {
    const patientDiv = document.getElementById('patientDiv');
    const turnsDiv = document.getElementById('turnsDiv');
    const patientsLink = document.getElementById('patientsLink');
    const turnsLink = document.getElementById('turnsLink');

    patientDiv.style.display = 'flex';
    turnsDiv.style.display = 'none';
    patientsLink.classList.add("active");
    turnsLink.classList.remove("active");
}

export function showTurnsForm(event) {
    const patientDiv = document.getElementById('patientDiv');
    const turnsDiv = document.getElementById('turnsDiv');
    const patientsLink = document.getElementById('patientsLink');
    const turnsLink = document.getElementById('turnsLink');

    turnsDiv.style.display = 'flex';
    patientDiv.style.display = 'none';
    turnsLink.classList.add("active");
    patientsLink.classList.remove("active");
}
