//Pega o id do token e verifica se e o mesmo que esta no banco de dados

import jwt from "jsonwebtoken";
import conn from "../config/conn.js";

const getUserByToken = async (token) => {
  return new Promise((resolve, reject) => {
    if (!token) {
      response.status(401).json({ err: "Acesso negado!" });
      return;
    }
    //Descodificar o token utulizando a minha chave de acesso
    const decoded = jwt.verify(token, "SENHASUPERSEGURAEDIFICIL");
    //console.log("Funcao getUser: ",decoded)
    //token descodificado, irei pegar o valor do seu id
    const userId = decoded.id;
    //console.log("UserId: ",userId)
    //conferir se é o mesmo id que esta cadastrado no banco de dados
    const checkSql = /*sql*/ `SELECT * FROM usuarios WHERE ?? = ?`;
    const checkData = ["usuario_id", userId];
    conn.query(checkSql, checkData, (err, data) => {
      if (err) {
        reject({ status: 500, message: "Erro ao buscar usuario" });
      } else {
        //se for o mesmo ele retorna o usuario com esse id
        resolve(data[0]);
      }
    });
  });
};

export default getUserByToken;
