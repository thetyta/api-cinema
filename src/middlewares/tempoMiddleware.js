import jwt from "jsonwebtoken"
export default (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(400).send({
                message: 'Token não fornecido.'
            });
        }
        if (!jwt.verify(req.headers.authorization.split(' ')[1], process.env.TOKEN_KEY)) {
            return res.status(400).send({
                message: 'Token inválido.'
            });
        }
        next()
    } catch (error) {
        return res.status(500).send({
            error: error.message,
            message: "legal"
        })
    }
}