class Factura {
    constructor(fecha, cliente, vendedor, tipo, items) {
        this.fecha = fecha;
        this.cliente = cliente;
        this.vendedor = vendedor;
        this.tipo = tipo; 
        this.items = items;
        this.total = this.calcularTotal();
    }

    calcularTotal() {
        return this.items.reduce((total, item) => total + item.subtotal, 0);
    }
}


class ItemFactura {
    constructor(cantidad, descripcion, precio) {
        this.cantidad = cantidad;
        this.descripcion = descripcion;
        this.precio = precio;
        this.subtotal = this.calcularSubtotal();
    }

    calcularSubtotal() {
        return this.cantidad * this.precio;
    }
}

