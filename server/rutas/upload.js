const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario')
const Producto = require('../models/producto')
const fs = require('fs')
const path = require('path')


app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
    let id = req.params.id
    let tipo = req.params.tipo
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'no se selecciono archivo'
        })
    }

    let tiposValidso = ['productos', 'usuarios']
    if (tiposValidso.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                mensaje: 'tipos validos ' + tiposValidso.join(', ')
            }
        })
    }
    let archivo = req.files.archivo;

    let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg']
    let nombreCortado = archivo.name.split('.')
    let extencion = nombreCortado[nombreCortado.length - 1]

    if (extencionesValidas.indexOf(extencion) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                mensaje: 'las extenciones validas son ' + extencionesValidas.join(', ')
            }
        })
    }

    let nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extencion}`

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            })
        if (tipo === 'usuarios')
            imagenUsuario(id, res, tipo, nombreArchivo)
        else
            imagenProducto(id, res, tipo, nombreArchivo)
    });
})


function imagenUsuario(id, res, tipo, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(tipo, nombreArchivo)
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            borraArchivo(tipo, nombreArchivo)
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: `el tipo ${tipo} no existe`
                }
            })
        }
        borraArchivo(tipo, usuarioDB.img)
        usuarioDB.img = nombreArchivo
        usuarioDB.save((err, usuarioSave) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                usuario: usuarioSave,
                img: nombreArchivo
            })
        })

    })
}

function imagenProducto(id, res, tipo, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(tipo, nombreArchivo)
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            borraArchivo(tipo, nombreArchivo)
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: `el tipo ${tipo} no existe`
                }
            })
        }
        borraArchivo(tipo, productoDB.img)
        productoDB.img = nombreArchivo
        productoDB.save((err, productoSave) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                usuario: productoSave,
                img: nombreArchivo
            })
        })

    })
}


function borraArchivo(tipo, nombreArchivo) {
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`)
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg)
    }
}

module.exports = app