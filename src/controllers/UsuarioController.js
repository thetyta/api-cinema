import Usuario from "../models/UsuarioModel.js"
import bcrypt, { hash } from 'bcrypt'
import jwt from "jsonwebtoken"
import Cargo from "../models/CargoModel.js"
import sendMail from "../utils/email.js"
import { Op } from "sequelize"


const get = async(req,res) =>{
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null
        if (!id) {
            const response = await Usuario.findAll({
                order: 
                [['id', 'ASC']]
            })
            return res.status(200).send({
                message: 'Dados encontrados',
                data: response
            })
        }

        const response = await Usuario.findOne({
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
            nome,
            email,
            cpf,
            estudante,
            idCargo,
            password
        } = corpo

        const verificaEmail = await Usuario.findOne({
            where: {
                email
            }
        });

        if (verificaEmail) {
            throw new Error(
                'Já existe um usuário com esse email'
            )
        }

        const passwordHash = await bcrypt.hash(password, 10)
        console.log(passwordHash);
    
        const response = await Usuario.create({
            nome,
            email,
            cpf,
            estudante,
            idCargo,
            passwordHash
        })

        return response
    } catch (error) {
        throw new Error(error.message)
    }
}

const login = async (req,res) =>{
    try {
        const {
            email,
            password
        } = req.body

        const user = await Usuario.findOne({
            where: {
                email
            }
        });

        if(!user){
            return res.status(400).send({
                message: 'Usuário ou senha incorretos'
            })
        }

        const compararSenha = await bcrypt.compare(password, user.passwordHash)
        if (compararSenha) {
            const token = jwt.sign({ 
                idUsuario: user.id,
                nome: user.nome,
                email: user.email
            }, process.env.TOKEN_KEY, { expiresIn: '8h' });
            return res.status(200).send({
                message: 'sucesso!',
                response: token
            })
        } else {
            return res.status(400).send({
                message: 'Usuário ou senha incorretos'
            })
        }
        }
     catch (error) {
        throw new Error(error.message)
    }
}

const getPass = async (req, res) => {
    try {
        const { email } = req.body
        console.log(email);
        
        if(!email){
            return res.status(400).send({
                message: 'Email é obrigatorio'
            })
        }

        const user = await Usuario.findOne({
            where: {
                email
            }
        })
        console.log(`dados usuario:${user}\n`);
        
        if(!user){
            return res.status(400).send({
                message: 'Usuário com esse email não existe'
            })
        }

        const codigo = Math.floor(100000 + Math.random() * 900000).toString();
        const expiracao = new Date(Date.now());
        expiracao.setMinutes(expiracao.getMinutes() + 30);

        user.codigoRecuperacao = codigo
        user.codigoExpires = expiracao
        console.log(`codigo rec:${user.codigoRecuperacao}\n`);
        console.log(`codigo exp:${user.codigoExpires}\n`);

        await user.save()


        const body = `
        <h1>Recuperação de Senha</h1>
        <p>Olá, ${user.nome}.</p>
        <p>Seu código de recuperação é: <strong>${codigo}</strong></p>
        <p>Este código expira em 30 minutos.</p>
        `;
        console.log(`\n body: ${body}`);
        
        
        await sendMail('joao.vc2006@unochapeco.edu.br', user.nome, body, "Recuperação de Senha");

        return res.status(200).send({
            message: "Código de recuperação enviado para o e-mail."
        });
    } catch (error) {
        throw new Error(error.message)
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email, codigoRecuperacao: codigo } = req.body;
        const novaSenha = req.body.novaSenha;
        const user = await Usuario.findOne({ 
            where: {
                email,
                codigoRecuperacao: codigo.toString(),
                codigoExpires: { [Op.gt]: new Date() }
                }
            });
    
        if (!user) {
            return res.status(400).send({
                message: "Código inválido ou expirado."
            });
        }
    
        const passwordHash = await bcrypt.hash(novaSenha, 10);
    
        user.passwordHash = passwordHash;
        user.codigoRecuperacao = null; 
        user.codigoExpires = null;
        await user.save();
    
        return res.status(200).send({
            message: "Senha atualizada com sucesso."
        });
    
    } catch (error) {
        return res.status(500).send({
            message: "Erro ao redefinir a senha.",
            error: error.message
        });
    }
 };

const getDataByToken = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(400).send({
                message: 'Token não fornecido.'
            });
        }
        const user = jwt.verify(token, process.env.TOKEN_KEY);

        if (!user) {
            return res.status(400).send({
                message: 'Token inválido.'
            });
        }
        
        const userr = await Usuario.findOne({
            where: { id: user.idUsuario },
            include: {
                model: Cargo,
                as: 'cargo',
                attributes: ['id', 'nome', 'descricao']
            }
        });

        if (!userr) {
            return res.status(404).send({
                message: 'Usuário não encontrado.'
            });
        }
        
        const resposta = {
            id: userr.id,
            nome: userr.nome,
            cargo: userr.cargo.nome || null,
            desc: userr.cargo.descricao || null,
            idCargo: userr.cargo.id
        }


        return res.status(200).send({
            resposta
        });

    } catch (error) {
        return res.status(400).send({
            message: error.message
        });
    }
};

const update = async (corpo, id) => {
    try {
        const response = await Usuario.findOne({
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

        const response = await Usuario.findOne({
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



export default {
    get,
    login,
    getPass,
    resetPassword,
    getDataByToken,
    persist,
    update,
    destroy
}