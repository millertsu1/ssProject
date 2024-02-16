const express = require('express') //Importo la libreria
const app = express() //Inicializacion de la variable que usara la libreria
const router = express.Router(); // Enrutar los servicios web
const port = 3001; // Escuchar la ejecucion del servidor

const mongoose = require('mongoose'); // Importo la libreria mongoose
mongoose.connect("mongodb+srv://millerladino:71OZZd88O2TDsofk@cluster0.jekm0z1.mongodb.net/talentotech") // Creo la cadena de conexion

const userRoutes = require('./routes/UserRoutes');

app.use(express.urlencoded({extended: true})) // Acceder a la informacion de las urls
app.use(express.json()) // Analizar informacion en formato JSON

//Metodo [GET, POST, PUT, PATCH, DELETE]
// Nombre del servicio [/]
router.get('/', (req, res) => {
    //Informacion a modificar
    res.send("Hello world")
})

//Ejecuto el servidor
app.use(router)
app.use('/', userRoutes)
app.listen(port, () => {
    console.log('Listen on ' + port)
})