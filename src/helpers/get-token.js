//Essa função serve para pegar o valor do token que esta no cabeçalho da requisiçõa
//Na parte que vc coloca o token no postman, é dai que ele pega o token do usuario

const getToken = (request) => {
  //pega o valor do cabeçalho da requisição, que é o token
  const authHeader = request.headers.authorization;
  //Pegando o valor do cabeçalho da requição, e dividindo em 2 parte e colocando dentro de um array(metodo split)
  //em sequida eu pego o valor numero 1 do aray, que é o token em si
  const token = authHeader.split(" ")[1];

  return token;
};

export default getToken;
