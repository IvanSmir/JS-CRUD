import { agregar, getLocalStg, logout } from "./app.js";
class Usuario {
    constructor(nombre, usuario, contraseña) {
        this.id = Date.now()
        this.nombre = nombre;
        this.usuario = usuario;
        this.contraseña = contraseña;
    }
}

const btnReg = document.getElementById('btn-reg')
const btnForm = document.getElementById('btn-Form')
const modalReg = new bootstrap.Modal(document.getElementById('modal-signup'))
const nombre = document.getElementById('nombre')
const usuarioAct = document.getElementById('usuario')
const contraseña = document.getElementById('contraseña')
const user = document.getElementById('username')
const pass = document.getElementById('pass')
const btn = document.getElementById('btninic')
let usuarios = []


document.addEventListener('DOMContentLoaded', () => {
    usuarios = getLocalStg('Usuarios') || [];
    verUserLogged()
    btnReg.addEventListener('click', (e) => {
        e.preventDefault()
        modalReg.show()
    })
    btnForm.addEventListener('click', (e) => {
        e.preventDefault();
        registrarse()
    })
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        login()
    })
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', logout);

})

function registrarse() {
    console.log(usuarioAct)
    const usuarioExistente = usuarios.some(usuario => usuario.usuario == usuarioAct.value);
    console.log(usuarioExistente)
    if (usuarioExistente) {
        alert('Ya existe el usuario.');
        return;
    }
    let newUser = new Usuario(nombre.value, usuarioAct.value, contraseña.value)
    console.log(newUser)
    agregar(usuarios, newUser, 'Usuarios', false, true)
    modalReg.hide()
    nombre.value = ''
    usuarioAct.value = ''
    contraseña.value = ''
    alert('Registrado con exito')
}

function login() {
    const usuarioExistente = usuarios.find(usuario => usuario.usuario == user.value);
    if (usuarioExistente.usuario == user.value) {
        if (usuarioExistente.contraseña == pass.value) {
            document.getElementById('header').classList.remove('d-none')
            document.getElementById('signin').classList.add('d-none')
            document.getElementById('textup').innerHTML = 'Elige una opcion de la parte superior'
            localStorage.setItem('userlogged', JSON.stringify(usuarioExistente));
        } else {
            alert('Contraseña incorrecta')
        }
    } else {
        alert('No existe usuario')
    }
}

function verUserLogged() {
    const usuarioLogeado = JSON.parse(localStorage.getItem('userlogged'));
    if (usuarioLogeado) {
        document.getElementById('header').classList.remove('d-none');
        document.getElementById('signin').classList.add('d-none');
        document.getElementById('textup').innerHTML = 'Elige una opcion de la parte superior';
        document.getElementById('welcome').innerHTML = `Bienvenido al Sistema de Gestión ${usuarioLogeado.nombre}`

    }
}
