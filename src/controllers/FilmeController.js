import Filme from "../models/FilmesModel.js"
import uploadFile from "../uploadFile.js"


const get = async(req,res) =>{
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null
        if (!id) {
            const response = await Filme.findAll({
                order: 
                [['id', 'ASC']]
            })
            return res.status(200).send({
                message: 'Dados encontrados',
                data: response
            })
        }

        const response = await Filme.findOne({
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
            descricao,
            autor,
            duracao,
        } = corpo

        const response = await Filme.create({
            nome,
            descricao,
            autor,
            duracao,
        })

        return response
    } catch (error) {
        throw new Error(error.message)
    }
}

const createImgFilme = async (req, res) => {
    try {
        const { id } = req.body;

        if (!req.files) {
            return res.status(400).send({
                message: 'Nenhum arquivo enviado.'
            });
        }

        const arquivo = req.files

        const filme = await Filme.findOne({ where: { id } });

        if (!filme) {
            return res.status(404).send({
                message: 'Filme não encontrado.'
            });
        }

        const uploadResult = await uploadFile(arquivo, {id: filme.id, tipo: 'imagem', tabela: 'filme' });

        if (uploadResult.type === 'erro') {
            return res.status(500).send({
                message: 'Erro ao fazer upload da imagem',
                error: uploadResult.message
            });
        }

        filme.imagemUrl = uploadResult.message; 
        await filme.save();

        return res.status(200).send({
            message: 'Imagem enviada com sucesso!',
            data: uploadResult
        });

    } catch (error) {
        return res.status(500).send({
            message: 'Erro ao enviar imagem',
            error: error.message
        });
    }
};




const update = async (corpo, id) => {
    try {
        const response = await Filme.findOne({
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

        const response = await Filme.findOne({
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
    createImgFilme,
    persist,
    update,
    destroy
}