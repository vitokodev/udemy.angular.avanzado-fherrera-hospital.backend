const express = require('express');
const bcrypt = require('bcryptjs');

const app = express();

const Usuario = require('../models/usuario');

app.post('/', (req, res, next) => {

  const body = req.body;

  Usuario
    .findOne({ email: body.email })
    .then ( usr => {
      
      if ( !usr ) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Credenciales incorrectas - correo',
          usuario: usr,
          body: body
        });
      }

      if (!bcrypt.compareSync(body.password, usr.password)) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Credenciales incorrectas - password'
        });
      }

      res.status(200).json({
        ok: true,
        mensaje: 'Login POST correcto',
        usuario: usr,
        id: usr._id
      });

    })
    .catch( err => {
      res.status(500).json({
        ok: false,
        mensaje: 'Error login!!!',
        errors: err
      });
    });

});

module.exports = app;