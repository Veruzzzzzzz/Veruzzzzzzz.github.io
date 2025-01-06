const API_URL = 'http://localhost:3000/api';

// Função para mostrar mensagens
function showMessage(message, isError = false) {
    alert(message);
}

// Funções para o cadastro de funcionários
if (document.getElementById('funcionarioForm')) {
    document.getElementById('funcionarioForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            nome: document.getElementById('nome').value,
            cargo: document.getElementById('cargo').value,
            salario: parseFloat(document.getElementById('salario').value)
        };

        try {
            const response = await fetch(`${API_URL}/funcionarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                showMessage('Funcionário cadastrado com sucesso!');
                window.location.href = 'index.html';
            } else {
                const error = await response.json();
                showMessage(error.message || 'Erro ao cadastrar funcionário', true);
            }
        } catch (error) {
            showMessage('Erro ao conectar com o servidor', true);
        }
    });
}

// Função para listar todos os funcionários
async function listarFuncionarios() {
    try {
        const response = await fetch(`${API_URL}/funcionarios`);
        if (!response.ok) {
            throw new Error('Erro ao buscar funcionários');
        }
        const funcionarios = await response.json();

        const tbody = document.querySelector('#funcionariosTable tbody');
        tbody.innerHTML = '';

        funcionarios.forEach(funcionario => {
            const salario = parseFloat(funcionario.salario);
            tbody.innerHTML += `
                <tr>
                    <td>${funcionario.id_funcionario}</td>
                    <td>${funcionario.nome}</td>
                    <td>${funcionario.cargo}</td>
                    <td>R$ ${salario.toFixed(2)}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Erro:', error);
        showMessage('Erro ao carregar funcionários: ' + error.message, true);
    }
}

// Função para buscar um funcionário
async function buscarFuncionario() {
    const id = document.getElementById('funcionarioId').value;
    if (!id) {
        showMessage('Por favor, informe um ID', true);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/funcionarios/${id}`);
        if (!response.ok) {
            throw new Error('Funcionário não encontrado');
        }
        const funcionario = await response.json();
        
        const salario = parseFloat(funcionario.salario);
        document.getElementById('resultadoBusca').innerHTML = `
            <div class="result-info">
                <h2>Dados do Funcionário</h2>
                <p><strong>ID:</strong> ${funcionario.id_funcionario}</p>
                <p><strong>Nome:</strong> ${funcionario.nome}</p>
                <p><strong>Cargo:</strong> ${funcionario.cargo}</p>
                <p><strong>Salário:</strong> R$ ${salario.toFixed(2)}</p>
            </div>
        `;
    } catch (error) {
        console.error('Erro:', error);
        showMessage('Erro ao buscar funcionário: ' + error.message, true);
    }
}

// Funções para edição de funcionário
async function buscarFuncionarioParaEditar() {
    const id = document.getElementById('funcionarioId').value;
    if (!id) {
        showMessage('Por favor, informe um ID', true);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/funcionarios/${id}`);
        if (response.ok) {
            const funcionario = await response.json();
            document.getElementById('nome').value = funcionario.nome;
            document.getElementById('cargo').value = funcionario.cargo;
            document.getElementById('salario').value = funcionario.salario;
            document.getElementById('editarFuncionarioForm').style.display = 'block';
            
            document.getElementById('editarFuncionarioForm').onsubmit = async (e) => {
                e.preventDefault();
                await editarFuncionario(id);
            };
        } else {
            showMessage('Funcionário não encontrado', true);
        }
    } catch (error) {
        showMessage('Erro ao buscar funcionário', true);
    }
}

async function editarFuncionario(id) {
    const formData = {
        nome: document.getElementById('nome').value,
        cargo: document.getElementById('cargo').value,
        salario: parseFloat(document.getElementById('salario').value)
    };

    try {
        const response = await fetch(`${API_URL}/funcionarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            showMessage('Funcionário atualizado com sucesso!');
            window.location.href = 'index.html';
        } else {
            const error = await response.json();
            showMessage(error.message || 'Erro ao atualizar funcionário', true);
        }
    } catch (error) {
        showMessage('Erro ao conectar com o servidor', true);
    }
}

// Função para buscar funcionário para exclusão
async function buscarFuncionarioParaExcluir() {
    const id = document.getElementById('funcionarioId').value;
    if (!id) {
        showMessage('Por favor, informe um ID', true);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/funcionarios/${id}`);
        
        if (!response.ok) {
            throw new Error('Funcionário não encontrado');
        }
        
        const funcionario = await response.json();
        
        // Mostra as informações do funcionário e botão de confirmação
        document.getElementById('funcionarioInfo').style.display = 'block';
        document.getElementById('funcionarioInfo').innerHTML = `
            <div class="result-info">
                <h2>Dados do Funcionário</h2>
                <p><strong>ID:</strong> ${funcionario.id_funcionario}</p>
                <p><strong>Nome:</strong> ${funcionario.nome}</p>
                <p><strong>Cargo:</strong> ${funcionario.cargo}</p>
                <p><strong>Salário:</strong> R$ ${parseFloat(funcionario.salario).toFixed(2)}</p>
                <div class="form-actions">
                    <button onclick="excluirFuncionario(${funcionario.id_funcionario})" class="btn-danger">Confirmar Exclusão</button>
                    <button onclick="window.location.href='index.html'" class="btn-secondary">Cancelar</button>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('funcionarioInfo').style.display = 'none';
        showMessage('Funcionário não encontrado. Verifique o ID e tente novamente.');
    }
}

// Função para excluir funcionário
async function excluirFuncionario(id) {
    try {
        const response = await fetch(`${API_URL}/funcionarios/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir funcionário');
        }

        showMessage('Funcionário excluído com sucesso!');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Erro:', error);
        showMessage('Erro ao excluir funcionário. Tente novamente.');
    }
}

// Inicializar listagem quando necessário
if (document.querySelector('#funcionariosTable')) {
    listarFuncionarios();
} 