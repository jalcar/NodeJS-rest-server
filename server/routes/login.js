const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const Usuario = require('../models/usuario.model');
const app = express();

app.post('/login', function(req, res) {
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o Contraseña no válidos.'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (Contraseña) no válidos.'
                }
            });
        }

        // GENERACION DE TOKEN DE JWT
        let token = jwt.sign({
                usuario: usuarioBD
            },
            process.env.SEED, {
                expiresIn: process.env.CADUCIDAD
            });

        res.json({
            ok: true,
            usuario: usuarioBD,
            token
        });
    });
});

const client = new OAuth2Client(process.env.CLIENT_ID);
async function verify(p_Token) {
    const ticket = await client.verifyIdToken({
        idToken: p_Token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}

app.post('/google', async(req, res) => {
    let idtoken = req.body.idtoken;

    // CAPTURAMOS EL USUARIO DE GOOGLE
    let UsuarioGoogle = await verify(idtoken)
        .catch(err => {
            if (err) {
                return res.status(403).json({
                    ok: false,
                    err
                });
            }
        });

    // VERIFICAR SI CORREO EXISTE EN BD
    Usuario.findOne({ email: UsuarioGoogle.email }, (err, usuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (usuarioBD) {
            // SI USUARIO SE AUTENTICO CON CREDENCIALES NORMALES
            if (usuarioBD.google === false) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Debe usar la autenticación normal.'
                    }
                });
            } else {
                // SI ES USUARIO DE GOOGLE SE REFRESCA EL TOKEN
                let token = jwt.sign({
                    usuario: usuarioBD
                }, process.env.SEED, {
                    expiresIn: process.env.CADUCIDAD
                });

                return res.json({
                    ok: true,
                    usuario: usuarioBD,
                    token
                });
            }
        } else {
            // SI USUARIO NO EISTE EN LA BD
            let usuario = new Usuario();
            usuario.nombre = UsuarioGoogle.nombre;
            usuario.email = UsuarioGoogle.email;
            usuario.google = true;
            usuario.img = UsuarioGoogle.img;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {
                    expiresIn: process.env.CADUCIDAD
                });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            });
        }
    });
});

module.exports = app;