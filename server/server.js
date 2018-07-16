require('./config/config')
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const path = require('path')

app.use(require('./rutas/index'))

app.use(express.static(path.resolve(__dirname, '../public')))



mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, resp) => {
    if (err) throw err

    console.log('Base online');

})
app.listen(process.env.PORT, () => {
    console.log('escuchando peticiones ' + process.env.PORT);
})