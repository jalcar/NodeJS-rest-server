const express = require('express');
const Categoria = require('../models/categoria.model');
const { verificaToken, verifica_AdminRole } = require('../middlewares/autenticacion');

const app = express();

app.get('/categorias', [verificaToken], (req, res) => {
    let body = req.body;
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Categoria.find({}, 'descripcion')
        .skip(desde)
        .limit(limite)
        .exec((err, listaCategorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            Categoria.count({}, (err, conteo) => {
                return res.json({
                    ok: true,
                    cantidad: conteo,
                    categorias: listaCategorias
                });
            });
        });
});

app.get('/categorias/:id', [verificaToken], (req, res) => {
    let idCategoria = req.params.id;

    Categoria.findById(idCategoria, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (categoriaDB) {
            return res.json({
                ok: true,
                categoria: categoriaDB
            });
        } else {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `No se ha podido encontrar la categoría '${idCategoria}'`
                }
            });
        }
    });
});

app.post('/categorias', [verificaToken, verifica_AdminRole], (req, res) => {
    let body = req.body;
    let user = req.usuario;

    let categoria = new Categoria();
    categoria.descripcion = body.descripcion;
    categoria.usuario = user;
    categoria.save()
        .then(categoriaDB => {
            if (categoriaDB) {
                return res.json({
                    ok: true,
                    categoria: categoriaDB
                });
            }
        })
        .catch(err => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: `No se pudo registrar la nueva categoría '${body.descripcion}'`,
                        detail: err.message
                    }
                });
            }
        });
});

app.put('/categorias/:id', [verificaToken], (req, res) => {
    let idCategoria = req.params.id;
    let body = req.body;

    let catUpd = {
        descripcion: body.descripcion,
        usuario: req.usuario
    };

    Categoria.findByIdAndUpdate(
        idCategoria,
        catUpd, { new: true },
        (err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (categoriaDB) {
                return res.json({
                    ok: true,
                    categoria: categoriaDB
                });
            } else {
                return res.status(400).json({
                    ok: true,
                    err: {
                        message: `No se encuentra la categoría indicada, por favor revisar.`
                    }
                });
            }
        }
    );
});

app.delete('/categorias/:id', [verificaToken, verifica_AdminRole], (req, res) => {
    let idCategoria = req.params.id;

    Categoria.findByIdAndRemove(idCategoria, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (categoriaDB) {
            return res.json({
                ok: true,
                message: `Categoría eliminada de forma correcta.`
            });
        } else {
            return res.status(400).json({
                ok: true,
                err: {
                    message: `No se encuentra la categoría indicada, por favor revisar.`
                }
            });
        }
    });
});

module.exports = app;