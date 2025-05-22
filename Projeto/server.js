const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/rotas');
const path = require('path')


const app = express();




app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST'],
    credentials: true
    
}));




app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes)

const PORT = 5000;
app.listen(PORT, ()=> console.log(`Servidor rodando na porta ${PORT}`))