import { Patient } from './patient.js';
import { showPatientList } from './ui.js';

export var patientList = [];
export var idToDelete = "";
export var nameToDelete = "";
export var lastNameToDelete = "";

export function fetchPatients() {
    fetch('http://localhost:3000/patients')
        .then(response => response.json())
        .then(data => {
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
}

export function addPatient(event) {
    event.preventDefault();
    var name = document.getElementById('name').value;
    var lastName = document.getElementById('lastName').value;
    var dni = document.getElementById('dni').value;
    var mail = document.getElementById('mail').value;
    var patientToAdd = new Patient(name, lastName, dni, mail);

    if (patientList.find(patient => patient.dni == patientToAdd.dni)) {
        var index = patientList.findIndex((patient) => patient.dni == patientToAdd.dni);
        const reqBody = { name, lastName, dni, mail };
        fetch('http://localhost:3000/patients/' + patientList[index].id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reqBody)
        })
            .then(response => response.json())
            .then(data => {
                const updatedPatient = patientList.find(patientInList => patientInList.id == data.id);
                if (updatedPatient) {
                    updatedPatient.name = data.name;
                    updatedPatient.lastName = data.lastName;
                    updatedPatient.dni = data.dni;
                    updatedPatient.mail = data.mail;
                }
                showPatientList();
                document.getElementById('patientForm').reset();
            })
            .catch(error => {
                console.error('Error al editar paciente:', error);
            });

    } else {
        fetch('http://localhost:3000/patients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patientToAdd)
        })
            .then(response => response.json())
            .then(data => {
                patientToAdd.id = data.id;
                patientList.push(patientToAdd);
                var patientOption = document.createElement('option');
                patientOption.innerHTML = 'Nombre: ' + name + '  ' + '-' + ' ' + 'Apellido: ' + lastName;
                patientOption.value = dni;
                document.getElementById('patientSelect').appendChild(patientOption);
                showPatientList();
                document.getElementById('patientForm').reset();
            })
            .catch(error => {
                console.error('Error al enviar el paciente:', error);
            });
    }
}

export function deletePatient() {
    fetch('http://localhost:3000/patients/' + idToDelete, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => response.json())
        .then(data => {
            patientList = patientList.filter(patient => patient.id !== idToDelete);
            showPatientList();
            alert("El paciente " + nameToDelete + " " + lastNameToDelete + " fue eliminado con exito!");
        })
        .catch(error => {
            console.error('No se pudo borrar el paciente:', error);
        });

    const confirmDeletePatientModal = document.getElementById('confirmDeletePatientModal');
    const bootstrapPatientModal = bootstrap.Modal.getInstance(confirmDeletePatientModal);
    bootstrapPatientModal.hide();
}

export function editPatient(patient) {
    var editName = document.getElementById('name');
    var editLastName = document.getElementById('lastName');
    var editDni = document.getElementById('dni');
    var editMail = document.getElementById('mail');
    editName.value = patient.name;
    editLastName.value = patient.lastName;
    editDni.value = patient.dni;
    editMail.value = patient.mail;
    const cancelEdit = document.getElementById('cancelEditPatient');
    cancelEdit.style.display = 'flex';
}

export function cancelEditPatient() {
    const cancelEdit = document.getElementById('cancelEditPatient');
    cancelEdit.style.display = 'none';
    document.getElementById('patientForm').reset();
}


export function deletePatientHandler(patient) {
    idToDelete = patient.id;
    nameToDelete = patient.name;
    lastNameToDelete = patient.lastName;
}
