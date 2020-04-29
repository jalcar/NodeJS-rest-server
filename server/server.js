require('../config/config');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/usuario', function(req, res) {
    res.json('GET Usuario');
});
app.post('/usuario', function(req, res) {
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'Nombre es requerido.'
        });
    } else {
        res.json({
            persona: body
        });
    }
});
app.put('/usuario/:idUsuario', function(req, res) {
    let id = req.params.idUsuario;
    res.json(`PUT Usuario: ${ id }`);
});
app.delete('/usuario/:idUsuario', function(req, res) {
    let id = req.params.idUsuario;
    res.json(`DELETE Usuario: ${ id }`);
});

app.listen(process.env.PORT, () => {
    console.log(`escuchando puerto ${ process.env.PORT }.`);
});