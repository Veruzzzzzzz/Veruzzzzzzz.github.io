const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Usuario } = require('../models');

// Rota de teste para verificar se está funcionando
router.get('/teste', (req, res) => {
    res.json({ message: 'Rota de usuários funcionando!' });
});

// Rota para cadastro (agora na raiz)
router.post('/cadastro', async (req, res) => {
    console.log('Recebendo requisição de cadastro:', req.body);

    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ 
                message: 'Todos os campos são obrigatórios' 
            });
        }

        // Verifica se usuário já existe
        const usuarioExiste = await Usuario.findOne({ where: { email } });
        if (usuarioExiste) {
            return res.status(400).json({ 
                message: 'Email já cadastrado' 
            });
        }

        // Criptografa a senha
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        // Cria o usuário
        const novoUsuario = await Usuario.create({
            nome,
            email,
            senha: senhaCriptografada
        });

        res.status(201).json({ 
            message: 'Usuário cadastrado com sucesso',
            id: novoUsuario.id_usuario 
        });

    } catch (error) {
        console.error('Erro no cadastro:', error);
        res.status(500).json({ 
            message: 'Erro interno ao cadastrar usuário' 
        });
    }
});

// Rota para login
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Busca o usuário
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(401).json({ message: 'Email ou senha inválidos' });
        }

        // Verifica a senha
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ message: 'Email ou senha inválidos' });
        }

        res.json({ 
            message: 'Login realizado com sucesso',
            id: usuario.id_usuario,
            nome: usuario.nome
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao fazer login' });
    }
});

module.exports = router;