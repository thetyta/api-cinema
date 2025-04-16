import SessaoController from "../controllers/SessaoController.js";

export default (app) => {
    app.get('/sessao', SessaoController.get);
    app.get('/sessao/:id', SessaoController.get);
    app.post('/sessao', SessaoController.persist);
    app.patch('/sessao/:id', SessaoController.persist);
    app.delete('/sessao/:id', SessaoController.destroy);
}