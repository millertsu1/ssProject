const express = require('express');
const router = express.Router();
const EstateSchema = require('../models/Estate');
const EstateController = require('../controllers/EstateController');
const estateController = new EstateController();
const multer = require('multer');
/* 
? traer todas las propiedades
*/
router.get('/estate', async (req, res) => {
    //Traer todos las peliculas
    let estates = await EstateSchema.find(); 
    res.json(estates)
})
/* 
? terminamos de traer todas las propiedades
*/

/* 
? traer una propiedad en espcifico
*/
router.get('/estate/:id', async (req, res) => {
    //Traer un usuario especifico pasando el ID
    var id = req.params.id
    let estate = await EstateSchema.findById(id); 
    res.json(estate)
})
/* 
? terminamos de traer la propiedad
*/

/* 
? crear una propiedad
*/
router.post('/estate', async (req, res) => {
    //Crear un inmueble

    let estate = EstateSchema({
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        size: req.body.size,
        type: req.body.type,
        zipcode: req.body.zipcode,
        rooms: req.body.rooms,
        bathrooms: req.body.bathrooms,
        parking: req.body.parking,
        price: req.body.price,
        code: req.body.code,
        image: req.body.image,
    })

    estate.save().then((result) => {
        res.send(result)
    }).catch((err) => {
        if(err.code == 11000){
            res.status(400).send({"status" : "error", "message" :"El inmueble ya fue registrado"})       
        }else if(err.errors && err.errors.code && err.errors.code.message){
            res.status(400).send({"status" : "error", "message" :err.errors.code.message})      
        }else{
            console.error(err);
            res.status(500).send({"status" : "error", "message" :"Error almacendnado la informacion"}) 
        }
    })
})

router.patch('/estate/:id', (req, res) => {
    //Actualizar un inmueble
    // Cuando viene por la url del servicio web params
    var id = req.params.id
    
    // Cuando viene por el body se usa body
    var updateEstate= {
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        size: req.body.size,
        type: req.body.type,
        zipcode: req.body.zipcode,
        rooms: req.body.rooms,
        bathrooms: req.body.bathrooms,
        parking: req.body.parking,
        price: req.body.price,
        code: req.body.code,
        image: req.body.image,
    }

    estateSchema.findByIdAndUpdate(id, updateEstate, {new: true}).then((result) => {
        res.send(result)
    }).catch((error) => {
        console.log(error)
        res.send("Error actualizando el registro")
    })
})

router.delete('/estate/:id', (req, res) => {
    
    var id = req.params.id

    //Puedo establecer cualquier parametro para eliminar
    EstateSchema.deleteOne({_id: id}).then(() => {
        res.json({"status": "success", "message": "User deleted successfully"})
    }).catch((error) => {
        console.log(error)
        res.json({"status": "failed", "message": "Error deleting user"})
    })

})

/* 
? terminamos de crear la propiedad
*/
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
router.post('/upload/:id/estate', upload.single('file'), (req, res) => {
    if(!req.file){
        return res.status(400).send({'status':'error','message':'No se proporciono ningun archivo'})
    }
    var id = req.params.id

    var updateEstate ={
        filepath: req.file.path
    }

    EstateSchema.findByIdAndUpdate(id, updateEstate, {new: true}).then((result) => {
        res.send({'status':'success','message':'Archivo subida correctamente'})
    }).catch((error) => {
        console.log(error)
        res.send({'status':'success','message':'Error actualizando el registro'})
    })
})

module.exports = router