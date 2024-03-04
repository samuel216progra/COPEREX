import bcryptjs from 'bcryptjs';
import UsuarioAd from '../userAdmin/userAdmin.model.js'
import { generarJwt } from '../helpers/generar-jwt.js'; 

export const usuarioLogin = async (req, res) => {
    const { correo, password } = req.body;

    try {
        const usuario = await UsuarioAd.findOne({ correo });
    
        if (!usuario) {
          return res.status(400).json({
            msg: "Incorrect credentials, email does not exist in the database"
          });
        }

        if (!usuario.estado) {
          return res.status(400).json({
            msg: "Administrator user does not exist in the database"
          });
        }

        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
          return res.status(400).json({
            msg: "Incorrect password",
          });
        }

        const token = await generarJwt( usuario.id);
    
        res.status(200).json({
          msg: 'Welcome',
          usuario,
          token
        });
    
      } catch (e) {
        console.log(e);
        res.status(500).json({
          msg: "Contact administrator",
        });
      }
}
