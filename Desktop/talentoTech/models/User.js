const mongoose = require('mongoose') // Importando la libreria

// Creando el modelo de users
const UserSchema = new mongoose.Schema({
    id: {
        type: Number, 
        required: true,
        unique: true
    },
    name: {
        type: String, 
        required: true
    },
    lastname: {
        type: String, 
        required: true,
    },
    email: {
        type: String, 
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
              // Expresión regular para validar el formato del correo electrónico
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} no es un correo electrónico válido!`
          }
    },
    password: {
        type: String, 
        required: true
    }
})

module.exports = mongoose.model('user', UserSchema) 