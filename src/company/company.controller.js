import { request, response } from "express";
import Company from "./company.model.js"
import Excel from "exceljs"

export const empresaPost = async (req, res) => {
    const { nombreEmpresa, fundacionEmpresa, nivelImpacto, anTrayectoria, categoriaEmpresarial } = req.body;
    const company = new Company({ nombreEmpresa, fundacionEmpresa, nivelImpacto, anTrayectoria, categoriaEmpresarial });

    await company.save();

    res.status(200).json({
        company
    });
}

export const companies = async (req, res) => {
    const query = { estadoEmpresa: true };

    const [cantidadRegistradas, companies] = await Promise.all([
        Company.countDocuments(query),
        Company.find(query)
    ]);

    res.status(200).json({
        msg: "Companies",
        cantidadRegistradas,
        companies
    });
}

export const ordenEmpresas = async (req, res) => {
    const query = { estadoEmpresa: true };
    const direction = req.query.order === 'desc' ? -1 : 1;

    const [cantidadRegistradas, empresas] = await Promise.all([
        Empresa.countDocuments(query),
        Empresa.find(query).sort({ nombreEmpresa: direction })
    ]);

    res.status(200).json({
        msg: "Ordered companies",
        cantidadRegistradas,
        empresas
    });
}

export const anTrayectoriaE = async (req, res) => {
    const query = { estadoEmpresa: true };
    const filtrarAn = req.query.years ? { anTrayectoria: parseInt(req.query.years) } : {};
    const direction = req.query.order === 'desc' ? -1 : 1;

    const [cantidadRegistradas, empresas] = await Promise.all([
        Empresa.countDocuments({ ...query, ...filtrarAn }),
        Empresa.find({ ...query, ...filtrarAn }).sort({ nombreEmpresa: direction })
    ]);

    res.status(200).json({
        msg: "Matching company",
        cantidadRegistradas,
        empresas
    });
}

export const categoriaEmpresarial = async (req, res) => {
    const query = { estadoEmpresa: true };
    const categoria = req.query.categoria ? { categoriaEmpresarial: req.query.categoria } : {};

    if (req.query.categoria && (await Empresa.countDocuments({ ...query, ...categoria })) === 0) {
        return res.status(400).json({
            msg: "No companies were found for the category provided, check that the category name is spelled correctly (tildes, uppercase, lowercase)"
        });
    }

    const [cantidadRegistradas, empresas] = await Promise.all([
        Empresa.countDocuments({ ...query, ...categoria }),
        Empresa.find({ ...query, ...categoria })
    ]);

    res.status(200).json({
        msg: "Empresas coincidentes",
        cantidadRegistradas,
        empresas
    });
}



export const actualizarEmpresa = async (req, res) => {
    const { id } = req.params;
    const { _id, nombreEmpresa, estadoEmpresa,...resto} = req.body;

    await Empresa.findByIdAndUpdate(id, resto);

    const empresa = await Empresa.findOne({_id: id});

    res.status(200).json({
        msg: "Actualizado exitosamente",
        empresa
    })
}

export const obtenerExcel = async (req, res) => {
    const query = { estadoEmpresa: true };

    try {
        const empresas = await Empresa.find(query);
    
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Empresas');
    
        worksheet.addRow(['Nombre de la empresa', 'Año de fundacion', 'Nivel de impacto', 'Años de trayectoria', 'Categoría empresarial']);
    
        const agregarEmpresasFila = async (index) => {
            if (index < empresas.length) {
                const empresa = empresas[index];
                worksheet.addRow([
                    empresa.nombreEmpresa,
                    empresa.fundacionEmpresa,
                    empresa.nivelImpacto,
                    empresa.anTrayectoria,
                    empresa.categoriaEmpresarial
                ]);
                await agregarEmpresasFila(index + 1);
            } else {
                const buffer = await workbook.xlsx.writeBuffer();
    
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachment; filename="empresas.xlsx"');
    
                res.status(200).send(buffer);
            }
        };
    
        await agregarEmpresasFila(0);
    
    } catch (error) {
        console.log('Error al generar el excel', error)
    }
}