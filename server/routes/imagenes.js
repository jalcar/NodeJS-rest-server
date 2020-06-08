const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificaTokenParametro } = require('../middlewares/autenticacion');

let app = express();

app.get('/imagenes/:tipo/:imagen', [verificaTokenParametro], (req, res) => {
    let tipo = req.params.tipo;
    let imagen = req.params.imagen;

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${imagen}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let pathImagenDefault = path.resolve(__dirname, `../assets/no-image.jpg`);
        res.sendFile(pathImagenDefault);
    }
});

module.exports = app;