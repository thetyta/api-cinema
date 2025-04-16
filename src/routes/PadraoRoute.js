import PadraoController from "../controllers/PadraoController.js";

export default (app) => {
    app.get('/padrao', PadraoController.get);
    app.get('/padrao/:id', PadraoController.get);
    app.post('/padrao', PadraoController.persist);
    app.patch('/padrao/:id', PadraoController.persist);
    app.delete('/padrao/:id', PadraoController.destroy);
}