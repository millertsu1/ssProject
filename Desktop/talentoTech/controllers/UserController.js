const bcrypt = require('bcrypt')
const userSchema = require('../models/User')
const jwt = require('jsonwebtoken')

class UserController{

    constructor(){}

    async login(email, password){
        try{
            const user = await userSchema.findOne({ email });
            if(!user){
                return { "status": "error", "message": "El usuario no existe"}
            }

            const passwordMatch = await bcrypt.compare(password, user.password)
            if(!passwordMatch){
                return {"status":"error","message":"Contrasena  o correo incorrecto"}
            }

            const token = jwt.sign({userID: user._id, email: user.email}, 'secretPassword', { expiresIn: '1h'})

            return{"status":"success", "token":token}

        }catch (error){
            console.log(error);
            return {"status":"error","message":"Error al iniciar sesion"}
        }
    }


validateToken(req, res, next) {
    const bearerToken = req.headers['authorization']
    if(!bearerToken){
        return res.status(401).json({"message":"Token no Existe"});
    }

    const token = bearerToken.startsWith("Bearer ") ? bearerToken.slice(7) : bearerToken;
    jwt.verify(token, 'secretPassword', (err, decoded) => {
        if(err){
            return res.status(401).json({"message":"Token invalido"})
        }
        req.userId = decoded.userId;
        next();
    })
}
}
module.exports = UserController