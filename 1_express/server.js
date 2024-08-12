import express from "express";
import {v4 as uuidv4} from "uuid"

const PORT = 3333;

const app = express();

//Aceitar JSON
app.use(express.json());

//Rotas
/** Request HTTP
 * query params - ...:3333/pessoas?nome="Carlos"&idade=32
 *  Rotas do tipo GET (filtros e buscas)
 * route params - ...:3333/pessoas/5
 *  Rotas do tipo GET, PUT, PATCH, DELETE(listar um elemento)
 * body params - ...:3333/pessoas
 *  Rotas do tipo POST (Cadastro de informações)
 */

//Middleware
const  logRoutes = (request, response, next) => {
    const {url, method} = request;
    const rota = `[${method.toUpperCase()}] ${url}`;
    console.log(rota);
    next();
}

//Middleware para todas as rotas
app.use(logRoutes);

//Query Params
const users = [];
app.get("/users", (request, response)=>{
    //const query = request.query
    //console.log(query)
    const {nome, idade} = request.query;
    console.log(nome, idade);
    response.status(200).json(users);
});

app.post("/users", (request, response)=>{
    const {nome, idade} = request.body
    
    //validações
    if(!nome){
        response.status(400).json({msg: "O nome é obrigatória"})
        return
    }
    if(!idade){
        response.status(400).json({msg: "A idade é obrigatória"})
        return
    }
    const user = {
        id: uuidv4(),
        nome,
        idade
    }
    users.push(user)
    response.status(201).json(user);
});

//Routes Params
app.put("/users/:id", (request, response)=>{
    const {id} = request.params;
    const {nome, idade} = request.body;

    const indexUser = users.findIndex((user)=> user.id == id)
    if(indexUser === -1){
        response.status(404).json({msg: "Usuario não encontrado"})
        return
    }
    
    if(!nome || !idade){
        response.status(400).json({msg: "Nome e idade obrigatorios"})
        return
    }

    const UpdatedUser = {
        id,
        nome,
        idade
    }

    users[indexUser] = UpdatedUser
    response.status(200).json(UpdatedUser);
});

app.delete("/users", (request, response)=>{
    response.status(200).json([
        "Pessoa 10",
        "Pessoa 3",
        "Pessoa 4"
    ]);
});

app.listen(PORT, ()=>{
    console.log("Server on PORT "+PORT);
});
