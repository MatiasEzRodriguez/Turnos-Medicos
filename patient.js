export class Patient {
    constructor(_name, _lastName, _dni, _mail, _id) {
        this.name = _name;
        this.lastName = _lastName;
        this.dni = _dni;
        this.mail = _mail;
        this.id = _id ? _id : 0;
    }
}
