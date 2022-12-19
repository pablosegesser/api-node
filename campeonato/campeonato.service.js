const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const Campeonato = db.Campeonato;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};



async function getAll() {
    return await Campeonato.find();
}

async function getById(id) {
    return await Campeonato.findById(id);
}

async function create(userParam) {
    // validate
    if (await Campeonato.findOne({ nombre: userParam.nombre })) {
        throw 'Nombre "' + userParam.nombre + '" ya está en uso';
    }

    const campeonato = new Campeonato(userParam);


    // save user
    await campeonato.save();
}


async function update(id, userParam) {
    const user = await Campeonato.findById(id);

    // validate
    if (!user) throw 'Campeonato not found';
    if (user.nombre !== userParam.nombre && await Campeonato.findOne({ nombre: userParam.nombre })) {
        throw 'Nombre "' + userParam.nombre + '" ya esta utilizado';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await Campeonato.findByIdAndRemove(id);
}