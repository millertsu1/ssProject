const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserSchema = require('../models/User');
const MovieSchema = require('../models/Movie');
const UserController = require('../controllers/UserController');
const userController = new UserController();
const multer = require('multer');




router.get('/user', userController.validateToken,  async (req, res) => {
    //Traer todos los usuarios
    let users = await UserSchema.find(); 
    res.json(users)
})
router.get('/user/:id', async (req, res) => {
    //Traer un usuario especifico pasando el ID
    var id = req.params.id
    let user = await UserSchema.findById(id); 
    res.json(user)
})
router.post('/user', async (req, res) => {
    //Crear un usuario
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    let user = UserSchema({
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        id: req.body.id,
        password: hashedPassword
    })

    user.save().then((result) => {
        res.send(result)
    }).catch((err) => {
        if(err.code == 11000){
            res.send({"status" : "error", "message" :"El correo ya fue registrado"})      
        }else if(err.errors.email.message != null){
            res.send({"status" : "error", "message" :err.errors.email.message})      

        }else{
            res.send({"status" : "error", "message" :"Error almacenando la informacion"})      
        }
    })
})

router.patch('/user/:id', (req, res) => {
    //Actualizar un usuario
    // Cuando viene por la url del servicio web params
    var id = req.params.id
    
    // Cuando viene por el body se usa body
    var updateUser = {
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        id: req.body.id
    }

    UserSchema.findByIdAndUpdate(id, updateUser, {new: true}).then((result) => {
        res.send(result)
    }).catch((error) => {
        console.log(error)
        res.send("Error actualizando el registro")
    })
})

router.delete('/user/:id', (req, res) => {
    
    var id = req.params.id

    //Puedo establecer cualquier parametro para eliminar
    UserSchema.deleteOne({_id: id}).then(() => {
        res.json({"status": "success", "message": "User deleted successfully"})
    }).catch((error) => {
        console.log(error)
        res.json({"status": "failed", "message": "Error deleting user"})
    })

    //Ejemplo 2
    // var name = req.params.name
    // var email = req.params.email
    // var query;
    // if(email != null){
    //     query = {name: name, email: email}
    // }else{
    //     query = {name: name}
    // }
    // //Puedo establecer cualquier parametro para eliminar
    //     UserSchema.deleteOne(query).then(() => {
    //         res.json({"status": "success", "message": "User deleted successfully"})
    //     }).catch((error) => {
    //         console.log(error)
    //         res.json({"status": "failed", "message": "Error deleting user"})
    //     })
})

router.post('/login', (req,res)=>{
    const email =req.body.email;
    const password = req.body.password;

    userController.login(email, password).then((result) =>{
        res.send(result)
    })
})

/* 
!movies
*/

router.get('/movie', async (req, res) => {
    //Traer todos las peliculas
    let movies = await MovieSchema.find(); 
    res.json(movies)
})

router.post('/movie', async (req, res) => {
    //Crear un movie

    let movie = MovieSchema({
        name: req.body.name,
        director: req.body.director,
        year: req.body.year,
        duration: req.body.duration,
        category: req.body.category,
    })

    movie.save().then((result) => {
        res.send(result)
    }).catch((err) => {
        if(err.code == 11000){
            res.send({"status" : "error", "message" :"El correo ya fue registrado"})      
        }else if(err.errors.email.message != null){
            res.send({"status" : "error", "message" :err.errors.email.message})      

        }else{
            res.send({"status" : "error", "message" :"Error almacenando la informacion"})      
        }
    })
})






/* 
*configuracion de la libreria Multer
*/
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + "-" + file.originalname)
    }
});

/* 
? con esta funcion  estamos filtando los archivos a cargar para que solo sean imagenes de cualquier tipo, si dejar subir un archivo con otra extension diferente.
*/

const fileFilter = (req, file, cb) =>{
    if(file.mimetype.startsWith('image/')){
        cb(null, true)
    }else{
        cb(new Error('el archivo no es una imagen'))
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter})

/* 
*servicio web para el almacenamiento de archivos 
*/
router.post('/upload:id/user', upload.single('file'), (req, res) => {
    if(!req.file){
        return res.status(400).send({'status':'error','message':'No se proporciono ningun archivo'})
    }
    var id = req.params.id

    var updateUser ={
        filepath: req.file.path
    }

    UserSchema.findByIdAndUpdate(id, updateUser, {new: true}).then((result) => {
        res.send({'status':'success','message':'Archivo subida correctamente'})
    }).catch((error) => {
        console.log(error)
        res.send({'status':'success','message':'Error actualizando el registro'})
    })
})


module.exports = router