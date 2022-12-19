const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    nombre: { type: String, unique: true, required: true },
    image: { type: String },
    fecha: { type: String, required: true },
    lugar: { type: String, required: true },
    descripcion: { type: String },
    createdDate: { type: Date, default: Date.now },
    categoria: {type: String},
    subcategorias:[
        {
            nombre:{type:String},
            genero: {type: String},
            edadMax:{type:Number},
            inscriptos: [
                {
                nombre: {type:String},
                apellido: {type: String},
                edad: {type:Number},
                id: {type:String},
                idTutor:{type:String}
            }
                ]               
        }
    ],
    genero:{type: String},
    precio:{type:Number},
    fechaHasta: {type:Date}
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
       // delete ret.hash;
    }
});

module.exports = mongoose.model('Campeonato', schema);