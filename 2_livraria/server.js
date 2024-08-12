import "dotenv/config"
import express, { response } from "express";
import mysql from "mysql2"
import {v4 as uuidv4} from "uuid"

const PORT = process.env.PORT

const app = express()

app.use(express.json())

//Criar conexão com o banco de dados MYSQL
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sen@iDev77!.',
    database: 'empresa',
    port: '3306',
})

//Conectar ao banco e dados
conn.connect((err)=>{
    if(err){
        console.error(err.stack)
    }
    console.log("MySql conectado")
    app.listen(PORT, ()=>{
        console.log("Servidor rodando na porta "+ PORT)
    })
})
//listar todos os livros
app.get('/livros', (request, response)=>{
    // query para o banco
    const sql = 'SELECT * FROM livros'

    conn.query(sql, (err, data)=>{
        if(err){
            response.status(500).json({msg: "erro ao buscar os livros"})
            return console.log(err)
        }
        const livros = data
        console.log(data)
        console.log(typeof data)
        response.status(200).json(livros)
    })
})
//listar um livro
app.get('/livros/:id', (request, response)=>{
    const {id} = request.params

    const sql = /*sql*/`SELECT * FROM livros WHERE id = "${id}"`
    conn.query(sql, (err, data)=>{
        if(err){
            console.error(err)
            response.status(500).json({msg:"Erro ao  buscar livro"})
            return
        }
        if(data.length === 0){
            response.status(404).json({msg: "Livro não encontrado"})
            return
        }
        response.status(200).json(data)
    })
})
//cadastrar um livro
app.post('/livros', (request, response)=>{
    const {titulo, autor, ano_publicacao, genero, preco} = request.body // tá recebendo as requisições

    // validação
    // vai ser um if para cada umas das informações, para garantir que não venham vazios
    if(!titulo){
        response.status(400).json({message: 'O título é obrigatório!'})
        return
    }
    if(!autor){
        response.status(400).json({message: 'O autor é obrigatório!'})
        return
    }
    if(!ano_publicacao){
        response.status(400).json({message: 'O ano de publicação é obrigatório!'})
        return
    }
    if(!genero){
        response.status(400).json({message: 'O genero é obrigatório!'})
        return
    }
    if(!preco){
        response.status(400).json({message: 'O preco é obrigatório!'})
        return
    }

    // cadastrar um livro -> antes preciso saber se esse livro existe
    const checkSql = /*sql*/ `
    SELECT * FROM livros 
    WHERE titulo = "${titulo}" AND 
    autor = "${autor}" AND 
    ano_publicacao = "${ano_publicacao}"
    `;

    conn.query(checkSql, (err, data)=>{
        if(err){
            response.status(500).json({message: "Erro ao buscar os livros"})
            return console.log(err)
        }
        if(data.length > 0){ // se for maior que 0 significa que já existe um livro com essas informações
            response.status(409).json({message: 'Livro já cadastrado na base de dados'}) // 409 - deu certo mas não esparava esses dados
            return console.log(err)
        }

        const id = uuidv4() // passando o id aleatório através do uuid
        const disponibilidade = 1 // aqui coloca 1 pq o banco de dados lá vai interpretar que está disponivel, e se estamos cadastrando é pq iremos ter o livro disponível

        // agora vamos cadastrar as informações
        const insertSql = /*sql*/ `insert into livros(id, titulo, autor, ano_publicacao, genero, preco, disponibilidade) 
        values("${id}","${titulo}","${autor}","${ano_publicacao}","${genero}","${preco}","${disponibilidade}");`

        conn.query(insertSql, (err)=>{
            if(err){
                response.status(500).json({message: 'Erro ao cadastrar o livro'})
                return console.log(err)
            }
            response.status(201).json({message: 'Livro cadastrado'})
        })
    })
})
//atualizar um livro
app.put('/livros/:id', (request, response)=>{
    const {id} = request.params
    const {titulo, autor, ano_publicacao, genero, preco, disponibilidade} = request.body

    //validações
    if(!titulo){
        response.status(400).json({message: 'O título é obrigatório!'})
        return
    }
    if(!autor){
        response.status(400).json({message: 'O autor é obrigatório!'})
        return
    }
    if(!ano_publicacao){
        response.status(400).json({message: 'O ano de publicação é obrigatório!'})
        return
    }
    if(!genero){
        response.status(400).json({message: 'O genero é obrigatório!'})
        return
    }
    if(!preco){
        response.status(400).json({message: 'O preco é obrigatório!'})
        return
    }
    if(disponibilidade === undefined){
        response.status(400).json({msg: "Disponibilidade é obrigatória"})
    }

    //consultas
    const checkSql = /*sql*/`SELECT * FROM livros WHERE id = "${id}"`
    conn.query(checkSql, (err, data)=>{
        if(err){
            console.error(err)
            response.status(500).json({msg:"Erro ao buscar livros"})
            return
        }
        if(data.length === 0){
            return response.status(404).json({msg: "livro não encontrado"})
        }

        //Consulta SQL para atualizar livro
        const upadateSql = /*sql*/`UPDATE livros SET
        titulo = "${titulo}", autor = "${autor}", ano_publicacao = "${ano_publicacao}",
        genero = "${genero}", preco = "${preco}", disponibilidade = "${disponibilidade}"
        WHERE id = "${id}"`

        conn.query(upadateSql, (err)=>{
            if(err){
                console.error(err)
                response.status(500).json({msg: "Erro ao atualizar livro"})
                return
            }
            response.status(200).json({msg:"livro atualizado"})
        })
    })
})
//deletar um livro
app.delete("/livros/:id", (request, response)=>{

})



//********************************* rotas de Funcionarios ***************************************************** */
// id, nome, cargo, data_contratação, salario, email, created_at, updated_at
//Rota 01 -> listar todos --
//Rota 02 -> Cadastrar Funcionario (Unico email por func) --
//Rota03 -> Lista 1 func 
//Rota04 -> Atualiza 1 func
//Rota 05 -> Deleta 1 func

//Listar todos
app.get("/funcionarios", (request, response)=>{
    const sql = /*sql*/`SELECT * FROM funcionarios`

    conn.query(sql, (err, data)=>{
        if(err){
            console.error(err)
            response.status(500).json({msg:"Erro ao listar funcionarios"})
            return
        }
        response.status(200).json(data)
    })
})
//Cadastrar
app.post("/funcionarios", (request, response)=>{
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
})
//Listar um usuario
app.get("/funcionarios/:id", (request, response)=>{
    const {id} = request.params

    const sql = /*sql*/`SELECT * FROM funcionarios WHERE id = "${id}"`
    conn.query(sql, (err, data)=>{
        if(data.length === 0){
            response.status(404).json({msg:"Funcionario não existe"})
        }
        response.status(200).json(data)
    })
})
//Atualiza um funcionario
app.put("/funcionarios/:id", (request, response)=>{
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

})
//Deletar um funcionario


//Rota 404
app.use((request, response)=>{
    response.status(404).json({msg: "Rota não encontrada"})
})
