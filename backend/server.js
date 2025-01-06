const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const bcrypt = require('bcrypt');
const Usuario = require('./models/Usuario');

const app = express();
const PORT = 3000;



// Configuração do CORS mais permissiva para desenvolvimento
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(bodyParser.json());

// Rotas
app.use('/api/clientes', require('./routes/clienteRoutes'));
app.use('/api/funcionarios', require('./routes/funcionarioRoutes'));
app.use('/api/produtos', require('./routes/produtoRoutes'));
app.use('/api/vendas', require('./routes/vendaRoutes'));




app.post('/api/usuarios/cadastro', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        // Validação do email
        if (!email.endsWith('@gmail.com')) {
            return res.status(400).json({ message: 'O email deve ser um Gmail' });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);
        
        await Usuario.create({
            nome,
            email,
            senha: senhaCriptografada
        });
        
        res.status(201).json({ message: 'Cadastrado com sucesso' });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: 'Email já cadastrado' });
        } else {
            res.status(500).json({ message: 'Erro ao cadastrar' });
        }
    }
});

app.post('/api/usuarios/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Validação do email
        if (!email.endsWith('@gmail.com')) {
            return res.status(400).json({ message: 'O email deve ser um Gmail' });
        }

        const usuario = await Usuario.findOne({ where: { email } });
        
        if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }
        
        res.json({ message: 'Login realizado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao fazer login' });
    }
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erro interno do servidor' });
});

// Sincronizar banco de dados e iniciar servidor
sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch(err => console.log('Erro ao sincronizar banco:', err)); 
    