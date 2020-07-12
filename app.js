// Requires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Inicializar variables
const app = express();

// Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Importar rutas
const appRoutes = require('./routes/app');
const usuarioRoutes = require('./routes/usuario');
const loginRoutes = require('./routes/login');

// Conexion a la base de datos
mongoose
  .connection
  .openUri(
    'mongodb://localhost:27017/hospitalDB',
    (err, res) => {
      if ( err ) throw err;
      console.log('Base de datos \x1b[32m%s\x1b[0m', 'online');
    }
  );

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// Escuchar peticiones
app.listen(3000, ()=> {
  console.log('SERVER \x1b[32m%s\x1b[0m', 'online');
})