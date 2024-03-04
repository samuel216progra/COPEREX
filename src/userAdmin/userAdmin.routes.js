import { Router } from "express";
import { check } from "express-validator";
import { usuarioAdPost } from "./userAdmin.controller.js";

const router = Router();

router.post(
    "/",
    [
        check("name", "The name cannot be empty").not().isEmpty(),
        check("email", "The email cannot be empty").not().isEmpty(),
        check("password", "The password cannot be less than 6 characters").not().isLength({min:6}),
    ], usuarioAdPost);

export default router;