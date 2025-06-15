
export default function rotasFilmes(server, db, auth) {

    server.get('/filmes', auth.middlewareAuth, (req, res) => {
        let filmes = db.get("/filmes")
        res.status(200).json(filmes)
    });
    
    server.post('/filmes', auth.middlewareAuth, (req, res) => {
        let id = db.newID("FILME-")
        let data = { id, ...req.body }
        db.set("/filmes/"+data.id, data)
        res.status(201).json({ msg: "Inserção ok.", data })
    });
    
    server.put('/filmes/:id', auth.middlewareAuth, (req, res) => {
        let id = req.params.id;
        let filme = db.get("/filmes/"+id);
        if(filme == null) {
            res.status(400).json({ msg: "Filme não existe." })
            return
        }
        let data = { id, ...req.body }
        db.set("/filmes/"+data.id, data)
        res.status(201).json({ msg: "Alteração ok.", data })
    });
    
    server.delete('/filmes/:id', auth.middlewareAuth, (req, res) => {
        let id = req.params.id;
        let filme = db.get("/filmes/"+id);
        if(filme == null) {
            res.status(400).json({ msg: "Filme não existe." })
            return
        }
        db.set("/filmes/"+id, null)
        res.status(201).json({ msg: "Exclusão ok." })
    });
    

}