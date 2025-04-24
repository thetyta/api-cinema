import UsuarioSessao from "../models/UsuariosSessoesModel.js"
import Sessao from "../models/SessaoModel.js"
import Filme from "../models/FilmesModel.js"
import Sala from "../models/SalasModel.js"
import { sequelize } from "../config/postgres.js"

const get = async(req,res) =>{
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null
        if (!id) {
            const response = await UsuarioSessao.findAll({
                order: 
                [['id', 'ASC']]
            })
            return res.status(200).send({
                message: 'Dados encontrados',
                data: response
            })
        }

        const response = await UsuarioSessao.findOne({
            where: {
                id: id
            }
        })
    if (!response) {
        return res.status(404).send('not found')
    }
        return res.status(200).send({
                message: 'Dados encontrados',
                data: response
        })
    } catch (error) {
        return res.status(500).send({
            message: error.message
        })
    }
}

const create = async (corpo) => {
    try {
        const {
            idSessao,
            idUsuario,
            valorAtual
        } = corpo

        const response = await UsuarioSessao.create({
            idSessao,
            idUsuario,
            valorAtual,
            cancelado
        })

        return response
    } catch (error) {
        throw new Error(error.message)
    }
}

const update = async (corpo, id) => {
    try {
        const response = await UsuarioSessao.findOne({
            where: {
                id
            }
        })
        if (!response) {
            throw new Error()
        }

        Object.keys(corpo).forEach((item) => response[item] = corpo[item])
        await response.save()

        return response;
    } catch (error) {
        throw new Error(error.message)
    }
}

const destroy = async (req,res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null
        if (!id) {
            return res.status(400).send('informa ai paizao')
        }

        const response = await UsuarioSessao.findOne({
            where: {
                id
            }
        })
        if(!response){
            return res.status(404).send('not found')
        }

        await response.destroy()

        return res.status(200).send({
            message: 'registro excluido',
            data:response
        })
    } catch (error) {
        return res.status(500).send({
            message: error.message
        })
    }
}

const persist = async (req,res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null

        if(!id){
            const response = await create(req.body)
            return res.status(201).send({
                message: 'criado com sucesso!',
                data: response
            })
        }
        const response = await update(req.body, id)
            return res.status(201).send({
                message: 'atualizado com sucesso!',
                data: response
            })
    } catch (error) {
        return res.status(500).send({
            message: error.message
        })
    }
        
}

const compra = async (req, res) => {
    try {
        const {
            idSessao,
            idUsuario,
            codAssento,
            valorAtual
        } = req.body; 
        
        const sessao = await Sessao.findOne({ where: { id: idSessao } });

        if (!sessao) {
            return res.status(404).send({ message: 'nao achou a sessao' });
        }

        const lugares = sessao.getDataValue("lugares");
        const aux = lugares.findIndex(l => l.assento === codAssento);

        if (aux === -1) {
            return res.status(404).send({ message: 'Lugar não encontrado' });
        }

        if (lugares[aux].vendido) {
            return res.status(400).send({ message: 'lugar ocupado' });
        }

        lugares[aux].vendido = true;
        lugares[aux].idUsuario = idUsuario;

        // Atualiza sessao
        await Sessao.update(
            { lugares },
            { where: { id: idSessao } }
        );

        // Cria o registro
        await UsuarioSessao.create({
            idSessao,
            idUsuario,
            valorAtual,
        });


        return res.status(201).send({
            message: 'Compra realizada com sucesso!',
            data: {
                dataHora: sessao.dataHora,
                lugar: lugares[aux]
            }
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
};

const getComprasUsuario = async (req, res) => {
    try {
      const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;
      if (!id) {
        return res.status(400).send('informa ai paizao')
    }

      const compras = await UsuarioSessao.findAll({
        where: { 
            idUsuario: id 
        },
        include: [
          {
            model: Sessao,
            as: 'sessao',
            include: [
              { model: Filme, as: 'filme' },
              { model: Sala, as: 'sala' }
            ]
          }
        ],
        order: [
            ['created_at', 'DESC']
        ]
      });
  
      const resultado = compras.map((compra) => {
        const lugares = compra.sessao.lugares;
        const lugar = lugares.find(l => l.idUsuario === compra.idUsuario);
        return {
          filme: compra.sessao.filme.nome,
          dataHora: compra.sessao.dataInicio,
          sala: compra.sessao.sala.id,
          assento: lugar?.assento || 'N/A',
          valorPago: compra.valorAtual
        };
      });
  
      return res.status(200).send({ message: 'Compras encontradas', data: resultado });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  };

const cancelarCompra = async (req,res) => {
    try {
        const {
            idSessao,
            codAssento,
        } = req.body; 
        
        const sessao = await Sessao.findOne({ where: { id: idSessao } });

        console.log(codAssento);
        console.log(idSessao);
        
        
        if (!sessao) {
            return res.status(404).send({ message: 'nao achou a sessao' });
        }

        const lugares = sessao.getDataValue("lugares");
        const aux = lugares.findIndex(l => l.assento === codAssento);

        if (aux === -1) {
            return res.status(404).send({ message: 'Lugar não encontrado' });
        }

        if (!lugares[aux].vendido) {
            return res.status(404).send({ message: 'Lugar não vendido' });
        }        
        
        lugares[aux].vendido = false;
        lugares[aux].idUsuario = '';
        lugares[aux].cancelado = true;

        await Sessao.update(
            { lugares },
            { where: { id: idSessao } }
        );


        return res.status(201).send({
            message: 'Cancelamento realizado com sucesso!',
            data: {
                dataHora: sessao.dataHora,
                lugar: lugares[aux]
            }
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
};

const relatorio = async (req,res) =>{
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null
        if (!id) {
          return res.status(400).send('informa ai paizao')
      }

      const sessoes = await Sessao.findAll({
        where: { 
            id
        },
    })
        if(!sessoes.length){
            return res.status(404).send({ message: 'nao achou a sessao' });
        }
        const soma = await sequelize.query(
            `SELECT
                COUNT(*) AS contagem,
                SUM(valor_atual) AS somatorio
                FROM usuarios_sessoes
                WHERE id_sessao = ${id}
            `).then((a) => a[0][0]);
        if (!soma.contagem) {
            return res.status(404).send({ message: 'nenhuma venda na sessao' });
        }
            return res.status(200).send({
                id,
                summ: soma.somatorio,
                totalAssentos: soma.contagem,
            });

    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    } 
}  

export default {
    get,
    getComprasUsuario,
    cancelarCompra,
    relatorio,
    compra,
    persist,
    update,
    destroy
}