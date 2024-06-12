export class Turn {
    constructor(_date, _patientName, _patientLastName, _patientDni, _id) {
        this.date = _date;
        this.patientName = _patientName;
        this.patientLastName = _patientLastName;
        this.patientDni = _patientDni;
        this.id = _id ? _id : 0;
    }
}
