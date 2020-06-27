const jwt = require('jsonwebtoken');

async function verifyJWT(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token) return res.status(401).json({ auth: false, message: 'No token provided.'});
  // if (!token) res.redirect('/auth/login');

  jwt.verify(token, process.env.SECRET, (err, decoded) => {

    if (err) return res.status(401).json({ auth: false, message: 'Failed to authenticate token.'});
    // if (err) res.redirect('/auth/login');

    //Se tudo estiver ok, salvar dados na request para uso posterior em outros serviços
    req.userId = decoded.id;
    req.userName = decoded.name;
    req.userEmail = decoded.email;
    req.hostDomain = decoded.hd;

    //Se não for um email usp rejeitaremos
    if (req.hostDomain !== 'usp.br') res.redirect('/auth/failed');

    console.log(decoded);
    next();
  });  
}

async function verifySuperUser(req, res, next) {
  //Aqui chamamaos a função para verificar se é super usuário baseado no ID
  let isSuperUser = false; //Por enquanto

  if (isSuperUser) {
    next();
  } else {
    res.status(401).json({ auth: false, message: 'You are not a super user'});
  }
}

module.exports = {
  verifyJWT,
  verifySuperUser
}