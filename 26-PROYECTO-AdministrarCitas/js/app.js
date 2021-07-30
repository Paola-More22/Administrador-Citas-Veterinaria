// Campos del formulario 
const mascotaInput = document.querySelector("#mascota");
const propietarioInput = document.querySelector("#propietario");
const telefonoInput = document.querySelector("#telefono");
const fechaInput = document.querySelector("#fecha");
const horaInput = document.querySelector("#hora");
const sintomasInput = document.querySelector("#sintomas");

// UI - interfaz de usuario 
const formulario = document.querySelector("#nueva-cita");
const contenedorCitas = document.querySelector("#citas");

let editando;

class Citas {
    constructor(){
        this.citas = [];
    }

    agregarCita(cita){
        this.citas= [...this.citas, cita];
    }

    eliminarCita(id){
        this.citas=this.citas.filter(cita => cita.id !== id);
    }

    editarCita(citaActualizada){
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada:cita); 
    }

}

class UI {
    imprimirAlerta(mensaje, tipo){
        // Crear e div
        const divMensaje= document.createElement("div");
        divMensaje.classList.add("text-center", "alert", "d-block", "col-12");

        // Agregar clase en base al tipo de error
        if(tipo === "error"){
            divMensaje.classList.add("alert-danger");
        } else {
            divMensaje.classList.add("alert-success");
        }

        // Mensaje de error 
        divMensaje.textContent = mensaje;

        // Agregarael DOM
        document.querySelector("#contenido").insertBefore(divMensaje, document.querySelector(".agregar-cita"));

        // Quitar la alerta despues de 5 minutos 
        setTimeout( () => {
            divMensaje.remove();
        }, 5000);
    }

    imprimirCitas({citas}){

        this.limpiarHTML();

        citas.forEach(cita  => {
            const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

            const divCita = document.createElement("div");
            divCita.classList.add("cita", "p-3");
            divCita.dataset.id = id;

            // Scripting de los elementos de la cita
            const mascotaParrafo = document.createElement("h2");
            mascotaParrafo.classList.add("card-title", "font-weight-bolder");
            mascotaParrafo.textContent=mascota;

            const propietarioParrafo=document.createElement("p");
            propietarioParrafo.innerHTML = `
            <span class="font-weght-bolder">Propietario: </span> ${propietario}
            `;

            const telefonoParrafo=document.createElement("p");
            telefonoParrafo.innerHTML = `
            <span class="font-weght-bolder">Teléfono: </span> ${telefono}
            `;

            const fechaParrafo=document.createElement("p");
            fechaParrafo.innerHTML = `
            <span class="font-weght-bolder">Fecha: </span> ${fecha}
            `;

            const horaParrafo=document.createElement("p");
            horaParrafo.innerHTML = `
            <span class="font-weght-bolder">Hora: </span> ${hora}
            `;

            const sintomasParrafo=document.createElement("p");
            sintomasParrafo.innerHTML = `
            <span class="font-weght-bolder">Síntomas: </span> ${sintomas}
            `;

            // Boton para eliminar esta cita
            const btnEliminar=document.createElement("button");
            btnEliminar.classList.add("btn", "btn-danger", "mr-2");
            btnEliminar.innerHTML='Eliminar <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>';
            btnEliminar.onclick = () => eliminarCita(id)

            // Boton para editar una cita 
            const btnEditar=document.createElement("button");
            btnEditar.classList.add("btn", "btn-info")
            btnEditar.innerHTML='Editar <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>';
            btnEditar.onclick= () => cargarEdicion(cita);
        
            // Agragar los parrafos al divcita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            

            // Agregar las citas al HTML 
            contenedorCitas.appendChild(divCita);

        });
    }

    limpiarHTML(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild)
        }
    }
}

const ui = new UI();
const administrarCitas = new Citas();

// REgistrar eventos 
eventListener();
function eventListener(){ // para que esto funcione tiene  que tener el name con el mismo nombre de la propiedad del objeto 
    mascotaInput.addEventListener("input", datosCita);
    propietarioInput.addEventListener("input", datosCita);
    telefonoInput.addEventListener("input", datosCita);
    fechaInput.addEventListener("input", datosCita);
    horaInput.addEventListener("input", datosCita);
    sintomasInput.addEventListener("input", datosCita);

    formulario.addEventListener("submit",nuevaCita)
}

// Objeto con la informacion de la cita
const citaObj = {
    mascota: "",
    propietario: "",
    telefono: "",
    fecha: "",
    hora: "",
    sintomas: ""
}

// Agregar datos al objeto de cita
function datosCita(e){
    citaObj[e.target.name] = e.target.value; // para leer el name en HTML
    console.log(citaObj);
}

// Valida y agraga una nueva cita a la clase citas 
function nuevaCita(e){
    e.preventDefault();

    // Extraer la infromacion del objeto de citas 
    const {mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;

    // Validar 
    if (mascota==="" || propietario==="" || telefono==="" || fecha==="" || hora==="" || sintomas===""){
        ui.imprimirAlerta("Los campos son obligatorios", "error");

        return;
    }
    
    if(editando){
        ui.imprimirAlerta("Editado correctamente");

        // Pasar el objeto de la cita a edicion 
        administrarCitas.editarCita({...citaObj});

        //  Regresar el texto del boton a su estado oroginal 
        formulario.querySelector("button[type=submit]").textContent="Crear Cita";

        // Quitar modo edicion
        editando=false;

    } else {
        // Generar un id unico
        citaObj.id = Date.now();

        // Creando una nueva cita 
        administrarCitas.agregarCita({...citaObj});

        // mensaje de agregado correctamente
        ui.imprimirAlerta("Se agrego correctamente");
    }

    

    // Reniciar el objeto para la validacion 
    reiniciarObjeto();

    // Reiniciar el formulario 
    formulario.reset();

    // Mostrar en el HTML las citas 
    ui.imprimirCitas(administrarCitas);

}

function reiniciarObjeto(){
    citaObj.mascota="";
    citaObj.propietario="";
    citaObj.telefono="";
    citaObj.fecha="";
    citaObj.hora="";
    citaObj.sintomas="";
}

function eliminarCita(id) {

    // Eliminar la cita 
    administrarCitas.eliminarCita(id);

    // Muestre el msj 
    ui.imprimirAlerta("La cita se eliminó correctamente");

    // refresque la cita 
    ui.imprimirCitas(administrarCitas);
}

// Cargar los datos y el modo edicion 
function cargarEdicion(cita){
    const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

    mascotaInput.value=mascota;
    propietarioInput.value=propietario;
    telefonoInput.value=telefono;
    fechaInput.value=fecha;
    horaInput.value=hora;
    sintomasInput.value=sintomas;

    // Llenar el objeto 
    citaObj.mascota=mascota;
    citaObj.propietario=propietario;
    citaObj.telefono=telefono;
    citaObj.fecha=fecha;
    citaObj.hora=hora;
    citaObj.sintomas=sintomas;
    citaObj.id=id;


    // Cambiar el texto del boton 
    formulario.querySelector("button[type=submit]").textContent="Guardar Cambios";

    editando=true;
}