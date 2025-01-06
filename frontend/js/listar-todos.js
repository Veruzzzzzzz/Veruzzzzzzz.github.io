// Função para listar todas as vendas
async function listarTodasVendas() {
    try {
        const response = await fetch('http://localhost:3000/api/vendas');
        
        if (!response.ok) {
            throw new Error('Erro ao buscar vendas');
        }

        const vendas = await response.json();
        let html = '';

        if (vendas.length === 0) {
            html = `<tr><td colspan="6">Nenhuma venda encontrada</td></tr>`;
        } else {
            html = vendas.map(venda => `
                <tr>
                    <td>${venda.id_venda}</td>
                    <td>${venda.Cliente?.nome || 'N/A'}</td>
                    <td>${venda.Funcionario?.nome || 'N/A'}</td>
                    <td>${venda.Produto?.nome || 'N/A'}</td>
                    <td>${venda.quantidade}</td>
                    <td>R$ ${Number(venda.total).toFixed(2)}</td>
                </tr>
            `).join('');
        }

        // Inserir diretamente na tabela
        const tabela = document.querySelector('table');
        if (tabela) {
            tabela.innerHTML = `
                <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Funcionário</th>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Total</th>
                </tr>
                ${html}
            `;
        }

    } catch (error) {
        console.error('Erro:', error);
        document.querySelector('table').innerHTML = `
            <tr>
                <td colspan="6">Erro ao carregar vendas. Tente novamente.</td>
            </tr>
        `;
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', listarTodasVendas); 