const API_URL = 'http://localhost:3000/api';

// Função para mostrar mensagens de erro ou sucesso
function showMessage(message, isError = false) {
    alert(message); // Você pode substituir por uma implementação mais elegante
}

// Funções para o cadastro de clientes
if (document.getElementById('clienteForm')) {
    document.getElementById('clienteForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value
        };

        try {
            const response = await fetch(`${API_URL}/clientes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                showMessage('Cliente cadastrado com sucesso!');
                window.location.href = 'index.html';
            } else {
                const error = await response.json();
                showMessage(error.message || 'Erro ao cadastrar cliente', true);
            }
        } catch (error) {
            showMessage('Erro ao conectar com o servidor', true);
        }
    });
}

// Função para listar todos os clientes
async function listarClientes() {
    try {
        const response = await fetch(`${API_URL}/clientes`);
        const clientes = await response.json();

        const tbody = document.querySelector('#clientesTable tbody');
        tbody.innerHTML = '';

        clientes.forEach(cliente => {
            tbody.innerHTML += `
                <tr>
                    <td>${cliente.id_cliente}</td>
                    <td>${cliente.nome}</td>
                    <td>${cliente.email}</td>
                    <td>${cliente.telefone || '-'}</td>
                </tr>
            `;
        });
    } catch (error) {
        showMessage('Erro ao carregar clientes', true);
    }
}

// Função para buscar um cliente específico
async function buscarCliente() {
    const id = document.getElementById('clienteId').value;
    if (!id) {
        showMessage('Por favor, informe um ID', true);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/clientes/${id}`);
        if (response.ok) {
            const cliente = await response.json();
            document.getElementById('resultadoBusca').innerHTML = `
                <div class="cliente-info">
                    <h2>Dados do Cliente</h2>
                    <p><strong>ID:</strong> ${cliente.id_cliente}</p>
                    <p><strong>Nome:</strong> ${cliente.nome}</p>
                    <p><strong>Email:</strong> ${cliente.email}</p>
                    <p><strong>Telefone:</strong> ${cliente.telefone || '-'}</p>
                </div>
            `;
        } else {
            showMessage('Cliente não encontrado', true);
        }
    } catch (error) {
        showMessage('Erro ao buscar cliente', true);
    }
}

// Funções para edição de cliente
async function buscarClienteParaEditar() {
    const id = document.getElementById('clienteId').value;
    if (!id) {
        showMessage('Por favor, informe um ID', true);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/clientes/${id}`);
        if (response.ok) {
            const cliente = await response.json();
            document.getElementById('nome').value = cliente.nome;
            document.getElementById('email').value = cliente.email;
            document.getElementById('telefone').value = cliente.telefone || '';
            document.getElementById('editarClienteForm').style.display = 'block';
            
            // Adicionar evento de submit para o formulário de edição
            document.getElementById('editarClienteForm').onsubmit = async (e) => {
                e.preventDefault();
                await editarCliente(id);
            };
        } else {
            showMessage('Cliente não encontrado', true);
        }
    } catch (error) {
        showMessage('Erro ao buscar cliente', true);
    }
}

async function editarCliente(id) {
    const formData = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value
    };

    try {
        const response = await fetch(`${API_URL}/clientes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            showMessage('Cliente atualizado com sucesso!');
            window.location.href = 'index.html';
        } else {
            const error = await response.json();
            showMessage(error.message || 'Erro ao atualizar cliente', true);
        }
    } catch (error) {
        showMessage('Erro ao conectar com o servidor', true);
    }
}

// Funções para exclusão de cliente
async function buscarClienteParaExcluir() {
    const id = document.getElementById('clienteId').value;
    if (!id) {
        showMessage('Por favor, informe um ID', true);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/clientes/${id}`);
        if (response.ok) {
            const cliente = await response.json();
            document.getElementById('clienteInfo').innerHTML = `
                <div class="cliente-info">
                    <h2>Confirmar Exclusão</h2>
                    <p><strong>ID:</strong> ${cliente.id_cliente}</p>
                    <p><strong>Nome:</strong> ${cliente.nome}</p>
                    <p><strong>Email:</strong> ${cliente.email}</p>
                    <p><strong>Telefone:</strong> ${cliente.telefone || '-'}</p>
                </div>
                <div class="form-actions">
                    <button onclick="excluirCliente(${cliente.id_cliente})" class="btn-danger">Confirmar Exclusão</button>
                    <button type="button" class="btn-secondary" onclick="window.location.href='index.html'">Cancelar</button>
                </div>
            `;
            document.getElementById('clienteInfo').style.display = 'block';
        } else {
            showMessage('Cliente não encontrado', true);
        }
    } catch (error) {
        showMessage('Erro ao buscar cliente', true);
    }
}

async function excluirCliente(id) {
    try {
        const response = await fetch(`${API_URL}/clientes/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showMessage('Cliente excluído com sucesso!');
            window.location.href = 'index.html';
        } else {
            const error = await response.json();
            showMessage(error.message || 'Erro ao excluir cliente', true);
        }
    } catch (error) {
        showMessage('Erro ao conectar com o servidor', true);
    }
}

// Inicializar listagem quando necessário
if (document.querySelector('#clientesTable')) {
    listarClientes();
} 