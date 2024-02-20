const estateSchema = require('../models/Estate')
const jwt = require('jsonwebtoken')

class EstateController{

    constructor(){}

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
        req.estateId = decoded.estateIdId;
        next();
    })
}
}
module.exports = EstateController