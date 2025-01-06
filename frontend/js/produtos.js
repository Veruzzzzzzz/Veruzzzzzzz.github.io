const API_URL = 'http://localhost:3000/api';

// Função para mostrar mensagens
function showMessage(message, isError = false) {
    alert(message);
}

// Funções para o cadastro de produtos
if (document.getElementById('produtoForm')) {
    document.getElementById('produtoForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            nome: document.getElementById('nome').value,
            preco: parseFloat(document.getElementById('preco').value),
            estoque: parseInt(document.getElementById('estoque').value)
        };

        try {
            const response = await fetch(`${API_URL}/produtos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                showMessage('Produto cadastrado com sucesso!');
                window.location.href = 'index.html';
            } else {
                const error = await response.json();
                showMessage(error.message || 'Erro ao cadastrar produto', true);
            }
        } catch (error) {
            showMessage('Erro ao conectar com o servidor', true);
        }
    });
}

// Função para listar todos os produtos
async function listarProdutos() {
    try {
        const response = await fetch(`${API_URL}/produtos`);
        if (!response.ok) {
            throw new Error('Erro ao buscar produtos');
        }
        const produtos = await response.json();

        const tbody = document.querySelector('#produtosTable tbody');
        tbody.innerHTML = '';

        produtos.forEach(produto => {
            // Converte o preço para número
            const preco = parseFloat(produto.preco);
            tbody.innerHTML += `
                <tr>
                    <td>${produto.id_produto}</td>
                    <td>${produto.nome}</td>
                    <td>R$ ${preco.toFixed(2)}</td>
                    <td>${produto.estoque}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Erro:', error);
        showMessage('Erro ao carregar produtos: ' + error.message, true);
    }
}

// Função para buscar um produto
async function buscarProduto() {
    const id = document.getElementById('produtoId').value;
    if (!id) {
        showMessage('Por favor, informe um ID', true);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/produtos/${id}`);
        if (!response.ok) {
            throw new Error('Produto não encontrado');
        }
        const produto = await response.json();

        // Converte o preço para número antes de usar toFixed
        const preco = parseFloat(produto.preco);
        
        document.getElementById('resultadoBusca').innerHTML = `
            <div class="result-info">
                <h2>Dados do Produto</h2>
                <p><strong>ID:</strong> ${produto.id_produto}</p>
                <p><strong>Nome:</strong> ${produto.nome}</p>
                <p><strong>Preço:</strong> R$ ${preco.toFixed(2)}</p>
                <p><strong>Estoque:</strong> ${produto.estoque}</p>
            </div>
        `;
    } catch (error) {
        console.error('Erro:', error);
        showMessage('Erro ao buscar produto: ' + error.message, true);
    }
}

// Funções para edição de produto
async function buscarProdutoParaEditar() {
    const id = document.getElementById('produtoId').value;
    if (!id) {
        showMessage('Por favor, informe um ID', true);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/produtos/${id}`);
        if (response.ok) {
            const produto = await response.json();
            document.getElementById('nome').value = produto.nome;
            document.getElementById('preco').value = produto.preco;
            document.getElementById('estoque').value = produto.estoque;
            document.getElementById('editarProdutoForm').style.display = 'block';
            
            document.getElementById('editarProdutoForm').onsubmit = async (e) => {
                e.preventDefault();
                await editarProduto(id);
            };
        } else {
            showMessage('Produto não encontrado', true);
        }
    } catch (error) {
        showMessage('Erro ao buscar produto', true);
    }
}

async function editarProduto(id) {
    const formData = {
        nome: document.getElementById('nome').value,
        preco: parseFloat(document.getElementById('preco').value),
        estoque: parseInt(document.getElementById('estoque').value)
    };

    try {
        const response = await fetch(`${API_URL}/produtos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            showMessage('Produto atualizado com sucesso!');
            window.location.href = 'index.html';
        } else {
            const error = await response.json();
            showMessage(error.message || 'Erro ao atualizar produto', true);
        }
    } catch (error) {
        showMessage('Erro ao conectar com o servidor', true);
    }
}

// Função para buscar produto para exclusão
async function buscarProdutoParaExcluir() {
    const id = document.getElementById('produtoId').value;
    if (!id) {
        showMessage('Por favor, informe um ID', true);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/produtos/${id}`);
        
        if (!response.ok) {
            throw new Error('Produto não encontrado');
        }
        
        const produto = await response.json();
        const preco = parseFloat(produto.preco);
        
        // Mostra as informações do produto e botão de confirmação
        document.getElementById('produtoInfo').style.display = 'block';
        document.getElementById('produtoInfo').innerHTML = `
            <div class="result-info">
                <h2>Dados do Produto</h2>
                <p><strong>ID:</strong> ${produto.id_produto}</p>
                <p><strong>Nome:</strong> ${produto.nome}</p>
                <p><strong>Preço:</strong> R$ ${preco.toFixed(2)}</p>
                <p><strong>Estoque:</strong> ${produto.estoque}</p>
                <div class="form-actions">
                    <button onclick="excluirProduto(${produto.id_produto})" class="btn-danger">Confirmar Exclusão</button>
                    <button onclick="window.location.href='index.html'" class="btn-secondary">Cancelar</button>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('produtoInfo').style.display = 'none';
        showMessage('Produto não encontrado. Verifique o ID e tente novamente.');
    }
}

// Função para excluir produto
async function excluirProduto(id) {
    try {
        const response = await fetch(`${API_URL}/produtos/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir produto');
        }

        showMessage('Produto excluído com sucesso!');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Erro:', error);
        showMessage('Erro ao excluir produto. Tente novamente.');
    }
}

// Inicializar listagem quando necessário
if (document.querySelector('#produtosTable')) {
    listarProdutos();
} 