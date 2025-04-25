import jwt from "jsonwebtoken"
import Usuario from "../models/UsuarioModel.js";
import Cargo from "../models/CargoModel.js";

export default async (req, res, next) => {
    try {
        const user = jwt.verify(req.headers.authorization.split(' ')[1], process.env.TOKEN_KEY);
        const userr = await Usuario.findOne({
            where: { id: user.id },
            include: {
                model: Cargo,
                as: 'cargo',
                attributes: ['id']
            }
        });

        console.log(userr.cargo);
        
        
        if (!userr) {
            return res.status(404).send({
                message: 'Usuário não encontrado.'
            });
        }

        next();
    } catch (error) {
        return res.status(500).send({
            error: error.message,
            message: "legal2"
        })
    }
}