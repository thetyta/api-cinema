import Usuario from "./UsuarioModel.js";
import Cargo from "./CargoModel.js";
import Filme from "./FilmesModel.js";
import Padrao from "./PadraoLugar.js";
import Sala from "./SalasModel.js";
import Sessao from "./SessaoModel.js";
import UsuarioSessao from "./UsuariosSessoesModel.js";

(async () => {
    await Cargo.sync({ force:true })
    await Filme.sync({ force:true })
    await Padrao.sync({ force:true })
    await Sala.sync({ force:true })
    await Sessao.sync({ force:true })
    await Usuario.sync({ force:true })
    await UsuarioSessao.sync({ force:true })
})();