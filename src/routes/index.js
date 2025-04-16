import CargoRoute from "./CargoRoute.js";
import FilmeRoute from "./FilmeRoute.js";
import PadraoRoute from "./PadraoRoute.js";
import SalasRoute from "./SalasRoute.js";
import SessaoRoute from "./SessaoRoute.js";
import UsuarioRoute from "./UsuarioRoute.js";
import UsuarioSessaoRoute from "./UsuarioSessaoRoute.js";

function Routes(app){
    CargoRoute(app)
    FilmeRoute(app)
    PadraoRoute(app)
    SalasRoute(app)
    SessaoRoute(app)
    UsuarioRoute(app)
    UsuarioSessaoRoute(app)
}

export default Routes;