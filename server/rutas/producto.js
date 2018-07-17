const express = require('express')
const { verificaToken } = require('../middlewares/autentificacion')
const app = express()
const Producto = require('../models/producto')

app.get('/producto', [verificaToken], (req, res) => {
    let desde = req.query.desde || 0
    desde = Number(desde)
    let limite = req.query.limite || 5
    limite = Number(limite)

    Producto.find({ disponible: true })
        .limit(limite)
        .skip(desde)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Producto.count((err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                })
            })

        })
})

app.get('/producto/:id', [verificaToken], (req, res) => {

    let id = req.params.id

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, producto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            if (producto === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        mensaje: 'no encontrado'
                    }
                })
            } else {
                res.json({
                    ok: true,
                    producto
                })
            }
        })
})

app.post('/producto', [verificaToken], (req, res) => {
    let body = req.body
    let producto = new Producto({
        nombre: body.nombre,
        usuario: req.usuario._id,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    })

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    })
})

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino
    let regex = new RegExp(termino, 'i')

    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            if (productos === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        mensaje: 'no encontrado'
                    }
                })
            } else {
                res.json({
                    ok: true,
                    productos
                })
            }
        })
})

app.put('/producto/:id', [verificaToken], (req, res) => {
    let id = req.params.id
    let body = req.body

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'no existe'
                }
            })
        }

        productoDB.nombre = body.nombre
        productoDB.precioUni = body.precioUni
        productoDB.categoria = body.categoria
        productoDB.disponible = body.disponible
        productoDB.descripcion = body.descripcion

        productoDB.save((err, productoGuardad) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productoGuardad
            })
        })
    })
})

app.delete('/producto/:id', [verificaToken], (req, res) => {
    let id = req.params.id


    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'no existe'
                }
            })
        }

        productoDB.disponible = false
        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'borrado'
            })
        })
    })


})

module.exports = app