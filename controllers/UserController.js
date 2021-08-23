const { findEmail } = require("../models/User");
var User = require("../models/User");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

var secret = "secret";

class UserController{
    async index(req, res){
        var users = await User.findAll();
        res.status(200);
        res.json(users);
    }

    async findUser(req,res){
        var id = req.params.id;
        var user = await User.findById(id);
        if(user == undefined){
            res.status(404);
            res.json({});            
        }else{
            res.status(200);
            res.json(user);
        }
        
    }
    
    async create(req,res){
        var {email, name, password} = req.body;

        if(email == undefined){
            res.status(400);
            res.json({err: "o e-mail é inválido!"})
            return;
        }
        var emailExists = await User.findEmail(email);

        if(emailExists){
            res.status(406);
            res.json({err: "O email já está cadastrado!"});
            return;
        }

        await User.new(email, password, name);

        res.status=(200);
        res.send("Usuário criado com sucesso!");
    }

    async edit (req,res){
        var {id, name, role, email} = req.body;
        var result = await User.update(id,email,name,role);
        if(result != undefined){
            if(result.status){
                res.status(200);
                res.send('tudo ok!');
            }else{
                res.status(406);
                res.send(result.err);
            }
        }else{
            res.status(406);
            res.send("ocorreu um erro no servidor");
        }
    }

    async remove (req, res){
        var id = req.params.id;

        var result = await User.delete(id);
        if(result.status){
            res.status(200);
            res.send("Deletado com sucesso!")
        }else{
            res.status(406);
            res.send(result.err);
        }
    }

    async login(req,res){
        var {email, password} = req.body;

        var user = await User.findByEmail(email);

        if(user != undefined){

            var resultado = await bcrypt.compare(password, user.password);
            if(resultado){
                var token = jwt.sign({email: user.email, role: user.role}, secret);
                res.status(200);
                res.json({user: user.name, token: token});
            }else{
                res.status(406);
                res.send("senha incorreta");
            }

        }else{
            res.json({status: false});
        }
    }

}

module.exports = new UserController();