const jwt = require('jsonwebtoken');

const SEED = require('../config/config').SEED;


// ==========================
// Verificar token
// ==========================

exports.verificaToken = (req, res, next) => {
  
  const token = req.query.token;

  jwt
    .verify( token, SEED, ( err, decoded) => {

      if ( err ) {
        return res.status(401).json({
          ok: true,
          mensaje: 'Accion no autorizada',
          errors: err
        });
      }

      req.usuario = decoded.usuario;

      // res.status(500).json({
      //   ok: true,
      //   decoded: decoded
      // });
      next();
    })
};