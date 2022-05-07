// JSON ARRAY
var jsonBody = `[{"id":1,"dni":17663295,"nombre":"FABIAN MARCELO","apellido":"ABADIE","cursoNumero":1,"cursoLetra":"F"},
{"id":2,"dni":38724762,"nombre":"MAIRA DAIANA","apellido":"ABALOS","cursoNumero":3,"cursoLetra":"M"},
{"id":3,"dni":25447357,"nombre":"NOELIA LIDIA","apellido":"ABBA","cursoNumero":2,"cursoLetra":"N"},
{"id":4,"dni":27577699,"nombre":"MARÍA SOLEDAD","apellido":"ACHOR","cursoNumero":2,"cursoLetra":"M"},
{"id":900,"dni":11496581,"nombre":"JOSE MIGUEL","apellido":"ARMALEO","materia":"Fisica","año":1},
{"id":899,"dni":35326658,"nombre":"ROSA DEL VALLE","apellido":"LOPEZ","materia":"Lengua","año":3},
{"id":898,"dni":39638351,"nombre":"DANIELA BELEN","apellido":"BROGGI D'ATENA","materia":"Matematica","año":3},
{"id":897,"dni":17275566,"nombre":"PABLO ALBERTO","apellido":"ALMEIDA","materia":"Quimica","año":1}]`;

// GLOBALES
var arrayPersonas = new Array();
var arrayHeaders = new Array("id", "dni", "apellido", "nombre", "cursoLetra", "cursoNumero", "materia", "año");

var todos = 1;
var alumno = 2;
var docente = 3;

// ELEMENTOS
let checkBoxes = document.getElementsByName("check");
let selectFilter = document.getElementById("combo-box-select");

let table = document.getElementById("table");
let tableTBody = document.getElementById("table-tbody");
let agregarBtn = document.getElementById("agregarBtn");

let formWrapper = document.getElementById("form-wrapper");
let form = document.getElementById("form");
let wrapperTypeForm = document.getElementById("combo-box-form");
let selectTypeForm = document.getElementById("combo-box-select-form");

let camposFormCliente = document.getElementById("camposFormAlumno");
let camposFormEmpleado = document.getElementById("camposFormDocente");

let agregarFormBtn = document.getElementById("agregar");
let modificarFormBtn = document.getElementById("modificar");
let eliminarFormBtn = document.getElementById("eliminar");
let cancelarBtn = document.getElementById("cancelar");

let calcularBtn = document.getElementById("calcularBtn");
let inCalculo = document.getElementById("inPromedio");


// CLASES
class Persona {
    id;
    dni;
    apellido;
    nombre;

    constructor(id, dni, apellido, nombre)
    {
        this.id = id||null;
        this.dni = dni||null;
        this.apellido = apellido.toString()||null;
        this.nombre = nombre.toString()||null;
    }

    toString() {
        return `Id: ${this.id.toString()}, Dni: ${this.dni.toString()}, Apellido: ${this.apellido}, Nombre: ${this.nombre}`;
    }
}

class Alumno extends Persona {
    cursoLetra;
    cursoNumero;

    constructor(id, dni, apellido, nombre, cursoLetra, cursoNumero){
        super(id, dni, apellido, nombre);
        this.cursoNumero = cursoNumero||null;
        this.cursoLetra = cursoLetra.toString()||null;
    }

    toString() {
        return `${super.toString()}, Curso Numero: ${this.cursoNumero.toString()}, Curso Letra: ${this.cursoLetra}`;
    }
}

class Docente extends Persona {
    materia;
    año;

    constructor(id, dni, apellido, nombre, materia, año){
        super(id, dni, apellido, nombre);
        this.materia = materia.toString()||null;
        this.año = año||null;
    }

    toString() {
        return `${super.toString()}, Materia: ${this.materia} , Año: ${this.año.toString()}`;
    }
}


// METODOS
function ParsearJson()
{
    let arrayObjects = JSON.parse(jsonBody);
    arrayPersonas = arrayObjects.map(ObjectToTipoPersona);

    ArmarTabla(arrayPersonas, todos, true);
}

function ObjectToTipoPersona(elemento)
{
    return elemento["cursoNumero"] != null ? ParsearAlumno(elemento) : ParsearDocente(elemento);
}

function ObtenerTipoPersona(elemento)
{
    if(!isNaN(elemento["cursoNumero"]))
    {
        return 2;
    }

    return 3;
}

function ObtenerIndexDePersonaPorId(id)
{
    return arrayPersonas.findIndex(x => x.id == id);
}

function ParsearPersona(obj, tipoPersona)
{
    if(tipoPersona == 2)
    {
        return ParsearAlumno(obj);
    }
    else if(tipoPersona == 3)
    {
        return ParsearDocente(obj);
    }
}

function ParsearAlumno(obj)
{
    return new Alumno(obj["id"], obj["dni"], obj["apellido"], obj["nombre"], obj["cursoLetra"], obj["cursoNumero"]);
}

function ParsearDocente(obj)
{
    return new Docente(obj["id"], obj["dni"], obj["apellido"], obj["nombre"], obj["materia"], obj["año"]);
}

// TABLA
function ArmarTabla(arrayPersonas, filtroSeleccionado, borrarPreviamente = false)
{
    if(borrarPreviamente == true)
    {
        while (table.firstChild) 
        {
            table.removeChild(table.lastChild);
        }
    }
    
    ArmarTablaHeader(filtroSeleccionado);
    LlenarTabla(arrayPersonas, filtroSeleccionado);
    RecargarEventoHeadersButton();
    CrearEventoTableRow();
}

function ArmarTablaHeader(filtroSeleccionado)
{
    let tHead = document.createElement('thead');
    tHead.setAttribute("id","table-thead");

    let tr = document.createElement('tr');
    tr.setAttribute("id","tr");

    arrayHeaders.forEach(element => {

        // El value de los checbkoxes y los headers tienen que tener el mismo naming. 
        let indexOfCheckbox = GetIndexOfElementInNodeList(element);
        if(checkBoxes[indexOfCheckbox].checked == true)
        {
            let th;
            if((element == "id" || element == "dni" || element == "apellido" || element == "nombre"))
            {
                th = CrearElementoConIdYTexto("th", "th-td", element.toUpperCase(), true, element);
                tr.appendChild(th);
            }
            else if((element == "cursoLetra" || element == "cursoNumero") && (filtroSeleccionado == 2 || filtroSeleccionado == 1))
            {
                if(element == "cursoLetra")
                {
                    th = CrearElementoConIdYTexto("th", "th-td", "CURSO LETRA", true, element);
                }
                else if(element == "cursoNumero")
                {
                    th = CrearElementoConIdYTexto("th", "th-td", "CURSO NUMERO", true, element);
                }
                tr.appendChild(th);
            }
            else if((element == "materia" || element == "año") && (filtroSeleccionado == 3 || filtroSeleccionado == 1))
            {
                if(element == "año")
                {
                    th = CrearElementoConIdYTexto("th", "th-td", "AÑO", true, element);
                }
                else if(element == "materia")
                {
                    th = CrearElementoConIdYTexto("th", "th-td", "MATERIA", true, element);
                }
                tr.appendChild(th);
            }
        }
    });

    tHead.appendChild(tr);
    table.appendChild(tHead);
}

function LlenarTabla(arrayPersonas, filtroSeleccionado)
{
    let tBody = document.createElement('tbody');
    tBody.setAttribute("id","table-tbody");

    let tr;

    arrayPersonas.forEach(persona => {

        tr = document.createElement('tr');
        tr.setAttribute("id","tr-body");

        if(persona instanceof Alumno && (filtroSeleccionado == 2 || filtroSeleccionado == 1))
        {
            arrayTd = new Array();
            EvaluarColumnaYPushearTd(arrayTd, "id", persona.id, persona.id);
            EvaluarColumnaYPushearTd(arrayTd, "dni", persona.dni, persona.id);
            EvaluarColumnaYPushearTd(arrayTd, "apellido", persona.apellido, persona.id);
            EvaluarColumnaYPushearTd(arrayTd, "nombre", persona.nombre, persona.id);
            EvaluarColumnaYPushearTd(arrayTd, "cursoLetra", persona.cursoLetra, persona.id);
            EvaluarColumnaYPushearTd(arrayTd, "cursoNumero", persona.cursoNumero, persona.id);

            if(filtroSeleccionado == 1)
            {
                EvaluarColumnaYPushearTd(arrayTd, "materia", "N/A", persona.id);
                EvaluarColumnaYPushearTd(arrayTd, "año", "N/A", persona.id);
            }
            
            AppendChilds(tr, arrayTd);
            tBody.appendChild(tr);
        }
        else if(persona instanceof Docente && (filtroSeleccionado == 3 || filtroSeleccionado == 1))
        {
            arrayTd = new Array();
            EvaluarColumnaYPushearTd(arrayTd, "id", persona.id, persona.id);
            EvaluarColumnaYPushearTd(arrayTd, "dni", persona.dni, persona.id);
            EvaluarColumnaYPushearTd(arrayTd, "apellido", persona.apellido, persona.id);
            EvaluarColumnaYPushearTd(arrayTd, "nombre", persona.nombre, persona.id);

            if(filtroSeleccionado == 1)
            {
                EvaluarColumnaYPushearTd(arrayTd, "cursoLetra", "N/A", persona.id);
                EvaluarColumnaYPushearTd(arrayTd, "cursoNumero", "N/A", persona.id);
            }

            EvaluarColumnaYPushearTd(arrayTd, "materia", persona.materia, persona.id);
            EvaluarColumnaYPushearTd(arrayTd, "año", persona.año, persona.id);

            AppendChilds(tr, arrayTd);
            tBody.appendChild(tr);
        }

        table.appendChild(tBody);
    });
}

function EvaluarColumnaYPushearTd(arrayTd, columnaEvaluada, valorElemento, idElemento)
{
    let indexOfCheckbox = GetIndexOfElementInNodeList(columnaEvaluada);
    if(checkBoxes[indexOfCheckbox].checked == true)
    {
        let td = CrearElementoConIdYTexto("td", "th-td", valorElemento, false, idElemento);
        arrayTd.push(td);
    }
}

function CrearElementoConIdYTexto(elemento, id, texto, esButton = false, name = null)
{
    let element = document.createElement(elemento);
    element.setAttribute("id", id);

    let text = document.createTextNode(texto);
    element.appendChild(text);

    if(esButton == true)
    {
        element.setAttribute("class", "headerButton");
    }

    if(name != null)
    {
        element.setAttribute("name", name);
    }

    return element;
}

function AppendChilds(parentElement, arrayOfElements)
{
    arrayOfElements.forEach(element => {
        parentElement.appendChild(element);
    });
}

// HELPERS TABLA
function GetIndexOfElementInNodeList(element)
{
    for (let index = 0; index < checkBoxes.length; index++) {
        if(checkBoxes[index]["defaultValue"] == element)
        {
            return index;
        }
    }
}

function OrdernarRegistros(propiedad){

    let personasOrdenadas = new Array();
    if(arrayPersonas.length > 0)
    {
        switch(propiedad){
            case "id":
            case "dni":
            case "cursoNumero":
            case "año":
                personasOrdenadas = OrdernarPorNumero(arrayPersonas, propiedad);
                break;
            case "apellido":
            case "nombre":
            case "cursoLetra":
            case "materia":
                personasOrdenadas = OrdernarPorString(arrayPersonas, propiedad);
                break;
        }

        ArmarTabla(personasOrdenadas, selectFilter.value, true);
    }
}

function OrdernarPorNumero(arrayPersonas, columnaNumericaOrdenar, comaDecimal = false)
{
    let temporaryMapped = arrayPersonas.map(function(element, index){
        return { index: index, value: element[columnaNumericaOrdenar] };
    })

    temporaryMapped.sort(function(a, b) {
        let aValue = a.value != undefined ? a.value : `${Number.MAX_SAFE_INTEGER}`; // Se pone en string, porque sino rompe cambiar a float
        let bValue = b.value != undefined ? b.value : `${Number.MAX_SAFE_INTEGER}`;

        if(comaDecimal == true)
        {
            aValue = parseFloat(aValue.replace(/,/g,'.'));
            bValue = parseFloat(bValue.replace(/,/g,'.'));
        }

        return aValue - bValue;
    })

    let result = temporaryMapped.map(function(element){
        return arrayPersonas[element.index]
    });

    return result;
}

function OrdernarPorString(arrayPersonas, columnaStringOrdenar)
{
    let temporaryMapped = arrayPersonas.map(function(element, index){
        return { index: index, value: element[columnaStringOrdenar] };
    })

    temporaryMapped.sort(function(a, b) {
        if(a.value == undefined)
        {
            return +1;
        }

        if(b.value == undefined)
        {
            return -1;
        }

        return a.value.localeCompare(b.value);
    })

    let result = temporaryMapped.map(function(element){
        return arrayPersonas[element.index]
    });

    return result;
}

// FORM
function IniciarForm(tipoPersona, esModificar = false, id = null){

    if(esModificar && id != null)
    {
        let persona= ObtenerPersonaPorId(id);
        tipoPersona = ObtenerTipoPersona(persona);
        LlenarCamposForm(persona);
    }

    if(!esModificar)
    {
        LimpiarCamposForm();
    }
    

    MostrarOcultarCamposForm(tipoPersona, esModificar);
    MostrarOcultarBotonesForm(esModificar);

    formWrapper.style.visibility = "visible";
}

function MostrarCamposFormDefault()
{
    MostrarOcultarCamposForm(2);
}

function AgregarPersona()
{
    let obj = GetData();

    if(obj != null)
    {
        let persona = ParsearPersona(obj, selectTypeForm.value);

        AgregarPersonaConNuevoId(persona);
    
        ArmarTabla(arrayPersonas, selectFilter.value, true);
    
        OcultarForm();
    }
}

function ModificarPersona(){
    let obj = GetData();

    if(obj != null)
    {
        let indexPersona = ObtenerIndexDePersonaPorId(obj.id);
    

        arrayPersonas[indexPersona].apellido = obj.apellido;
        arrayPersonas[indexPersona].dni = obj.dni;
        arrayPersonas[indexPersona].nombre = obj.nombre;
        arrayPersonas[indexPersona].cursoLetra = obj.cursoLetra;
        arrayPersonas[indexPersona].cursoNumero = obj.cursoNumero;
        arrayPersonas[indexPersona].materia = obj.materia;
        arrayPersonas[indexPersona].año = obj.año;
    
        ArmarTabla(arrayPersonas, selectFilter.value, true);
    
        OcultarForm();
    }
}

function EliminarPersona()
{
    let obj = GetData(false);

    if(obj != null)
    {
        let indexPersona = ObtenerIndexDePersonaPorId(obj.id);
        arrayPersonas.splice(indexPersona, 1);

        ArmarTabla(arrayPersonas, selectFilter.value, true);

        OcultarForm();
    }
}

function GetData(validar = true){

    let personaObj = [];
    personaObj.id = document.getElementById("inId").value;
    personaObj.dni = document.getElementById("inDni").value;
    personaObj.apellido = document.getElementById("inApellido").value;
    personaObj.nombre = document.getElementById("inNombre").value;
    personaObj.cursoNumero = document.getElementById("inCursoNumero").value;
    personaObj.cursoLetra = document.getElementById("inCursoLetra").value;
    personaObj.materia = document.getElementById("inMateria").value;
    personaObj.año = document.getElementById("inAño").value;
    let tipoPersona = selectTypeForm.value;

    if(validar == true)
    {
        let esValid = ValidarData(personaObj, tipoPersona)

        if(esValid)
        {
            return personaObj;
        }
    }
    else if(validar == false)
    {
        return personaObj;
    }

    return null;
}

function AgregarPersonaConNuevoId(persona)
{
    let idsArr = arrayPersonas.map(function(a) {return a.id});
    let maxId = 0;

    if(idsArr.length > 0) {
        maxId = Math.max.apply(null, idsArr);
    }

    persona.id = maxId + 1;

    arrayPersonas.push(persona);

    console.log(persona.toString());
}

function ValidarData(personaObj, tipoPersona)
{
    if (!NumeroValido(personaObj.dni))
    {
        alert("El dni no es valido.");
        return false;
    }

    if(!StringValido(personaObj.apellido))
    {
        alert("El apellido no es valido.");
        return false;
    }
    
    if (!StringValido(personaObj.nombre))
    {
        alert("El nombre no es valido.");
        return false;
    }

    if(tipoPersona == 2)
    {
        if(!NumeroValido(personaObj.cursoNumero))
        {
            alert("El numero del curso no es valido.");
            return false;
        }
        
        if(!CursoValido(personaObj.cursoLetra))
        {
            alert("La letra del curso no es valida. Tiene que ser una sola letra.");
            return false;
        }
    }
    else if(tipoPersona == 3)
    {
        if(!NumeroValido(personaObj.año))
        {
            alert("El año no es valido.");
            return false;
        }
        
        if(!StringValido(personaObj.materia))
        {
            alert("La materia no es valida.");
            return false;
        }
    }

    return true;
}

function StringValido(string)
{
    if(string == null || string == undefined || string.trim() == "")
    {
        return false;
    }

    return true;
}

function NumeroValido(number, esFloat = false)
{
    if(esFloat)
    {
        number = parseFloat(number.replace(/,/g,'.'));
    }

    if(number == "" || isNaN(number))
    {
        return false;
    }

    return true;
}

function CursoValido(curso)
{
    if(!StringValido(curso) || curso.length != 1)
    {
        return false;
    }

    return true;
}


// HELPERS FORM
function ObtenerPersonaPorId(id)
{
    return arrayPersonas.find(x => x.id == id);
}

function OcultarForm()
{
    formWrapper.style.visibility = "hidden";
}

function LlenarCamposForm(persona)
{
    document.getElementById("inId").value = persona.id;
    document.getElementById("inDni").value = persona.dni;
    document.getElementById("inApellido").value = persona.apellido;
    document.getElementById("inNombre").value = persona.nombre;
    document.getElementById("inCursoNumero").value = persona.cursoNumero;
    document.getElementById("inCursoLetra").value = persona.cursoLetra;
    document.getElementById("inMateria").value = persona.materia;
    document.getElementById("inAño").value = persona.año;
}

function LimpiarCamposForm()
{
    document.getElementById("inId").value = "";
    document.getElementById("inDni").value = "";
    document.getElementById("inApellido").value = "";
    document.getElementById("inNombre").value = "";
    document.getElementById("inCursoNumero").value = "";
    document.getElementById("inCursoLetra").value = "";
    document.getElementById("inMateria").value = "";
    document.getElementById("inAño").value = "";
}

function MostrarOcultarCamposForm(tipoPersona, esModificar)
{
    if(tipoPersona == alumno)
    {
        camposFormEmpleado.style.display = "none";
        camposFormCliente.style.display = "block";
    }
    else
    {
        camposFormEmpleado.style.display = "block";
        camposFormCliente.style.display = "none";
    }

    if(esModificar == true)
    {
        selectTypeForm.setAttribute("disabled", "true")
    }
    else
    {
        selectTypeForm.removeAttribute("disabled");
    }

    selectTypeForm.value = tipoPersona;
}

function MostrarOcultarBotonesForm(esEditar = false)
{
    if(esEditar == true)
    {
        agregarFormBtn.style.display = "none";
        modificarFormBtn.style.display = "block";
        eliminarFormBtn.style.display = "block";
    }
    else
    {
        agregarFormBtn.style.display = "block";
        modificarFormBtn.style.display = "none";
        eliminarFormBtn.style.display = "none";
    }
}

// CALCULO
function CalcularIds() {
    let ids = arrayPersonas.map((e) => { return e.id } );
    let sumId = 0;
    let promedio = 0;

    if(ids.length > 0) {
        sumId = ids.reduce((preVal, val) => preVal + val);
        promedio = sumId / arrayPersonas.length;
    }

    inCalculo.value = parseFloat(promedio).toFixed( 2 );
}


// INICIAR
function Iniciar()
{
    ParsearJson();
    MostrarCamposFormDefault();
}

document.addEventListener("load", Iniciar());

// EVENTOS POST CONSTRUCCION
checkBoxes.forEach(element => {
    element.addEventListener('change', function() {
        ArmarTabla(arrayPersonas, selectFilter.value, true);
    })
});

selectFilter.addEventListener('change', function() {
    ArmarTabla(arrayPersonas, selectFilter.value, true);
    
    RecargarEventoHeadersButton();
})

function RecargarEventoHeadersButton() {
    let botonesHeader = document.getElementsByClassName("headerButton");

    Array.from(botonesHeader).forEach(element => {
        element.addEventListener('click', function()
        {
            OrdernarRegistros(element.attributes["name"].value)
        })
    })
}

function CrearEventoTableRow()
{
    let rowsTabla = document.querySelectorAll("#tr-body");

    Array.from(rowsTabla).forEach(row => {
        row.addEventListener('dblclick', function(){
            IniciarForm(0, true, row.firstChild.attributes["name"].value);
        })
    });
}

agregarBtn.addEventListener("click", function(){
    IniciarForm(2);
})

selectTypeForm.addEventListener('change', function(){
    MostrarOcultarCamposForm(selectTypeForm.value)
})

agregarFormBtn.addEventListener('click', function(){
    AgregarPersona();
})

modificarFormBtn.addEventListener('click', function(){
    ModificarPersona();
})

eliminarFormBtn.addEventListener('click', function(){
    EliminarPersona();
})

cancelarBtn.addEventListener("click", function(){
    OcultarForm();
})

calcularBtn.addEventListener("click", function(){
    CalcularIds();
})