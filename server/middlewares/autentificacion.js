///varificar token
const jwt = require('jsonwebtoken')



let verificaToken = (req, res, next) => {
    let token = req.get('token')
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no valido'
                }
            })
        }

        req.usuario = decoded.usuario
        next()
    })

}

let verificaAdminRol = (req, res, next) => {
    let usuario = req.usuario
    console.log(usuario.role);

    if (usuario.role === 'ADMIN_ROLE') {
        next()
        return
    } else {
        return res.json({
            ok: false,
            message: 'no es admin'
        })
    }

}


module.exports = {
    verificaToken,
    verificaAdminRol
}