const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const Producto = require('../models/producto.model');


const app = express();

app.get('/productos', (req, res) => {
    let body = req.body;
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 10;
    limite = Number(limite);

    let filtros = { disponible: true };
    Producto.find(filtros)
        .skip(desde)
        .limit(limite)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email role')
        .exec((err, listaProductos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!listaProductos) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontraron Productos.'
                    }
                });
            } else {
                Producto.count(filtros, (err, conteo) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }
                    res.json({
                        ok: true,
                        cantidad: conteo,
                        productos: listaProductos
                    });
                });
            }
        });
});

app.get('/productos/:id', (req, res) => {
    let idProducto = req.params.id;

    Producto.findById(idProducto)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email role')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontraron coincodencias.'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

app.get('/productos/buscar/:termino', [verificaToken], (req, res) => {
    let termino = req.params.termino;
    let expReg = RegExp(termino, 'i');

    let filtros = { nombre: expReg };
    Producto.find(filtros)
        .populate('categoria', 'descripcion')
        .exec((err, listaProductos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!listaProductos) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontraron coincidencias.'
                    }
                });
            } else {
                Producto.count(filtros, (err, conteo) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }
                    res.json({
                        ok: true,
                        cantidad: conteo,
                        productos: listaProductos
                    });
                });
            }
        });
});

app.post('/productos', [verificaToken], (req, res) => {
    let body = req.body;
    let user = req.usuario;

    let productoNew = new Producto();
    productoNew.nombre = body.nombre;
    productoNew.precioUni = Number(body.precioUnitario);
    productoNew.descripcion = body.descripcion;
    productoNew.categoria = body.categoria;
    productoNew.usuario = user;

    productoNew.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: `No fue posible registrar el producto '${body.nombre}'`
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });

});

app.put('/productos/:id', [verificaToken], (req, res) => {
    let idProducto = req.params.id;
    let body = req.body;

    let productoUpd = {
        precioUni: Number(body.precioUnitario),
        nombre: body.nombre,
        descripcion: body.descripcion,
        categoria: body.categoria
    };

    Producto.findByIdAndUpdate(idProducto, productoUpd, { new: true, runValidators: true })
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: `Producto indicado no fue encontrado.`
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

app.delete('/productos/:id', [verificaToken], (req, res) => {
    let idProducto = req.params.id;

    let productoUpd = {
        disponible: false
    };

    Producto.findByIdAndUpdate(idProducto, productoUpd, { new: true, runValidators: true })
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: `Producto indicado no fue encontrado.`
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

module.exports = app;