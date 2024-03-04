import mongoose from "mongoose";

const EmpresaSchema = mongoose.Schema({
    nombreEmpresa:{
        type: String,
        required: [true, "Company name is required"]
    },
    fundacionEmpresa:{
        type: Number,
        required: [true, "The year of foundation is mandatory"]
    },
    nivelImpacto:{
        type: String,
        required: [true, "Impact level is mandatory"]
    },
    anTrayectoria:{
        type: Number,
        required: [true, "Years of experience are mandatory"]
    },
    categoriaEmpresarial:{
        type: String,
        required: [true, "Business category is mandatory"]
    },
    estadoEmpresa:{
        type: Boolean,
        default: true
    }
});

export default mongoose.model('Empresa', EmpresaSchema);