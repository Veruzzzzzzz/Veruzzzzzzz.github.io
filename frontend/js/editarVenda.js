const API_URL = 'http://localhost:3000/api';

function buscarVendaParaEditar() {
    const id = document.querySelector('input').value;
    
    if (!id) {
        alert('Por favor, digite um ID');
        return;
    }

    fetch(`${API_URL}/vendas/${id}`)
        .then(res => res.json())
        .then(async venda => {
            if (!venda) throw new Error('Venda não encontrada');
            
            const [clientes, funcionarios, produtos] = await Promise.all([
                fetch(`${API_URL}/clientes`).then(r => r.json()),
                fetch(`${API_URL}/funcionarios`).then(r => r.json()),
                fetch(`${API_URL}/produtos`).then(r => r.json())
            ]);
            
            const resultado = document.querySelector('.venda-encontrada');
            resultado.innerHTML = `
                <div class="form-edicao">
                    <h2>Editar Venda</h2>
                    <form id="formEdicao">
                        <input type="hidden" id="id_venda" value="${venda.id_venda}">
                        
                        <div class="form-group">
                            <label for="cliente">Cliente:</label>
                            <select id="cliente" required>
                                ${clientes.map(c => `
                                    <option value="${c.id_cliente}" ${c.id_cliente === venda.id_cliente ? 'selected' : ''}>
                                        ${c.nome}
                                    </option>
                                `).join('')}
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="funcionario">Funcionário:</label>
                            <select id="funcionario" required>
                                ${funcionarios.map(f => `
                                    <option value="${f.id_funcionario}" ${f.id_funcionario === venda.id_funcionario ? 'selected' : ''}>
                                        ${f.nome}
                                    </option>
                                `).join('')}
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="produto">Produto:</label>
                            <select id="produto" required>
                                ${produtos.map(p => `
                                    <option value="${p.id_produto}" ${p.id_produto === venda.id_produto ? 'selected' : ''}>
                                        ${p.nome}
                                    </option>
                                `).join('')}
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="quantidade">Quantidade:</label>
                            <input type="number" id="quantidade" value="${venda.quantidade}" required>
                        </div>

                        <div class="form-group">
                            <label for="total">Total:</label>
                            <input type="number" step="0.01" id="total" value="${venda.total}" required>
                        </div>

                        <div class="buttons">
                            <button type="button" class="btn-primary" onclick="salvarEdicao()">Salvar</button>
                            <button type="button" class="btn-secondary" onclick="limparFormulario()">Cancelar</button>
                        </div>
                    </form>
                </div>
            `;
        })
        .catch(erro => {
            document.querySelector('.venda-encontrada').innerHTML = '<p>Venda não encontrada</p>';
            console.error('Erro:', erro);
        });
}

function salvarEdicao() {
    const venda = {
        id_venda: document.getElementById('id_venda').value,
        id_cliente: document.getElementById('cliente').value,
        id_funcionario: document.getElementById('funcionario').value,
        id_produto: document.getElementById('produto').value,
        quantidade: document.getElementById('quantidade').value,
        total: document.getElementById('total').value
    };

    fetch(`${API_URL}/vendas/${venda.id_venda}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(venda)
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro ao atualizar');
        alert('Venda atualizada com sucesso!');
        limparFormulario();
    })
    .catch(erro => {
        console.error('Erro:', erro);
        alert('Erro ao atualizar venda');
    });
}

function limparFormulario() {
    document.getElementById('id_venda').value = '';
    document.querySelector('.venda-encontrada').innerHTML = '';
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    const btnBuscar = document.querySelector('button');
    if (btnBuscar) {
        btnBuscar.onclick = buscarVendaParaEditar;
    }
}); 