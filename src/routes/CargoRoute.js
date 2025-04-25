import CargoController from "../controllers/CargoController.js";
import cargoMiddleware from "../middlewares/cargoMiddleware.js";
import tempoMiddleware from "../middlewares/tempoMiddleware.js";

export default (app) => {
    app.get('/cargo', tempoMiddleware, cargoMiddleware, CargoController.get);
    app.get('/cargo/:id', CargoController.get);
    app.post('/cargo', CargoController.persist);
    app.patch('/cargo/:id', CargoController.persist);
    app.delete('/cargo/:id', CargoController.destroy);
}