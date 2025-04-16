import CargoController from "../controllers/CargoController.js";

export default (app) => {
    app.get('/cargo', CargoController.get);
    app.get('/cargo/:id', CargoController.get);
    app.post('/cargo', CargoController.persist);
    app.patch('/cargo/:id', CargoController.persist);
    app.delete('/cargo/:id', CargoController.destroy);
}