const express = require('express');
const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// const SEED = require('../config/config').SEED;

const verificaToken = require('../middleware/auth').verificaToken;

const app = express();



const Usuario = require('../models/usuario');

// ==========================
// Obtener todos los usuarios
// ==========================
app.get('/', (req, res, next) => {

  Usuario
    .find({}, 'nombre email img role')
    .exec()
    .then( resul => {
      res.status(200).json({
        ok: true,
        usuarios: resul
      });
    } )
    .catch( err => {
      res.status(500).json({
        ok: true,
        mensaje: 'Error!!!'
      });
    })

});

// ==========================
// Actualizar usuario
// ==========================

app.put('/:id', verificaToken, (req, res, next) => {
  
  const id = req.params.id;
  const body = req.body;

  Usuario.findById(id)
    .then( usuario => {
      if ( !usuario ) {
        return res.status(400).json({
          ok: false,
          mensaje: 'USER no encontrado',
          errors: { message: 'No existe user con ID especificado.' }
        });
      }
      usuario.nombre = body.nombre;
      usuario.email = body.email;
      usuario.role = body.role;

      return usuario.save();
    })
    .then( resul => {
      resul.password = ':)'; // trucazo
      res.status(200).json({
        ok: true,
        usuario: resul
      });
    })
    .catch( err => {
      res.status(500).json({
        ok: false,
        mensaje: 'Error actualizando USER!!!',
        errors: err
      });
    });

});

// ==========================
// Crear nuevo usuario
// ==========================

app.post('/', verificaToken, (req, res, next) => {

  const body = req.body;

  const usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role
  });

  usuario.save()
    .then( result => {
      result.password = ':)';
      res.status(201).json({
        ok: true,
        usuario: result,
        usuarioToken: req.usuario
      });
    })
    .catch( err => {
      res.status(400).json({
        ok: false,
        mensaje: 'Error guardando USER!!!',
        errors: err
      });
    });

});

// ==========================
// Eliminar usuario
// ==========================

app.delete('/:id', verificaToken, (req, res, next) => {

  const id = req.params.id;
  // const body = req.body;

  Usuario.findByIdAndRemove(id)
    .then( resul => {
      if (!resul) {
        return res.status(400).json({
          ok: true,
          mensaje: 'No existe usuario'
        });
      }
      res.status(200).json({
        ok: true,
        mensaje: 'Usuario eliminado',
        usuario: resul
      });
    })
    .catch( err => {
      res.status(500).json({
        ok: false,
        mensaje: 'Error eliminando USER!!!',
        errors: err
      });
    });

});

module.exports = app;