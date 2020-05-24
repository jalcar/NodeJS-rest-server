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
    // cadCon = 'mongodb+srv://userdb:z2uPJOelUknXMqYK@cluster0-nzv7b.mongodb.net/dbclientes';
    cadCon = process.env.MONGODB_URL;
} else {
    cadCon = 'mongodb://localhost:27017/cafe';
}
process.env.URLDB = cadCon;

// ==================
// ENTORNO
// process.env.CADUCIDAD -> ES CREADA POR NOSOTROS | RECONOCIDA POR EL SERVIDOR WEB (HEROKU)
// TIEMPO DE DURACION EN SEGUNDOS PARA EL TOKEN
// ==================
process.env.CADUCIDAD = 60 * 60 * 24 * 30;

// ==================
// ENTORNO
// process.env.SEED -> ES CREADA POR NOSOTROS | RECONOCIDA POR EL SERVIDOR WEB (HEROKU)
// SEMILLA PARA LA GENERACION DEL TOKEN
// ==================
process.env.SEED = process.env.SEED || 'semilla-del-token-DES';

// ==================
// ENTORNO
// process.env.CLIENT_ID -> ES CREADA POR NOSOTROS | RECONOCIDA POR EL SERVIDOR WEB (HEROKU)
// CLIENT_ID DE GOOGLE
// ==================
process.env.CLIENT_ID = process.env.CLIENT_ID || '989751678257-dph129ht31v3e4li6pno2n0ikteltngb.apps.googleusercontent.com';