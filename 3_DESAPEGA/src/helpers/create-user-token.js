//Função responsavel para criar ostoken dos usuarios

import jwt from "jsonwebtoken";

//função assincrona para a criação do token
const createUserToken = async (usuario, request, response) => {
  //criar token do usuario, onde no token vai ter o nome e o id do usuario
  //o jwt.sing cria o token
  const token = jwt.sign(
    {
      nome: usuario.nome,
      id: usuario.usuario_id,
    },
    //Chave que vai autentificar o token
    "SENHASUPERSEGURAEDIFICIL" //senha
  );
  //Retornar o token
  response.status(200).json({
    message: "Você está logado!",
    token: token,
    usuarioId: usuario.usuario_id,
  });
};

export default createUserToken;
