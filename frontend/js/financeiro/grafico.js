async function carregarGrafico() {
    try {
        const response = await fetch('http://localhost:3000/api/vendas');
        const vendas = await response.json();

        const dadosPorMes = vendas.reduce((acc, venda) => {
            const data = new Date(venda.createdAt);
            const mes = data.toLocaleString('pt-BR', { month: 'long' });
            
            if (!acc[mes]) {
                acc[mes] = {
                    totalVendas: 0,
                    valorTotal: 0
                };
            }
            
            acc[mes].totalVendas++;
            acc[mes].valorTotal += Number(venda.total);
            
            return acc;
        }, {});

        const meses = Object.keys(dadosPorMes);
        const totalVendas = meses.map(mes => dadosPorMes[mes].totalVendas);
        const valoresVendas = meses.map(mes => dadosPorMes[mes].valorTotal);

        const maxVendas = Math.max(...totalVendas);
        const maxValor = Math.max(...valoresVendas);

        const ctx = document.getElementById('graficoVendas').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: meses,
                datasets: [
                    {
                        label: 'Total de Vendas',
                        data: totalVendas,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        yAxisID: 'y',
                        barPercentage: 0.4,  // Largura da barra
                        categoryPercentage: 0.5  // Espaçamento entre grupos
                    },
                    {
                        label: 'Valor Total (R$)',
                        data: valoresVendas,
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        yAxisID: 'y1',
                        barPercentage: 0.4,  // Largura da barra
                        categoryPercentage: 0.5  // Espaçamento entre grupos
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    x: {
                        stacked: false  // Garante que as barras não sejam empilhadas
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        min: 0,
                        max: Math.ceil(maxVendas * 1.5),
                        title: {
                            display: true,
                            text: 'Quantidade de Vendas'
                        },
                        ticks: {
                            stepSize: 1
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'  // Grade mais visível
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        min: 0,
                        max: Math.ceil(maxValor * 1.5),
                        title: {
                            display: true,
                            text: 'Valor Total (R$)'
                        },
                        grid: {
                            drawOnChartArea: false
                        },
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toFixed(2);
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 20  // Mais espaço na legenda
                        }
                    },
                    title: {
                        display: true,
                        text: 'Vendas por Mês',
                        padding: 20
                    }
                }
            }
        });

    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        document.querySelector('.chart-container').innerHTML = 
            '<p class="error">Erro ao carregar o gráfico. Por favor, tente novamente.</p>';
    }
}

document.addEventListener('DOMContentLoaded', carregarGrafico); 