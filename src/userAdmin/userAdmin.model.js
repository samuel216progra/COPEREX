import mongoose from "mongoose";

const UsuarioAdSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: [true, "The name is required"]
    },
    correo:{
        type: String,
        required: [true, "Email is mandatory"],
        unique: true
    },
    password:{
        type: String,
        required: [true, "Password is required"]
    },
    role:{
        type: String,
        default: "ADMIN_ROLE"
    },
    estado:{
        type: Boolean,
        default: true
    }
});

UsuarioAdSchema.methods.toJson = function(){
    const { __v, password, _id,...usuarioAd } = this.toObject();
    usuarioAd.uid = _id;
    return usuarioAd
}

export default mongoose.model('Usuario', UsuarioAdSchema);