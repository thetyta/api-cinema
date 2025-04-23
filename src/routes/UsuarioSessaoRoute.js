import UsuarioSessoesController from "../controllers/UsuarioSessoesController.js";

export default (app) => {
    app.get('/sessao/usuario', UsuarioSessoesController.get);
    app.get('/sessao/usuario/:id', UsuarioSessoesController.get);
    app.post('/sessao/usuario', UsuarioSessoesController.persist);
    app.patch('/sessao/usuario/:id', UsuarioSessoesController.persist);
    app.delete('/sessao/usuario/:id', UsuarioSessoesController.destroy);
    app.post('/sessao/vendas', UsuarioSessoesController.compra);
}