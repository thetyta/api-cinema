import path from 'path'
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * @param file Deve ser um arquivo que venha do req.files
 * @param params Deve ser um objeto contendo {tipo, tabela, id}
 * id: chave primaria do registro que tera ligação com a foto
 * tabela: tabela que o id está cadastrado
 * tipo: tipo do arquivo ex imagem ou arquivo
 * @return Objeto contendo erro ou sucesso
*/
export default async (file, params) =>{
    try {
        const __dirname = dirname(fileURLToPath(import.meta.url))
        let extensao = path.extname(file.name);
        let filePath = `public/${params.tipo}/${params.tabela}/${params.id}${extensao}`
        let uploadPath = `${__dirname}/../../${filePath}`
        await file.mv(uploadPath)
        return {
            type: 'success',
            message: uploadPath
        }
    } catch (error) {
        return {
            type: 'erro',
            message: error.message
        }
    }
}