import conn from "../config/conn.js";
import { v4 as uuidv4 } from "uuid";

import getToken from "../helpers/get-token.js"; // extriando o tolem que eu coloquei la na autentificação das requisicoes http, pq eu vou adicioanr o objeto no tokem de um determinado usuario
import getUserByToken from "../helpers/get-user-by-token.js"; //pega o tokem extraindo e extrai dados dele como o id
import { request, response } from "express";

//CRIANDO UM OBJETO QUE VAI SER ADICIONADO EM UM TOKEM DE UM USUARIO EXPECIFICO, OU SEJA, TEM 3 OBJETOS ASSOCIADOS AO MESMO ID, POIS ESTA NO MESMO TOKEN
export const create = async (request, response) => {
  const { nome, peso, cor, descricao } = request.body;
  const disponivel = 1;

  //buscar o token do usuário cadastrado associando esse token a varaivel user 
  const token = getToken(request);
  const user = await getUserByToken(token);

  //validações para as coisas que podem ser atualizadas e devem estar na requisição
  if (!nome) {
    response.status(400).json({ message: "O nome do objeto é obrigatório" });
    return;
  }
  if (!peso) {
    response.status(400).json({ message: "O peso do objeto é obrigatório" });
    return;
  }
  if (!cor) {
    response.status(400).json({ message: "A cor do objeto é obrigatório" });
    return;
  }
  if (!descricao) {
    response.status(400).json({ message: "A descricao do objeto é obrigatório" });
    return;
  }

  const objeto_id = uuidv4();
  const usuario_id = user.usuario_id; //associa a variavel usuario_id ao id do usuario pelo token do usuario
  //adicionando so valores
  const insertSql = /*sql*/ `
  INSERT INTO objetos (??, ??, ??, ??, ??, ??, ??)VALUES(?, ?, ?, ?, ?, ?, ?)`;
  const insertData = [
    "objeto_id",
    "nome",
    "peso",
    "cor",
    "descricao",
    "disponivel",
    "usuario_id",
    objeto_id,
    nome,
    peso,
    cor,
    descricao,
    disponivel,
    usuario_id,
  ];
  conn.query(insertSql, insertData, (err, data) => {
    if (err) {
      console.error(err);
      response.status(500).json({ err: "Erro ao cadastrar objeto" });
      return;
    }
     // Verifica se há arquivos (imagens) enviados na requisição para o objeto.
    if (request.files) {
      // Se houver arquivos, prepara a query para inserir os caminhos das imagens na tabela `objeto_images`.
      const insertImageSql = /*sql*/ `INSERT INTO objeto_images
        (image_id, objeto_id, image_path) VALUES ?`;
      const imageValues = request.files.map((file) => [
        uuidv4(),
        objeto_id,
        file.filename,
      ]);
      // Mapeia os arquivos para gerar um array de valores que será inserido na tabela de imagens.
      conn.query(insertImageSql, [imageValues], (err) => {
        if (err) {
          console.error(err);
          response.status(500).json({ err: "Erro ao salvar imagens do objeto" });
          return;
        }
        response.status(201).json({ message: "Objeto cadastrado com sucesso!" });
      });
    } else {
      response.status(201).json({ message: "Objeto cadastrado com sucesso!" });
    }
  });
};

//MOSTRAR TODOS OS OBJETOS
export const getAllObjectUser = async (request, response) => {
  try {
    const token = getToken(request); //extrei o token
    const user = await getUserByToken(token); //pega o id do objeto pelo token

    const usuarioId = user.usuario_id;
    //selecionando todos os campos da tabela que seram mostrados
    //como vai ser inserida uma imagem, mas ela vai estar em outra tabela, usamos o GROUP_CONCAT para pegar a imamgem da tabela que ela esteja e adicionar no select
    //LEFT JOIN serve para juntas os relacionamentos de tabelas onde os valores dos ids vao ser iguais
    //isso so vai acontenver se a codição do where for atendida, onde a ? é o "usuarioId"
    //o GROUP BY, vai juntar tudo que é igual em relação ao id em uma unica linha
    const selectSql = /*sql*/ `
    SELECT
    obj.objeto_id,
    obj.usuario_id,
    obj.nome,
    obj.peso,
    obj.cor,
    obj.descricao,
    GROUP_CONCAT(obj_img.image_path SEPARATOR',') AS image_path
    FROM 
      objetos AS obj  
    LEFT JOIN 
      objeto_images AS obj_img ON obj.objeto_id = obj_img.objeto_id
    WHERE 
      obj.usuario_id = ?
    GROUP BY
      obj.objeto_id, obj.usuario_id, obj.nome, obj.peso, obj.cor, obj.descricao`;
    
    conn.query(selectSql, [usuarioId], (err, data) => {
      if (err) {
        console.error(err);
        response.status(500).json({ err: "Erro ao buscar objeto" });
        return;
      }

      const objetosUsuario = data.map((objeto) => ({
        //junta tudo certinho ppara da cmo resposta
        objeto_id: objeto.objeto_id,
        usuario_id: objeto.usuario_id,
        nome: objeto.nome,
        peso: objeto.peso,
        cor: objeto.cor,
        descricao: objeto.descricao,
        image_paths: objeto.image_path ? objeto.image_path.split(",") : [],  // Verificação de null
      }));
      
      //chama aqui
      response.status(200).json(objetosUsuario);
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ err: "Erro ao processar a requisição" });
  }
};

//PEGAR SOMENTE UM OBJETO PELO ID
export const getObjBtId = (request, response) => {
  const { id } = request.params;

  const checkSql = /*sql*/ `
  SELECT nome, peso,cor,descricao,objeto_id,disponivel,usuario_id FROM objetos WHERE ?? = ?`;

  const checkData = ["objeto_id", id]
  conn.query(checkSql, checkData, (err, data) => {
    if(err){
      console.error(err)
      response.status(500).json({err: "Erro ao buscar objeto"})
      return
    }
    if(data.length === 0){
      response.status(400).json({err: "Objeto não encontrado"})
      return
    }

    const objeto = data[0]
    response.status(200).json(objeto)
  })
}