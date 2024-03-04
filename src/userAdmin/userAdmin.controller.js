import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import UserAdmin from './userAdmin.model.js'

export const usuarioAdPost = async (req, res) => {
    const { nombre, correo, password } = req.body;
    const userAdmin = new UserAdmin({ nombre, correo, password });

    const salt = bcryptjs.genSaltSync();
    userAdmin.password = bcryptjs.hashSync(password, salt);

    await userAdmin.save();

    res.status(200).json({
        userAdmin
    });
}