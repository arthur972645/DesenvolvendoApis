import conn from "../config/conn.js";
import { v4 as uuidv4 } from "uuid";

export const getClientes = (request, response) => {
  const sql = /*sql*/ `SELECT * FROM clientes`;

  conn.query(sql, (err, data) => {
    if (err) {
      console.error(err);
      response.status(500).json({ msg: "Erro ao listar clientes" });
      return;
    }
    response.status(200).json(data);
  });
};

export const postClientes = (request, response) => {
  const { nome, senha, email, imagem } = request.body;

  if (!nome) {
    response.status(400).json({ message: "O nome é obrigatório!" });
    return;
  }
  if (!senha) {
    response.status(400).json({ message: "O senha é obrigatório!" });
    return;
  }
  if (!email) {
    response.status(400).json({ message: "O email é obrigatório!" });
    return;
  }
  const checkSql = /*sql*/ `SELECT * FROM clientes WHERE ?? = ?`;
  const checkInsertSql = ["email", email];
  conn.query(checkSql, checkInsertSql, (err, data) => {
    if (data.length > 0) {
      response.status(400).json({ msg: "cliente já existe" });
      return;
    }
    const id = uuidv4();

    const sql = /*sql*/ `
      INSERT INTO clientes(??,??,??,??,??)
      VALUES(?,?,?,?,?)
      `;
    const insertData = [
      "cliente_id",
      "nome",
      "senha",
      "email",
      "imagem",
      id,
      nome,
      senha,
      email,
      imagem,
    ];

    conn.query(sql, insertData, (err, data) => {
      if (err) {
        console.error(err);
        response.status(500).json({ msg: "Erro ao cadatrar cliente" });
        return;
      }
      response.status(201).json({ msg: "criado" });
    });
  });
};

export const buscarCliente = (request, response) => {
  const { id } = request.params;

  const sql = /*sql*/ `SELECT * FROM clientes WHERE ?? = ?`;
  const insertData = ["cliente_id", id];

  conn.query(sql, insertData, (err, data) => {
    if (data.length === 0) {
      response.status(404).json({ msg: "cliente não existe" });
    }
    response.status(200).json(data);
  });
};

export const editarCliente = (request, response) => {
  const { id } = request.params;
  const { nome, senha, email, imagem } = request.body;

  if (!nome) {
    response.status(400).json({ message: "O nome é obrigatório!" });
    return;
  }
  if (!senha) {
    response.status(400).json({ message: "O senha é obrigatório!" });
    return;
  }
  if (!email) {
    response.status(400).json({ message: "O email é obrigatório!" });
    return;
  }

  const checkSql = /*sql*/ `SELECT * FROM clientes WHERE id = "${id}"`;
  conn.query(checkSql, (err, data) => {
    if (err) {
      console.error(err);
      response.status(500).json({ msg: "Erro ao buscar cliente" });
      return;
    }
    if (data.length === 0) {
      return response.status(404).json({ msg: "cliente não encontrado" });
    }

    //Consulta SQL para atualizar livro
    const updateSql = /*sql*/ `
    UPDATE clientes 
    SET ?? = ?, ?? = ?, ?? = ?, ?? = ? 
    WHERE ?? = ?;
    `;
    const insertData = [
      "cliente_id",
      id,
      "nome",
      nome,
      "email",
      email,
      "senha",
      senha,
      "imagem",
      imagem,
    ];

    conn.query(updateSql, insertData, (err) => {
      if (err) {
        console.error(err);
        response.status(500).json({ msg: "Erro ao atualizar cliente" });
        return;
      }
      response.status(200).json({ msg: "cliente atualizado" });
    });
  });
};
