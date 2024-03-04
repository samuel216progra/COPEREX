import { Router } from "express";
import { check } from "express-validator";

import { usuarioLogin } from "./auth.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router()

router.post(
    "/",
    [
        check('email', 'This is not a valid email').isEmail(),
        check('password', 'Password is required').not().isEmpty(),
        validarCampos,
    ], usuarioLogin)

export default router