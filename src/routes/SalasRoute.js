import SalasController from "../controllers/SalasController.js";

export default (app) => {
    app.get('/salas', SalasController.get);
    app.get('/salas/:id', SalasController.get);
    app.post('/salas', SalasController.persist);
    app.patch('/salas/:id', SalasController.persist);
    app.delete('/salas/:id', SalasController.destroy);
}