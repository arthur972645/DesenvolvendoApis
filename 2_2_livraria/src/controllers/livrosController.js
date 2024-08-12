import conn from "../config/conn.js";
import { v4 as uuidv4 } from "uuid";

export const getLivros = (request, response) => {
  const sql = `SELECT * FROM livros`;
  conn.query(sql, (err, data) => {
    if (err) {
      response.status(500).json({ msg: "Erro ao buscar livros" });
      return;
    }
    const livros = data;
    response.status(200).json(livros);
  });
};

export const postLivros = (request, response) => {
  const { titulo, autor, ano_publicacao, genero, preco } = request.body; // tá recebendo as requisições

  // validação
  // vai ser um if para cada umas das informações, para garantir que não venham vazios
  if (!titulo) {
    response.status(400).json({ message: "O título é obrigatório!" });
    return;
  }
  if (!autor) {
    response.status(400).json({ message: "O autor é obrigatório!" });
    return;
  }
  if (!ano_publicacao) {
    response
      .status(400)
      .json({ message: "O ano de publicação é obrigatório!" });
    return;
  }
  if (!genero) {
    response.status(400).json({ message: "O genero é obrigatório!" });
    return;
  }
  if (!preco) {
    response.status(400).json({ message: "O preco é obrigatório!" });
    return;
  }

  // cadastrar um livro -> antes preciso saber se esse livro existe
  const checkSql = /*sql*/ `
    SELECT * FROM livros 
    WHERE ?? = ? AND 
    ?? = ? AND 
    ?? = ?
    `;
  const checkSqlData = [
    "titulo",
    titulo,
    "autor",
    autor,
    "ano_publicacao",
    ano_publicacao,
  ];

  conn.query(checkSql, checkSqlData, (err, data) => {
    if (err) {
      response.status(500).json({ message: "Erro ao buscar os livros" });
      return console.log(err);
    }
    if (data.length > 0) {
      // se for maior que 0 significa que já existe um livro com essas informações
      response
        .status(409)
        .json({ message: "Livro já cadastrado na base de dados" }); // 409 - deu certo mas não esparava esses dados
      return console.log(err);
    }

    const id = uuidv4(); // passando o id aleatório através do uuid
    const disponibilidade = 1; // aqui coloca 1 pq o banco de dados lá vai interpretar que está disponivel, e se estamos cadastrando é pq iremos ter o livro disponível

    // agora vamos cadastrar as informações
    const insertSql = /*sql*/ `
      INSERT INTO livros(??, ??, ??, ??, ??, ??, ??) VALUES (?,?,?,?,?,?,?);
      `;

    const insertData = [
      "livro_id",
      "titulo",
      "autor",
      "ano_publicacao",
      "genero",
      "preco",
      "disponibilidade",
      id,
      titulo,
      autor,
      ano_publicacao,
      genero,
      preco,
      disponibilidade,
    ];

    conn.query(insertSql, insertData, (err) => {
      if (err) {
        response.status(500).json({ message: "Erro ao cadastrar o livro" });
        return console.log(err);
      }
      response.status(201).json({ message: "Livro cadastrado" });
    });
  });
};

export const buscarLivro = (request, response) => {
  const { id } = request.params;

  const sql = /*sql*/ `SELECT * FROM livros WHERE ?? = ?`;
  const insertData = ["livro_id", id];

  conn.query(sql, insertData, (err, data) => {
    if (err) {
      console.error(err);
      response.status(500).json({ msg: "Erro ao  buscar livro" });
      return;
    }
    if (data.length === 0) {
      response.status(404).json({ msg: "Livro não encontrado" });
      return;
    }
    response.status(200).json(data);
  });
};

export const editarLivro = (request, response) => {
  const { id } = request.params;
  const { titulo, autor, ano_publicacao, genero, preco, disponibilidade } =
    request.body;

  //validações
  if (!titulo) {
    response.status(400).json({ message: "O título é obrigatório!" });
    return;
  }
  if (!autor) {
    response.status(400).json({ message: "O autor é obrigatório!" });
    return;
  }
  if (!ano_publicacao) {
    response
      .status(400)
      .json({ message: "O ano de publicação é obrigatório!" });
    return;
  }
  if (!genero) {
    response.status(400).json({ message: "O genero é obrigatório!" });
    return;
  }
  if (!preco) {
    response.status(400).json({ message: "O preco é obrigatório!" });
    return;
  }
  if (disponibilidade === undefined) {
    response.status(400).json({ msg: "Disponibilidade é obrigatória" });
  }

  //consultas
  const checkSql = /*sql*/ `SELECT * FROM livros WHERE ?? = ?`;
  const insertData = ["livro_id", id];
  conn.query(checkSql, insertData, (err, data) => {
    if (err) {
      console.error(err);
      response.status(500).json({ msg: "Erro ao buscar livros" });
      return;
    }
    if (data.length === 0) {
      return response.status(404).json({ msg: "livro não encontrado" });
    }

    //Consulta SQL para atualizar livro
    const upadateSql = /*sql*/ `UPDATE livros SET
      ?? = ?, ?? = ?, ?? = ?,
      ?? = ?, ?? = ?, ?? = ?
      WHERE ?? = ?`;

    const checkSqlData = [
      "titulo",
      titulo,
      "autor",
      autor,
      "ano_publicacao",
      ano_publicacao,
      "genero",
      genero,
      "preco",
      preco,
      "disponibilidade",
      disponibilidade,
      "livro_id",
      id,
    ];

    conn.query(upadateSql, checkSqlData, (err) => {
      if (err) {
        console.error(err);
        response.status(500).json({ msg: "Erro ao atualizar livro" });
        return;
      }
      response.status(200).json({ msg: "livro atualizado" });
    });
  });
};

export const deletarLivro = (request, response) => {
  const { id } = request.params; // pega o id que for passado na rota

  const deleteSql = /*sql*/ `delete from livros where ?? = ?`;
  const insertData = ["livro_id", id];

  conn.query(deleteSql, insertData, (err, info) => {
    if (err) {
      console.error(err);
      response.status(500).json({ message: "Erro ao deletar livro" });
    }
    console.log(info);
    if (info.affectedRows === 0) {
      response.status(404).json({ messagae: "Livro não encontrado" });
      return;
    }

    response.status(200).json({ message: "Livro selecionado foi deletado" });
  });
};
