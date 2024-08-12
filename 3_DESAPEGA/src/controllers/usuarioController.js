import conn from "../config/conn.js"; //Importando a conexeção com o banco de dados
import { v4 as uuidv4 } from "uuid"; //Gera Ids unicos para cada ususarios
import jwt from "jsonwebtoken"; // Importando a biblioteca que permite a manipulação de tokens
import bcrypt from "bcrypt"; //Vai criptografar senhas, para assim enviar senhas criptografadas para o banco de dados
("");
//Helpers -> Função que usamos com ferquencia
import createUserToken from "../helpers/create-user-token.js"; //Função que vai criar os tokens
import getUserByToken from "../helpers/get-user-by-token.js"; // Vai obter usuario pelo token
import getToken from "../helpers/get-token.js"; // vai extrar o token da requisição

//CRIAR USUARIO
export const register = (request, response) => {
  const { nome, email, telefone, senha, confirmsenha } = request.body; //Extraindo dados do corpo da requisição

  // Consuta no banco de dados para saber se o email que quer ser cadastrado ja existe no banco de dados, as ?? indicam o email no banco de dados, e a ? indica o email no corpo da requisição
  const checkEmailSQL = /*sql*/ `SELECT * FROm usuarios WHERE ?? = ?`;
  const checkEmailData = ["email", email];

  //O conn é o que devemos utilizar caso for preciso fazer uma consulta no banco de dados
  conn.query(checkEmailSQL, checkEmailData, async (err, data) => {
    //se der um erro de logica ou sitaxe
    if (err) {
      console.log(err);
      response.status(500).json({ err: "Não foi possível buscar usuario" });
      return;
    }
    //não deu erro, mas retornou um array maior que 0, indicando que esse email ja esta em uso
    if (data.length > 0) {
      response.status(409).json({ err: "E-mail já está em uso!" });
      return;
    }
    //Passou pelo if, o que indica que o usuario pode ser registrado
    //Pega a senha que foi digitada e passa uma criptografia nela para ser enviar para o banco de dados
    const salt = await bcrypt.genSalt(12);
    const senhaHash = await bcrypt.hash(senha, salt);

    // gera um id para o usurio e uma imagem padrao(ver como faz para a imamgem nao ser algo padrao)
    const id = uuidv4();
    const imagem = "userDefault.png";

    //insere os valores no banco de dados referentes as colunas do banco de dados
    const insertSql = /*sql*/ `INSERT INTO usuarios
    (??, ??, ??, ??, ??, ??) Values (?, ?, ?, ?, ?, ?)`;

    const insertData = [
      "usuario_id",
      "nome",
      "email",
      "telefone",
      "senha",
      "imagem",
      id,
      nome,
      email,
      telefone,
      senhaHash,
      imagem,
    ];
    //Semore que for mexer com o bannco de dados, usar o conn, aqui estamos usuando para caso de um erro ao adiconar no bando de dados
    conn.query(insertSql, insertData, (err) => {
      if (err) {
        console.error(err);
        response.status(500).json({ err: "Erro ao cadastrar usuário" });
        return;
      }

      //Busca o usuasrio recem cadastrado e gera um tokem so dele
      const usuarioSql = /*sql*/ `SELECT * FROM usuarios WHERE ?? = ?`;
      const usuarioData = ["usuario_id", id];

      conn.query(usuarioSql, usuarioData, async (err, data) => {
        if (err) {
          console.error(err);
          response.status(500).json({ err: "Erro ao selecionar usuario" });
          return;
        }
        const usuario = data[0];
        try {
          //gerando um tokem para o usuario
          await createUserToken(usuario, request, response);
        } catch (error) {
          console.error(err);
        }
      });
      //Usuario esteja logado na aplicacao
      //createUserToken()
      //response.status(200).json({ message: "Usuário cadastrado" });
    });
  });
};

//Logar usuário
export const login = (request, response) => {
  const { email, senha } = request.body;

  //validações
  if (!email) {
    response.status(400).json({ err: "O email é obrigatório" });
  }

  if (!senha) {
    response.status(400).json({ err: "A senha é obrigatória" });
  }

  const checkSql = /*sql*/ `SELECT * FROM usuarios WHERE ?? = ?`;
  const checkData = ["email", email];
  conn.query(checkSql, checkData, async (err, data) => {
    //um if de erro para caso ocorra algum erro ao buscar o usuario
    if (err) {
      console.log(err);
      response.status(500).json({ err: "Erro ao buscar usuário" });
      return;
    }
    if (data.length === 0) {
      //if de erro para caso ocorra tudo bem, mas ao procurar o usuario no banco de dados, ele não foi encontrado( data === 0)
      response.status(404).json({ err: "Usuário não encontrado" });
      return;
    }

    //Retornou um array maior que zero so com unm unico valor. por isso [0], pois nao pode ter email iguais
    const usuario = data[0];

    //vai estar comparando a senha fornecida na requisição com a senha que esta no bando de dados, com isso o bibliorteca bcrypt tem a funcao compare, para meio que descriptografar a senha do banco de dados, para assim ser feita acomparacao
    const compararSenha = await bcrypt.compare(senha, usuario.senha);
    // console.log("senha do usuario", senha);
    // console.log("senha do objeto", usuario.senha);
    // console.log("comparar senha", compararSenha);

    //se as senhas forem diferentes imprime um erro
    if (!compararSenha) {
      return response.status(401).json({ message: "Senha inválida" });
    }
    try {
      //QUANDO eu adiciono o usuario ele ja esta logado, quando eu faço o login eu criou outro tokem pro usuario, o tokem nao vai pro banco de dados
      await createUserToken(usuario, request, response);
    } catch (error) {
      console.error(error);
      response.status(500).json({ err: "Erro ao processar informação" });
    }
  });
};

// Função para verificar o usuário logado
export const checkUser = (request, response) => {
  let usuarioAtual;

  // Verifica se o token está presente nos cabeçalhos
  if (request.headers.authorization) {
    const token = getToken(request); 
    // Extrai o token do cabeçalho
    const decoded = jwt.decode(token, "SENHASUPERSEGURAEDIFICIL"); 
    // Decodifica o token

    // Busca o usuário no banco de dados pelo ID decodificado
    const checkSql = /*sql*/ `SELECT * FROM usuarios WHERE ?? = ?`;
    const checkData = ["usuario_id", usuarioId];
    conn.query(checkSql, checkData, (err, data) => {
      if (err) {
        console.error(err);
        response.status(500).json({ err: "Erro ao verificar usuário" });
        return;
      }

      usuarioAtual = data[0];
      response.status(200).json(usuarioAtual); 
      // Retorna os dados do usuário
    });
  } else {
    // Se não houver token, pode-se definir uma resposta alternativa aqui
  }
};

//OBTEM UM USUARIO PELO ID
export const getUserById = (request, response) => {
  const { id } = request.params; //pega o id do corpo da requisiçãoo

  //fazendo u a consulta no banco de dados para pegar o valor do id criptogafado
  const checkSql = /*sql*/ `
    SELECT usuario_id, nome, email, telefone, imagem FROM usuarios
    WHERE ?? = ?
  `;
  //consulta para saber se o usuario_id do banco de dados é o mesmo do colocando na requisição pelo id
  const checkData = ["usuario_id", id];
  conn.query(checkSql, checkData, (err, data) => {
    if (err) {
      console.error(err);
      response.status(500).json({ err: "Erro ao buscar usuário" });
      return;
    }
    //caso retorno 0, quer dizer que o usuario nao existe 
    if (data.length === 0) {
      response.status(400).json({ err: "usuário não encontrado" });
      return;
    }

    //encontrou o usuario, vai pegar o seu primerio valor e unico, por isso o 0
    const usuario = data[0];
    response.status(200).json(usuario); //mostra o usuario encontrado
  });
};

//EDITAR O USUARIO
export const editUser = async (request, response) => {
  const { id } = request.params;
  // Extrai o ID dos parâmetros da requisição

  //Verifica se o usuario está logado
  try {
    // buscar dados no banco, nova consulta ao banco
    const token = getToken(request);
    const user = await getUserByToken(token);

    const { nome, email, telefone } = request.body;

    //Adicionar imagem ao objeto
    let imagem = user.imagem;
    if (request.file) {
      imagem = request.file.filename;
    }
    // Verificações de campos obrigatórios
    if (!nome) {
      response.status(400).json({ message: "O nome é obrigatório" });
      return;
    }
    if (!email) {
      response.status(400).json({ message: "O email é obrigatório" });
      return;
    }
    if (!telefone) {
      response.status(400).json({ message: "O telefone é obrigatório" });
      return;
    }

    // Verifica se o usuário existe no banco de dados
    const checkSql = /*sql*/ `SELECT * FROM usuarios WHERE ?? = ?`;
    const checkData = ["usuario_id", id];
    conn.query(checkSql, checkData, (err, data) => {
      if (err) {
        response.status(500).json({ err: "Erro ao buscar usuário" });
        return;
      }
      if (data.length === 0) {
        response.status(404).json({ err: "Usuário não encontrado" });
        return;
      }

      // Verifica se o email já está em uso por outro usuário
      const checkEmailSql = /*sql*/ `SELECT * FROM usuarios WHERE ?? = ? AND ?? != ?`;
      const checkEmailData = ["email", email, "usuario_id", id];
      conn.query(checkEmailSql, checkEmailData, (err, data) => {
        if (err) {
          response.status(500).json({ err: "Erro ao buscar email" });
          return;
        }

        if (data.length > 0) {
          response.status(404).json({ err: "email já existente" });
          return;
        }
        
        //autualizando os valores que estao em set
        const updateSql = /*sql*/ `UPDATE usuarios SET ? WHERE ?? = ?`;
        const updateData = [
          { nome, email, telefone, imagem },
          "usuario_id",
          id,
        ];
        conn.query(updateSql, updateData, (err) => {
          if (err) {
            console.error(err);
            response.status(500).json({ err: "Erro ao atualizar usuario" });
            return;
          }
          response.status(200).json({ message: "Usuário atualizado" });
        });
      });
    });
  } catch (error) {
    console.error(error)
    response.status(error.status || 500).json({message: error.message || "Erro interno no servidor"});
  }
};
