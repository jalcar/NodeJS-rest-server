const jwt = require('jsonwebtoken');

// ========================
// VERIFICACION DE TOKEN
// ========================

let verificaToken = (req, res, next) => {
    // TOKEN VIENE EN EL HEADER EN CAMPO "TOKEN"
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, valordecodificado) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido.'
                }
            });
        }
        req.usuario = valordecodificado.usuario;
        next();
    });
};

// ========================
// VERIFICACION ADMIN_ROLE
// ========================
let verifica_AdminRole = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Usuario no tiene rol Administrador.'
            }
        });
    }
};

// ====================================
// VERIFICACION DE TOKEN COMO PARAMETRO
// ====================================
let verificaTokenParametro = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, valordecodificado) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido.'
                }
            });
        }
        req.usuario = valordecodificado.usuario;
        next();
    });
};

module.exports = {
    verificaToken,
    verifica_AdminRole,
    verificaTokenParametro
};