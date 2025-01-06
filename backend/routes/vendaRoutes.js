const express = require('express');
const router = express.Router();
const Venda = require('../models/Venda');
const Cliente = require('../models/Cliente');
const Funcionario = require('../models/Funcionario');
const Produto = require('../models/Produto');

// Cadastrar venda
router.post('/', async (req, res) => {
    try {
        // Verificar se cliente, funcionário e produto existem
        const cliente = await Cliente.findByPk(req.body.id_cliente);
        const funcionario = await Funcionario.findByPk(req.body.id_funcionario);
        const produto = await Produto.findByPk(req.body.id_produto);

        if (!cliente || !funcionario || !produto) {
            return res.status(404).json({ message: 'Cliente, funcionário ou produto não encontrado' });
        }

        // Verificar estoque
        if (produto.estoque < req.body.quantidade) {
            return res.status(400).json({ message: 'Quantidade insuficiente em estoque' });
        }

        // Criar venda
        const venda = await Venda.create(req.body);

        // Atualizar estoque
        await produto.update({
            estoque: produto.estoque - req.body.quantidade
        });

        res.status(201).json(venda);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Listar todas as vendas
router.get('/', async (req, res) => {
    try {
        const vendas = await Venda.findAll({
            include: [
                { model: Cliente },
                { model: Funcionario },
                { model: Produto }
            ]
        });
        res.json(vendas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Listar uma venda
router.get('/:id', async (req, res) => {
    try {
        const venda = await Venda.findByPk(req.params.id, {
            include: [
                { model: Cliente },
                { model: Funcionario },
                { model: Produto }
            ]
        });
        if (venda) {
            res.json(venda);
        } else {
            res.status(404).json({ message: 'Venda não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Editar venda
router.put('/:id', async (req, res) => {
    try {
        const venda = await Venda.findByPk(req.params.id);
        if (venda) {
            await venda.update(req.body);
            res.json(venda);
        } else {
            res.status(404).json({ message: 'Venda não encontrada' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Excluir venda
router.delete('/:id', async (req, res) => {
    try {
        const venda = await Venda.findByPk(req.params.id);
        if (venda) {
            // Restaurar estoque
            const produto = await Produto.findByPk(venda.id_produto);
            await produto.update({
                estoque: produto.estoque + venda.quantidade
            });

            await venda.destroy();
            res.json({ message: 'Venda excluída com sucesso' });
        } else {
            res.status(404).json({ message: 'Venda não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 