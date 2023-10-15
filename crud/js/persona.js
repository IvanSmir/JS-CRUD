class Persona {
    constructor(nombre, ruc, direccion, telefono){
        this.nombre= nombre;
        this.ruc = ruc;
        this.direccion = direccion;
        this.telefono = telefono;
    }
    
}

class Cliente extends Persona{
    constructor(nombre, ruc, direccion, telefono){
        super(nombre, ruc, direccion, telefono)
    }
}

class vendedor extends Persona{
    constructor(nombre, ruc, direccion, telefono, comision){
        super(nombre, ruc, direccion, telefono)
        this.comision = comision
    }

}
