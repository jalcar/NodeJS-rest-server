require('./config/config');

const mongoose = require('mongoose');
const express = require('express');
const path = require('path');

const app = express();
const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Importacion global de funcionalidades
app.use(require('./routes/index'));

// Habilitar carpeta PUBLIC
app.use(express.static(path.resolve(__dirname, '../public')));

mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(rptaOK => {
        if (rptaOK) console.log('Conexion UP');
    })
    .catch(rptaER => {
        if (rptaER) console.log('Conexion DOWN');
    });

app.listen(process.env.PORT, () => {
    console.log(`escuchando puerto ${ process.env.PORT }.`);
});