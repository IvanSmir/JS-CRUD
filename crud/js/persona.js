export class Persona {
    constructor(nombre, ruc, direccion, telefono, id) {
        this._id = id || Date.now();
        this._nombre = nombre;
        this._ruc = ruc;
        this._direccion = direccion;
        this._telefono = telefono;
    }

    _isValid(value) {
        return value != null && value != undefined && value !== '';
    }
    set nombre(value) {
        if (this._isValid(value)) this._nombre = value;
    }

    get nombre() {
        return this._nombre;
    }

    set ruc(value) {
        if (this._isValid(value)) this._ruc = value;
    }

    get ruc() {
        return this._ruc;
    }

    set direccion(value) {
        if (this._isValid(value)) this._direccion = value;
    }

    get direccion() {
        return this._direccion;
    }

    set telefono(value) {
        if (this._isValid(value)) this._telefono = value;
    }

    get telefono() {
        return this._telefono;
    }

    get id() {
        return this._id
    }

}

export class Cliente extends Persona {
    constructor(nombre, ruc, direccion, telefono) {
        super(nombre, ruc, direccion, telefono);
    }

}

export class Vendedor extends Persona {
    constructor(nombre, ruc, direccion, telefono, comision) {
        super(nombre, ruc, direccion, telefono);
        this._comision = comision;
    }

    set comision(newComision) {
        if (typeof newComision === 'number' && newComision >= 0 && newComision <= 100) {
            this._comision = newComision;
        }
    }

    get comision() {
        return this._comision;
    }



}