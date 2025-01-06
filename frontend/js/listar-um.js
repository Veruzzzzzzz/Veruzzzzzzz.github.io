// Função para buscar uma venda específica
async function buscarVenda() {
    const resultadoDiv = document.getElementById('resultadoBusca');
    const id = document.getElementById('vendaId').value;

    if (!id) {
        resultadoDiv.innerHTML = '<p class="error">Por favor, informe o ID da venda</p>';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/vendas/${id}`);
        const venda = await response.json();

        if (!response.ok) {
            throw new Error('Venda não encontrada');
        }

        resultadoDiv.innerHTML = `
            <div class="card">
                <h2>Detalhes da Venda #${venda.id_venda}</h2>
                <div class="venda-info">
                    <div class="info-group">
                        <label>Cliente:</label>
                        <span>${venda.Cliente?.nome || 'N/A'}</span>
                    </div>
                    <div class="info-group">
                        <label>Funcionário:</label>
                        <span>${venda.Funcionario?.nome || 'N/A'}</span>
                    </div>
                    <div class="info-group">
                        <label>Produto:</label>
                        <span>${venda.Produto?.nome || 'N/A'}</span>
                    </div>
                    <div class="info-group">
                        <label>Quantidade:</label>
                        <span>${venda.quantidade}</span>
                    </div>
                    <div class="info-group">
                        <label>Total:</label>
                        <span>R$ ${Number(venda.total).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;

        // Limpar o campo de busca após encontrar
        document.getElementById('vendaId').value = '';

    } catch (error) {
        console.error('Erro:', error);
        resultadoDiv.innerHTML = `
            <div class="error-message">
                <p>Venda não encontrada ou erro ao buscar dados.</p>
            </div>
        `;
    }
}

// Adicionar evento de tecla Enter para buscar
document.addEventListener('DOMContentLoaded', () => {
    const inputId = document.getElementById('vendaId');
    if (inputId) {
        inputId.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                buscarVenda();
            }
        });
    }
});