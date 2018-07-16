///=========
// puerto
//=========
process.env.PORT = process.env.PORT || 3000


// Entorno 
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'
let urlDB
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI
}
process.env.URLDB = urlDB


///vencimiento token
process.env.CAD_TOKEN = 60 * 60 * 24 * 30
    ///seed
process.env.SEED = process.env.SEED || 'este-es-el-seed-dev'

// mongodb://<dbuser>:<dbpassword>@ds135441.mlab.com:35441/cafe-marco-avg

// https://peaceful-plateau-89608.herokuapp.com/