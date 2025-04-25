import UsuarioController from "../controllers/UsuarioController.js";

export default (app) => {
    app.get('/usuario/info', UsuarioController.getDataByToken);
    app.get('/usuario', UsuarioController.get);
    app.get('/usuario/:id', UsuarioController.get);
    app.post('/usuario/login', UsuarioController.login)
    app.post('/usuario', UsuarioController.persist);
    app.patch('/usuario/:id', UsuarioController.persist);
    app.delete('/usuario/:id', UsuarioController.destroy);
}