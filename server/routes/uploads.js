const express = require('express');
const fileupload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario.model');
const Producto = require('../models/producto.model');

const app = express();
app.use(fileupload());

app.put('/upload/:tipo/:id', (req, res) => {
    let files = req.files;
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!files || Object.keys(files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No hay archivos a subir.'
            }
        });
    }

    let extensionesValidas = ['jpg', 'jpeg', 'png', 'gif'];
    let archivo = files.archivo;
    let nombreArchivoArray = archivo.name.split('.');
    let extension = nombreArchivoArray[nombreArchivoArray.length - 1];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(500).json({
            ok: false,
            err: {
                message: `La extensión '${extension}' no es válida. Sólo pueden subirse '${extensionesValidas.join(', ')}'`
            }
        });
    }

    let tipovalidos = ['usuarios', 'productos'];
    if (tipovalidos.indexOf(tipo) < 0) {
        return res.status(500).json({
            ok: false,
            err: {
                message: `'${tipo}' no es un valor válido.`
            }
        });
    }

    let nombreArchivo = `${id}-${(new Date()).getMilliseconds()}.${extension}`;
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        switch (tipo) {
            case 'usuarios':
                actualizaImagenUsuario(res, nombreArchivo, id);
                break;
            case 'productos':
                actualizaImagenProducto(res, nombreArchivo, id);
                break;
        }

        // res.json({
        //     ok: true,
        //     message: 'Archivo subido correctamente.'
        // });
    });
});

const eliminarArchivo = (nombreArchivo, tipo) => {
    let rutaArchivo = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`);
    if (fs.existsSync(rutaArchivo)) {
        fs.unlinkSync(rutaArchivo);
    }
};

const actualizaImagenUsuario = (response, nombreImagen, IDUsuario) => {
    Usuario.findById(IDUsuario, (err, usuarioDB) => {
        if (err) {
            eliminarArchivo(nombreImagen, 'usuarios');
            return response.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            eliminarArchivo(nombreImagen, 'usuarios');
            return response.status(400).json({
                ok: false,
                err: {
                    message: 'No se han encontrado coincidencias para el ID indicado.'
                }
            });
        }

        eliminarArchivo(usuarioDB.img, 'usuarios');
        usuarioDB.img = nombreImagen;
        usuarioDB.save((err, usuarioSave) => {
            if (err) {
                return response.status(500).json({
                    ok: false,
                    err
                });
            }

            return response.json({
                ok: true,
                usuario: usuarioSave
            });
        });
    });
};

const actualizaImagenProducto = (response, nombreImagen, idProducto) => {
    Producto.findById(idProducto, (err, productoDB) => {
        if (err) {
            eliminarArchivo(nombreImagen, 'productos');
            return response.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            eliminarArchivo(nombreImagen, 'productos');
            return response.status(400).json({
                ok: false,
                err: {
                    message: 'No se han encontrado coincidencias para el ID indicado.'
                }
            });
        }

        eliminarArchivo(productoDB.img, 'productos');

        productoDB.img = nombreImagen;
        productoDB.save((err, productoSave) => {
            if (err) {
                return response.status(500).json({
                    ok: false,
                    err
                });
            }

            return response.json({
                ok: true,
                producto: productoSave
            });
        });
    });
};

module.exports = app;