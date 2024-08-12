import { fileURLToPath } from "node:url";
import express from "express";
import path from "node:path";
import cors from "cors";
import "dotenv/config";

//importar conexão
import conn from "./config/conn.js";

//Importar dos módulos (TABELA)
import "./models/objetoImagesModel.js";
import "./models/usuarioModel.js";
import "./models/objetoModel.js";

//importar as rotas
import usuarioRouter from "./routes/usuarioRoute.js";
import objetoRouter from "./routes/objetoRouter.js";

const PORT = process.env.PORT;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Localizar onde está a pasta public
app.use("/public", express.static(path.join(__dirname, "public")));

//CORS
app.use(
  cors({
    origin: "https://localhost:5372",
  })
);

//Utilizar a rota
app.use("/usuarios", usuarioRouter);
app.use("/objetos", objetoRouter);

app.use((request, response) => {
  response.status(404).json({ message: "Recurso não encontrado " });
}); //404

// app.get("*", (request, response) => {
//   response.send("Olá, Mundo!");
// });

app.listen(PORT, () => {
  console.log("Servidor rodando na porta: " + PORT);
});
