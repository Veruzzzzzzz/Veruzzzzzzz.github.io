// Função para formatar valores monetários
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Função para buscar dados dos funcionários
async function listarFuncionarios() {
    try {
        // Buscar funcionários
        const resFuncionarios = await fetch('http://localhost:3000/api/funcionarios');
        const funcionarios = await resFuncionarios.json();

        // Buscar todas as vendas
        const resVendas = await fetch('http://localhost:3000/api/vendas');
        const vendas = await resVendas.json();

        // Calcular estatísticas de vendas por funcionário
        const estatisticasVendas = vendas.reduce((acc, venda) => {
            const idFuncionario = venda.id_funcionario;
            
            if (!acc[idFuncionario]) {
                acc[idFuncionario] = {
                    totalVendas: 0,
                    valorTotal: 0
                };
            }

            acc[idFuncionario].totalVendas++;
            acc[idFuncionario].valorTotal += Number(venda.total);
            
            return acc;
        }, {});

        // Gerar linhas da tabela
        const tbody = document.querySelector('#tabelaFuncionarios tbody');
        tbody.innerHTML = funcionarios.map(funcionario => {
            const stats = estatisticasVendas[funcionario.id_funcionario] || {
                totalVendas: 0,
                valorTotal: 0
            };

            const isVendedor = funcionario.cargo.toLowerCase().includes('vendedor');

            return `
                <tr>
                    <td>${funcionario.nome}</td>
                    <td>${funcionario.cargo}</td>
                    <td>${formatarMoeda(Number(funcionario.salario))}</td>
                    <td>${isVendedor ? stats.totalVendas : '-'}</td>
                    <td>${isVendedor ? formatarMoeda(stats.valorTotal) : '-'}</td>
                </tr>
            `;
        }).join('');

    } catch (error) {
        console.error('Erro ao carregar funcionários:', error);
        document.querySelector('#tabelaFuncionarios tbody').innerHTML = `
            <tr>
                <td colspan="5" class="error">
                    Erro ao carregar dados. Por favor, tente novamente.
                </td>
            </tr>
        `;
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    listarFuncionarios();
}); 