import jwt from "jsonwebtoken";
import UsuarioAd from '../userAdmin/userAdmin.model.js'
import { request } from "express";

export const validarJwt = async (req, res, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuarioAd = await UsuarioAd.findById(uid);
        if (!usuarioAd) {
            return res.status(401).json({
                msg: 'Administrator user does not exist in the database'
            })
        }

        if (!usuarioAd.estado) {
            return res.status(401).json({
                msg: 'Invalid token, user with false status'
            })
        }

        req.usuarioAd = usuarioAd
        next();
    } catch (e) {
        console.log(e);
        res.status(401).json({
            msg: "Token invalido"
        })
    }
}