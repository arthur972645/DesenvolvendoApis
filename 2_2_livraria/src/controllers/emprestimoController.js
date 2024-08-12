import conn from "../config/conn.js";

export const getEmprestimos = (request, response) => {
  const sql = /*sql*/ `SELECT * FROM emprestimos`;

  conn.query(sql, (err, data) => {
    if (err) {
      console.error(err);
      response.status(500).json({ msg: "Erro ao listar os emprestimos" });
      return;
    }
    response.status(200).json(data);
  });
};

export const postEmprestimo = (request, response) => {
  const { cliente_id, livro_id, data_emprestimo, data_devolucao } =
    request.body;

  if (!cliente_id) {
    response.status(400).json({ message: "O id do cliente é obrigatório!" });
    return;
  }
  if (!livro_id) {
    response.status(400).json({ message: "O id do livro é obrigatório!" });
    return;
  }
  if (!data_emprestimo) {
    response
      .status(400)
      .json({ message: "a data de emprestimo é obrigatório!" });
    return;
  }
  if (!data_devolucao) {
    response
      .status(400)
      .json({ message: "a data de devolução é obrigatório!" });
    return;
  }
  const checkSql = /*sql*/ `SELECT * FROM emprestimos WHERE ?? = ?`;
  const checkInsertSql = ["emprestimo_id", emprestimo_id];
  conn.query(checkSql, checkInsertSql, (err, data) => {
    if (data.length > 0) {
      response.status(400).json({ msg: "emprestimo já existe" });
      return;
    }

    const sql = /*sql*/ `
      INSERT INTO emprestimos(??,??,??,??)
      VALUES(?,?,?,?)
      `;
    const insertData = [
      "cliente_id",
      "livro_id",
      "data_emprestimo",
      "data_devolucao",
      cliente_id,
      livro_id,
      data_emprestimo,
      data_devolucao,
    ];

    conn.query(sql, insertData, (err, data) => {
      if (err) {
        console.error(err);
        response.status(500).json({ msg: "Erro ao cadatrar emprestimo" });
        return;
      }
      response.status(201).json({ msg: "criado" });
    });
  });
};

export const buscarEmprestimo = (request, response) => {
  const { id } = request.params;

  const sql = /*sql*/ `SELECT * FROM emprestimos WHERE ?? = ?`;
  const insertData = ["emprestimo_id", id];

  conn.query(sql, insertData, (err, data) => {
    if (data.length === 0) {
      response.status(404).json({ msg: "emprestimo não existe" });
    }
    response.status(200).json(data);
  });
};

export const editarEmprestimo = (request, response) => {
  const { id } = request.params;

  const {
    emprestimo_id,
    cliente_id,
    livro_id,
    data_emprestimo,
    data_devolucao,
  } = request.body;

  if (!cliente_id) {
    response.status(400).json({ message: "O id do cliente é obrigatório!" });
    return;
  }
  if (!livro_id) {
    response.status(400).json({ message: "O id do livro é obrigatório!" });
    return;
  }
  if (!data_emprestimo) {
    response
      .status(400)
      .json({ message: "a data de emprestimo é obrigatório!" });
    return;
  }
  if (!data_devolucao) {
    response
      .status(400)
      .json({ message: "a data de devolução é obrigatório!" });
    return;
  }

  const checkSql = /*sql*/ `SELECT * FROM clientes WHERE id = "${id}"`;
  conn.query(checkSql, (err, data) => {
    if (err) {
      console.error(err);
      response.status(500).json({ msg: "Erro ao buscar emprestimo" });
      return;
    }
    if (data.length === 0) {
      return response.status(404).json({ msg: "emprestimo não encontrado" });
    }

    //Consulta SQL para atualizar livro
    const updateSql = /*sql*/ `
    UPDATE clientes 
    SET ?? = ?, ?? = ?, ?? = ?, ?? = ? 
    WHERE ?? = ?;
    `;
    const insertData = [
      "cliente_id",
      cliente_id,
      "livro_id",
      livro_id,
      "data_emprestimo",
      data_emprestimo,
      "data_devolucao",
      data_devolucao,
      "emprestimo_id",
      emprestimo_id,
    ];

    conn.query(updateSql, insertData, (err) => {
      if (err) {
        console.error(err);
        response.status(500).json({ msg: "Erro ao atualizar emprestimo" });
        return;
      }
      response.status(200).json({ msg: "emprestimo atualizado" });
    });
  });
};
