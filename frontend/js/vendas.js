const API_URL = 'http://localhost:3000/api';

// FUNÇÕES DE VENDAS

// 1. Registrar Venda
async function registrarVenda(event) {
    event.preventDefault();
    
    try {
        // Pegar só o nome do cliente (sem o preço)
        const selectCliente = document.getElementById('id_cliente');
        const nomeClienteCompleto = selectCliente.options[selectCliente.selectedIndex].text;
        // Pega só o nome antes do hífen e remove espaços extras
        const nomeCliente = nomeClienteCompleto.split('-')[0].trim();
        
        const venda = {
            id_cliente: Number(selectCliente.value),
            id_funcionario: Number(document.getElementById('id_funcionario').value),
            id_produto: Number(document.getElementById('id_produto').value),
            quantidade: Number(document.getElementById('quantidade').value),
            total: Number(document.getElementById('total').value),
            nome: nomeCliente
        };

        console.log('Dados da venda:', venda);

        const response = await fetch('http://localhost:3000/api/vendas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(venda)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao registrar venda');
        }

        alert('Venda registrada com sucesso!');
        
        // Limpar todos os campos após o registro
        document.getElementById('id_cliente').value = '';
        document.getElementById('id_funcionario').value = '';
        document.getElementById('id_produto').value = '';
        document.getElementById('quantidade').value = '';
        document.getElementById('total').value = '';

    } catch (error) {
        console.error('Erro detalhado:', error);
        alert(error.message);
    }
}

// 2. Listar Uma Venda
async function buscarVenda() {
    const id = document.getElementById('idBusca').value;
    const resultadoDiv = document.getElementById('resultado');

    try {
        const response = await fetch(`http://localhost:3000/api/vendas/${id}`);
        const venda = await response.json();

        if (!response.ok) throw new Error('Venda não encontrada');

        resultadoDiv.innerHTML = `
            <div class="card">
                <h3>Venda #${venda.id_venda}</h3>
                <p>Cliente: ${venda.Cliente?.nome || 'N/A'}</p>
                <p>Funcionário: ${venda.Funcionario?.nome || 'N/A'}</p>
                <p>Produto: ${venda.Produto?.nome || 'N/A'}</p>
                <p>Quantidade: ${venda.quantidade}</p>
                <p>Total: R$ ${venda.total.toFixed(2)}</p>
            </div>
        `;
    } catch (error) {
        resultadoDiv.innerHTML = '<p class="erro">Venda não encontrada</p>';
    }
}

// 3. Listar Todas as Vendas
async function listarVendas() {
    const tabelaVendas = document.getElementById('tabelaVendas');
    
    try {
        const response = await fetch('http://localhost:3000/api/vendas');
        const vendas = await response.json();

        const rows = vendas.map(venda => `
            <tr>
                <td>${venda.id_venda}</td>
                <td>${venda.Cliente?.nome || 'N/A'}</td>
                <td>${venda.Funcionario?.nome || 'N/A'}</td>
                <td>${venda.Produto?.nome || 'N/A'}</td>
                <td>${venda.quantidade}</td>
                <td>R$ ${venda.total.toFixed(2)}</td>
            </tr>
        `).join('');

        tabelaVendas.innerHTML = rows;
    } catch (error) {
        console.error('Erro:', error);
        tabelaVendas.innerHTML = '<tr><td colspan="6">Erro ao carregar vendas</td></tr>';
    }
}

// 4. Carregar Dados do Formulário
async function carregarDadosFormulario() {
    try {
        // Carregar Clientes
        const resClientes = await fetch('http://localhost:3000/api/clientes');
        const clientes = await resClientes.json();
        const selectCliente = document.getElementById('id_cliente');
        selectCliente.innerHTML = `
            <option value="">Selecione um cliente</option>
            ${clientes.map(c => `<option value="${c.id_cliente}">${c.nome}</option>`).join('')}
        `;

        // Carregar Funcionários
        const resFuncionarios = await fetch('http://localhost:3000/api/funcionarios');
        const funcionarios = await resFuncionarios.json();
        const selectFuncionario = document.getElementById('id_funcionario');
        selectFuncionario.innerHTML = `
            <option value="">Selecione um funcionário</option>
            ${funcionarios.map(f => `<option value="${f.id_funcionario}">${f.nome}</option>`).join('')}
        `;

        // Carregar Produtos
        const resProdutos = await fetch('http://localhost:3000/api/produtos');
        const produtos = await resProdutos.json();
        const selectProduto = document.getElementById('id_produto');
        selectProduto.innerHTML = `
            <option value="">Selecione um produto</option>
            ${produtos.map(p => `<option value="${p.id_produto}" data-preco="${p.preco}">${p.nome} - R$ ${p.preco}</option>`).join('')}
        `;

        // Limpar campos
        document.getElementById('quantidade').value = '';
        document.getElementById('total').value = '';

    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Erro ao carregar dados do formulário');
    }
}

// 5. Calcular Total
function calcularTotal() {
    const selectProduto = document.getElementById('id_produto');
    const quantidade = document.getElementById('quantidade').value;
    const inputTotal = document.getElementById('total');
    
    if (selectProduto.selectedIndex > 0 && quantidade) {
        const produtoSelecionado = selectProduto.options[selectProduto.selectedIndex];
        const preco = Number(produtoSelecionado.dataset.preco);
        inputTotal.value = (preco * quantidade).toFixed(2);
    } else {
        inputTotal.value = '';
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Carregar dados do formulário se estiver na página de registro
    if (document.getElementById('id_cliente')) {
        carregarDadosFormulario();
        
        // Adicionar evento para cálculo automático do total
        document.getElementById('quantidade').addEventListener('input', calcularTotal);
        document.getElementById('id_produto').addEventListener('change', calcularTotal);
        
        // Adicionar evento de submit no formulário
        const btnRegistrar = document.querySelector('button');
        if (btnRegistrar) {
            btnRegistrar.onclick = registrarVenda;
        }
    }

    // Para busca de venda
    const btnBuscar = document.querySelector('button');
    if (btnBuscar && btnBuscar.textContent.includes('Buscar')) {
        btnBuscar.onclick = buscarVenda;
    }

    // Para listagem de vendas
    const tabelaVendas = document.getElementById('tabelaVendas');
    if (tabelaVendas) {
        listarVendas();
    }
});
