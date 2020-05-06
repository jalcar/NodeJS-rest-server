// ==================
// PUERTO
// process.env.PORT -> ES RECONOCIDA POR EL SERVIDOR WEB (HEROKU)
// ==================
process.env.PORT = process.env.PORT || 3000;

// ==================
// ENTORNO
// process.env.NODE_ENV -> ES RECONOCIDA POR EL SERVIDOR WEB (HEROKU)
// ==================
process.env.NODE_ENV = process.env.NODE_ENV || 'DES';

// ==================
// BASE DE DATOS
// process.env.URLDB -> ES CREADA POR NOSOTROS | NO ES RECONOCIDA POR EL SERVIDOR WEB (HEROKU)
// ==================
let cadCon;
if (process.env.NODE_ENV !== 'DES') {
    cadCon = 'mongodb+srv://userdb:z2uPJOelUknXMqYK@cluster0-nzv7b.mongodb.net/dbclientes';
} else {
    cadCon = 'mongodb://localhost:27017/cafe';
}
process.env.URLDB = cadCon;