const express = require('express');
const router = express.Router();
const Produto = require('../models/Produto');

// Cadastrar produto
router.post('/', async (req, res) => {
    try {
        const produto = await Produto.create(req.body);
        res.status(201).json(produto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Listar todos os produtos
router.get('/', async (req, res) => {
    try {
        const produtos = await Produto.findAll();
        res.json(produtos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Listar um produto
router.get('/:id', async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id);
        if (produto) {
            res.json(produto);
        } else {
            res.status(404).json({ message: 'Produto não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Editar produto
router.put('/:id', async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id);
        if (produto) {
            await produto.update(req.body);
            res.json(produto);
        } else {
            res.status(404).json({ message: 'Produto não encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Excluir produto
router.delete('/:id', async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id);
        if (produto) {
            await produto.destroy();
            res.json({ message: 'Produto excluído com sucesso' });
        } else {
            res.status(404).json({ message: 'Produto não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 