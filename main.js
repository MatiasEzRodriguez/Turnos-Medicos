import { fetchPatients, addPatient, deletePatient, cancelEditPatient } from './patientManagement.js';
import { fetchTurns, addTurn, deleteTurn, cancelEditTurn } from './turnManagement.js';
import { showPatientForm, showTurnsForm } from './ui.js';

document.addEventListener("DOMContentLoaded", () => {
    fetchPatients();
    fetchTurns();
});

document.getElementById('confirmDeleteTurnBtn').addEventListener('click', () => deleteTurn());
document.getElementById('confirmDeletePatientBtn').addEventListener('click', () => deletePatient());
document.getElementById('patientForm').addEventListener('submit', () => addPatient(event));
document.getElementById('turnsForm').addEventListener('submit', () => addTurn(event));
document.getElementById('cancelEditTurn').addEventListener('click', () => cancelEditTurn());
document.getElementById('cancelEditPatient').addEventListener('click', () => cancelEditPatient());
document.getElementById('patientsLink').addEventListener('click', () => showPatientForm(event));
document.getElementById('turnsLink').addEventListener('click', () => showTurnsForm(event));
