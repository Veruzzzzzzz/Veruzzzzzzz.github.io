const API_URL = 'http://localhost:3000/api';

function buscarVendaParaExcluir() {
    const id = document.querySelector('input').value;
    
    if (!id) {
        alert('Por favor, digite um ID');
        return;
    }

    fetch(`${API_URL}/vendas/${id}`)
        .then(res => res.json())
        .then(venda => {
            if (!venda) throw new Error('Venda não encontrada');
            
            const resultado = document.querySelector('.venda-encontrada');
            resultado.innerHTML = `
                <div class="resultado-venda">
                    <h2>Venda Encontrada:</h2>
                    <p>ID: ${venda.id_venda}</p>
                    <p>Cliente: ${venda.Cliente?.nome || 'N/A'}</p>
                    <p>Funcionário: ${venda.Funcionario?.nome || 'N/A'}</p>
                    <p>Produto: ${venda.Produto?.nome || 'N/A'}</p>
                    <p>Quantidade: ${venda.quantidade}</p>
                    <p>Total: R$ ${Number(venda.total).toFixed(2)}</p>
                    
                    <div class="buttons">
                        <button class="btn-primary" onclick="confirmarExclusao(${venda.id_venda})">Excluir</button>
                        <button class="btn-secondary" onclick="limparFormulario()">Cancelar</button>
                    </div>
                </div>
            `;
        })
        .catch(erro => {
            document.querySelector('.venda-encontrada').innerHTML = '<p>Venda não encontrada</p>';
            console.error('Erro:', erro);
        });
}

function confirmarExclusao(id) {
    if (!confirm('Tem certeza que deseja excluir esta venda?')) return;

    fetch(`${API_URL}/vendas/${id}`, { 
        method: 'DELETE' 
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro ao excluir');
        alert('Venda excluída com sucesso!');
        limparFormulario();
    })
    .catch(erro => {
        console.error('Erro:', erro);
        alert('Erro ao excluir venda');
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
        btnBuscar.onclick = buscarVendaParaExcluir;
    }
}); 