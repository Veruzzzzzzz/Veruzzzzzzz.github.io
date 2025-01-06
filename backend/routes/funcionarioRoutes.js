const express = require('express');
const router = express.Router();
const Funcionario = require('../models/Funcionario');

// Cadastrar funcionário
router.post('/', async (req, res) => {
    try {
        const funcionario = await Funcionario.create(req.body);
        res.status(201).json(funcionario);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Listar todos os funcionários
router.get('/', async (req, res) => {
    try {
        const funcionarios = await Funcionario.findAll();
        res.json(funcionarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Listar um funcionário
router.get('/:id', async (req, res) => {
    try {
        const funcionario = await Funcionario.findByPk(req.params.id);
        if (funcionario) {
            res.json(funcionario);
        } else {
            res.status(404).json({ message: 'Funcionário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Editar funcionário
router.put('/:id', async (req, res) => {
    try {
        const funcionario = await Funcionario.findByPk(req.params.id);
        if (funcionario) {
            await funcionario.update(req.body);
            res.json(funcionario);
        } else {
            res.status(404).json({ message: 'Funcionário não encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Excluir funcionário
router.delete('/:id', async (req, res) => {
    try {
        const funcionario = await Funcionario.findByPk(req.params.id);
        if (funcionario) {
            await funcionario.destroy();
            res.json({ message: 'Funcionário excluído com sucesso' });
        } else {
            res.status(404).json({ message: 'Funcionário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 