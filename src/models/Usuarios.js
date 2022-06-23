const { usersModel } = require('../config/usuarios.js');
const mongoose = require('mongoose');

class Usuarios {
    constructor(name) {
        this.name = name;
    }

    async deleteUser(name) {
        let usuario = await usersModel.findOneAndDelete({user: name}, {_id: 0});
        return usuario;
    }

    async getUser(email, password) {
        let sesion = await usersModel.find({email: email, password:password}, {_id: 0});
        if(sesion.length == 0) {
            return {error: 'Usuario no encontrado', res: sesion};
        }

        return sesion;
    }

    async guardarArchivo() {

        try {
            
            const URL = `mongodb://localhost:27017/${this.name}`;
            let rta = await mongoose.connect(URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log('Conectado a MongoDB');

        } catch (error) {
            console.log('Error al conectar a MongoDB' + error);
        }

    }
}

module.exports = Usuarios;