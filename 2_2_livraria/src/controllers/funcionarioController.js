import conn from "../config/conn.js";
import { v4 as uuidv4 } from "uuid";

export const getFuncionarios = (request, response)=>{
    const sql = /*sql*/`SELECT * FROM funcionarios`

    conn.query(sql, (err, data)=>{
        if(err){
            console.error(err)
            response.status(500).json({msg:"Erro ao listar funcionarios"})
            return
        }
        response.status(200).json(data)
    })
}

export const postFuncionarios = (request, response)=>{
    const {nome, cargo, data_contratacao, salario, email} = request.body

    if(!nome){
        response.status(400).json({message: 'O nome é obrigatório!'})
        return
    }
    if(!cargo){
        response.status(400).json({message: 'O cargo é obrigatório!'})
        return
    }
    if(!data_contratacao){
        response.status(400).json({message: 'A data de contratação é obrigatório!'})
        return
    }
    if(!salario){
        response.status(400).json({message: 'O salario é obrigatório!'})
        return
    }
    if(!email){
        response.status(400).json({message: 'O email é obrigatório!'})
        return
    }
    const checkSql = /*sql*/`SELECT * FROM funcionarios WHERE email = "${email}"`
    conn.query(checkSql, (err, data)=>{
        if(data.length > 0){
            response.status(400).json({msg: "funcionario já existe"})
            return
        }
        const id = uuidv4()
        const sql = /*sql*/`
        INSERT INTO funcionarios(id, nome, cargo, data_contratacao, salario, email)
        VALUES("${id}","${nome}","${cargo}","${data_contratacao}","${salario}","${email}")
        `
        
        conn.query(sql, (err, data)=>{
            if(err){
                console.error(err)
                response.status(500).json({msg:"Erro ao cadatrar funcionario"})
                return
            }
            response.status(201).json({msg: "criado"})
        })
    })
}

export const buscarFuncionario = (request, response)=>{
    const {id} = request.params

    const sql = /*sql*/`SELECT * FROM funcionarios WHERE id = "${id}"`
    conn.query(sql, (err, data)=>{
        if(data.length === 0){
            response.status(404).json({msg:"Funcionario não existe"})
        }
        response.status(200).json(data)
    })
}

export const editarFuncionario = (request, response)=>{
    const {id} = request.params
    const {nome, cargo, data_contratacao, salario, email} = request.body

    if(!nome){
        response.status(400).json({message: 'O nome é obrigatório!'})
        return
    }
    if(!cargo){
        response.status(400).json({message: 'O cargo é obrigatório!'})
        return
    }
    if(!data_contratacao){
        response.status(400).json({message: 'A data de contratação é obrigatório!'})
        return
    }
    if(!salario){
        response.status(400).json({message: 'O salario é obrigatório!'})
        return
    }
    if(!email){
        response.status(400).json({message: 'O email é obrigatório!'})
        return
    }

    const checkSql = /*sql*/`SELECT * FROM funcionarios WHERE id = "${id}"`
    conn.query(checkSql, (err, data)=>{
        if(err){
            console.error(err)
            response.status(500).json({msg:"Erro ao buscar funcionario"})
            return
        }
        if(data.length === 0){
            return response.status(404).json({msg: "funcionario não encontrado"})
        }

        //Consulta SQL para atualizar livro
        const upadateSql = /*sql*/`UPDATE funcionarios SET
        nome = "${nome}", cargo = "${cargo}", data_contratacao = "${data_contratacao}",
        salario = "${salario}", email = "${email}"
        WHERE id = "${id}"`

        conn.query(upadateSql, (err)=>{
            if(err){
                console.error(err)
                response.status(500).json({msg: "Erro ao atualizar funcionario"})
                return
            }
            response.status(200).json({msg:"funcionario atualizado"})
        })
    })
}

export const deletarFuncionario = (request, response) => {
    const {id} = request.params

    const deleteSql = /*sql*/ `DELETE FROM funcionarios WHERE id = "${id}"`
    conn.query(deleteSql, (err, info)=>{
        if(err){
            console.error(err)
            response.status(500).json({message: "Erro ao deletar funcionário"})
            return  
        }

        if(info.affectedRows === 0){
            response.status(404).json({message: "Funcionário não encontrado"})
            return
        }

        response.status(204).json({message: "Funcionário selecionado foi deletado"})
    })
}
