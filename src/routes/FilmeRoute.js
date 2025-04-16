import FilmeController from "../controllers/FilmeController.js";

export default (app) => {
    app.get('/filme', FilmeController.get);
    app.get('/filme/:id', FilmeController.get);
    app.post('/filme', FilmeController.persist);
    app.patch('/filme/:id', FilmeController.persist);
    app.delete('/filme/:id', FilmeController.destroy);
}