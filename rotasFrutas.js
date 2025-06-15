
export default function rotasFrutas(server, db, auth) {

    server.get('/frutas', auth.middlewareAuth, (req, res) => {
        let frutas = db.get("/frutas")
        res.status(200).json(frutas)
    });
    
    server.post('/frutas', auth.middlewareAuth, (req, res) => {
        let id = db.newID("FRUTA-")
        let data = { id, ...req.body }
        db.set("/frutas/"+data.id, data)
        res.status(201).json({ msg: "Inserção ok.", data })
    });
    
    server.put('/frutas/:id', auth.middlewareAuth, (req, res) => {
        let id = req.params.id;
        let fruta = db.get("/frutas/"+id);
        if(fruta == null) {
            res.status(400).json({ msg: "Fruta não existe." })
            return
        }
        let data = { id, ...req.body }
        db.set("/frutas/"+data.id, data)
        res.status(201).json({ msg: "Alteração ok.", data })
    });
    
    server.delete('/frutas/:id', auth.middlewareAuth, (req, res) => {
        let id = req.params.id;
        let fruta = db.get("/frutas/"+id);
        if(fruta == null) {
            res.status(400).json({ msg: "Fruta não existe." })
            return
        }
        db.set("/frutas/"+id, null)
        res.status(201).json({ msg: "Exclusão ok." })
    });
    

}