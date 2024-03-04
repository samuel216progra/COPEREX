import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJwt } from "../middlewares/validar-jwt.js";
import { actualizarEmpresa, anTrayectoriaE, categoriaEmpresarial, empresaPost, companies, obtenerExcel, ordenEmpresas } from "./company.controller.js";

const router = Router();

router.post(
    "/",
    [
        validarJwt,
        check("company name", "The company name cannot be empty").not().isEmpty(),
        check("foundationCompany", "The year of foundation of the company cannot be empty").not().isEmpty(),
        check("levelImpact", "The company impact level cannot be empty").not().isEmpty(),
        check("anTrayectoria", "The years of history of the company cannot be empty").not().isEmpty(),
        check("categoryBusiness", "The business category cannot be empty").not().isEmpty(),
        validarCampos,
    ], empresaPost);

router.get("/", companies);

router.get("/or", validarJwt, ordenEmpresas);

router.get("/an", validarJwt, anTrayectoriaE);

router.get("/categoria", validarJwt, categoriaEmpresarial);

router.put(
    "/:id",
    [
        validarJwt,
        check("id", "It is not a valid id").isMongoId(),
        validarCampos,
    ], actualizarEmpresa);

router.get(
    "/excel",
    validarJwt,
    obtenerExcel);

export default router;