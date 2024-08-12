import "dotenv/config";
import express from "express";
import conn from "./config/conn.js";

//Importação dos modulos e criação das tabelas
import "./models/livroModel.js";
import "./models/funcionarioModel.js";
import "./models/clienteModel.js";
import "./models/emprestimoModel.js";

//Criação das rotas
import livrosRoutes from "./routes/livroRoutes.js";
import funcionariosRoutes from "./routes/funcionarioRoutes.js";
import clientesRoutes from "./routes/clienteRoutes.js";
import emprestimosRoutes from "./routes/emprestimoRoutes.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Utilização das rotas
//http://localhost:3333/livros
app.use("/livros", livrosRoutes);

//http://localhost:3333/funcionarios
app.use("/funcionarios", funcionariosRoutes);

//http://localhost:3333/clientes
app.use("/clientes", clientesRoutes);

//http://localhost:3333/emprestimos
app.use("/emprestimos", emprestimosRoutes);

const PORT = process.env.PORT;

app.get("/", (request, response) => {
  response.send("Olá, Mundo!");
});

app.listen(PORT, () => {
  console.log("Servidor rodando na porta: " + PORT);
});
