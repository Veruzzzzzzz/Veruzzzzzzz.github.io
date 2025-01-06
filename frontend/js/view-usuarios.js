document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Pode usar tanto a view quanto a procedure
        const response = await fetch('http://localhost:3000/api/usuarios/view');
        const usuarios = await response.json();
        
        const tbody = document.querySelector('#usuariosTable tbody');
        tbody.innerHTML = '';
        
        if (usuarios.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="2" class="text-center">Nenhum usuário encontrado</td>
                </tr>
            `;
            return;
        }

        usuarios.forEach(usuario => {
            tbody.innerHTML += `
                <tr>
                    <td>${usuario.nome}</td>
                    <td>${usuario.email}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Erro:', error);
        const tbody = document.querySelector('#usuariosTable tbody');
        tbody.innerHTML = `
            <tr>
                <td colspan="2">Erro ao carregar usuários</td>
            </tr>
        `;
    }
});