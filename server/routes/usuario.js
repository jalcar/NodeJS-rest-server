const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario.model');
const app = express();

app.get('/usuario', function(req, res) {
    // res.json('GET Usuario');

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    let filtro = {
        estado: true
    };
    // Usuario.find(filtro)
    Usuario.find(filtro, 'nombre email img role google estado')
        .skip(desde)
        .limit(limite)
        .exec((err, listaUsuarios) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count(filtro, (err, conteo) => {
                res.json({
                    ok: true,
                    cantidad: conteo,
                    usuarios: listaUsuarios
                });
            });

        });
});
app.post('/usuario', function(req, res) {
    let body = req.body;
    // if (body.nombre === undefined) {
    //     res.status(400).json({
    //         ok: false,
    //         mensaje: 'Nombre es requerido.'
    //     });
    // } else {
    //     res.json({
    //         persona: body
    //     });
    // }
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    usuario.save()
        .then(usuarioDB => {
            if (usuarioDB) {
                // usuarioDB.password = null;
                res.json({
                    ok: true,
                    usuario: usuarioDB
                });
            }
        })
        .catch(error => {
            if (error) {
                res.json({
                    ok: false,
                    error
                });
            }
        });
});
app.put('/usuario/:idUsuario', function(req, res) {
    let id = req.params.idUsuario;
    let body = req.body;

    body = _.pick(body, ['nombre', 'email', 'img', 'role', 'estado']);
    // delete body.google;
    // delete body.password;

    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});
app.delete('/usuario/:idUsuario', function(req, res) {
    let id = req.params.idUsuario;

    // ELIMINACION FISICA DEL REGISTRO
    // Usuario.findByIdAndRemove(id, (err, UsuarioBorrado) => {
    //     if (err) {
    //         res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!UsuarioBorrado) {
    //         res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario indicado no fue encontrado.'
    //             }
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: UsuarioBorrado
    //     });
    // });

    // ELIMINACION LOGICA DEL REGISTRO
    let data = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, data, { new: true }, (err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario indicado no fue encontrado.'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

module.exports = app;