import { SimpleCrypto } from "simple-crypto-js"
import * as dotenv from 'dotenv'
dotenv.config()

const SECRET = process.env.SECRET

export default function rotasUsuarios(server, db, auth) {

    server.get('/usuarios', auth.middlewareAuth, (req, res) => {
        let lista = db.get("/usuarios")
        const listaSemSenhas = Object.values(lista).map(({ senha, ...rest }) => rest);
        res.status(200).json(lista)
    });
    
    server.post('/usuarios', (req, res) => { // Geralmente o POST de usuário não é protegido, é o registro
        let { email, senha } = req.body;
        if (!email || !senha) {
            return res.status(400).json({ msg: "Email e senha são obrigatórios." });
        }
        // Verificar se o email já existe
        const usuariosExistentes = db.get("/usuarios");
        for (let key in usuariosExistentes) {
            if (usuariosExistentes[key].email === email) {
                return res.status(409).json({ msg: "Email já cadastrado." });
            }
        }

        let id = db.newID("USER-")
        let data = { id, ...req.body }
        const simpleCrypto = new SimpleCrypto(SECRET)
        data.senha = simpleCrypto.encrypt(data.senha)
        db.set("/usuarios/"+data.id, data)
        res.status(201).json({ msg: "Inserção ok.", data: { id: data.id, email: data.email } }) // Retorne dados sem a senha
    });
    
    server.put('/usuarios/:id', auth.middlewareAuth, (req, res) => { // <--- Adicione o middleware
        let id = req.params.id;
        let elem = db.get("/usuarios/"+id);
        if(elem == null) {
            res.status(400).json({ msg: "Usuário não existe." })
            return
        }
        let data = { id, ...req.body }
        // Se a senha estiver sendo atualizada, criptografe-a
        if (data.senha) {
            const simpleCrypto = new SimpleCrypto(SECRET)
            data.senha = simpleCrypto.encrypt(data.senha)
        } else {
            // Se a senha não for fornecida no body, mantenha a senha existente
            data.senha = elem.senha;
        }
        db.set("/usuarios/"+data.id, data)
        res.status(201).json({ msg: "Alteração ok.", data: { id: data.id, email: data.email } }) // Retorne dados sem a senha
    });
    
    server.delete('/usuarios/:id', auth.middlewareAuth, (req, res) => { // <--- Adicione o middleware
        let id = req.params.id;
        let elem = db.get("/usuarios/"+id);
        if(elem == null) {
            res.status(400).json({ msg: "Usuario não existe." })
            return
        }
        db.set("/usuarios/"+id, null)
        res.status(201).json({ msg: "Exclusão ok." })
    });
    

}