var express = require("express");
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const auth = 'dGVzdGU6MTIz';

var app = express();
app.listen(3000, () => {
 console.log("Servidor rodando na porta 3000");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var usuariosCadastrados = [];

function validateAuth(req, res) {

    if(!req.headers.authorization.includes(auth)) {
        res.json('Autenticacao invalida');
        return;
    }

}

app.get("/usuario", (req, res, next) => {
    validateAuth(req, res);
    //retorna todos os usuarios
    res.json(usuariosCadastrados);
});

app.get("/usuario/:cpf", (req, res, next) => {
    validateAuth(req, res);
    // retorna usuario pelo cpf
    const cpf = req.params.cpf;

    // procura o usuario com o cpf desejado
    for (let usuario of usuariosCadastrados) {
        if (usuario.cpf === cpf) {
            res.json(usuario);
            return;
        }
    }

    // retorna 404 se nao encontrado
    res.status(404).send('Usuario nao encontrado');
});

app.post("/usuario", [
    // validação dos dados
    body('cpf').isLength({ min: 11, max: 11 }).withMessage("Informe o CPF apenas com numeros, sem ponto ou traco"),
    body('nome').not().isEmpty().trim().escape().withMessage("Informe o nome completo")
  ],(req, res, next) => {
    validateAuth(req, res);
    // valida se esta ok
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // cadastra novo usuario
    usuariosCadastrados.push(req.body);
    res.json(req.body);
});

app.put('/usuario/:cpf', [
    // validação dos dados
    body('cpf').isLength({ min: 11, max: 11 }).withMessage("Informe o CPF apenas com numeros, sem ponto ou traco"),
    body('nome').not().isEmpty().trim().escape().withMessage("Informe o nome completo")
  ],(req, res, next) => {
    validateAuth(req, res);
    // valida se esta ok
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // atualiza pelo cpf
    const cpf = req.params.cpf;
    const novoUsuario = req.body;

    // localizar pelo cpf e atualizar
    for (let i = 0; i < usuariosCadastrados.length; i++) {
        let usuario = usuariosCadastrados[i]
        if (usuario.cpf === cpf) {
            usuariosCadastrados[i] = novoUsuario;
            res.send('Usuario atualizado');
            return;
        }
    }

    // retorna 404 se nao encontrado
    res.status(404).send('Usuario nao encontrado');
});

app.delete('/usuario/:cpf', (req, res) => {
    validateAuth(req, res);
    // excluir pelo cpf
    const cpf = req.params.cpf;

    // filtrar pelo cpf
    usuariosCadastrados = usuariosCadastrados.filter(i => {
        if (i.cpf !== cpf) {
            res.send('Usuario excluido');
            return true;
        }
        return false;
    });

    // retorna 404 se nao encontrado
    res.status(404).send('Usuario nao encontrado');
});