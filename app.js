const API_BASE_URL = 'http://localhost:3000';
let authToken = ''; // Armazenará o token JWT

// --- Funções de Autenticação ---
document.getElementById('btnLogin').addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginSenha').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();
        if (response.ok) {
            authToken = data.token;
            document.getElementById('loginStatus').textContent = 'Login bem-sucedido! Token obtido.';
            console.log('Token JWT:', authToken);
        } else {
            document.getElementById('loginStatus').textContent = `Erro no login: ${data.msg || 'Credenciais inválidas'}`;
        }
    } catch (error) {
        document.getElementById('loginStatus').textContent = 'Erro ao conectar ao servidor de autenticação.';
        console.error('Erro de rede ou servidor:', error);
    }
});

// --- Funções para Filmes ---
async function carregarFilmes() {
    if (!authToken) {
        alert('Faça login primeiro para carregar os filmes!');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/filmes`, {
            headers: {
                'Authorization': `Bearer ${authToken}` // Enviando o token
            }
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} - ${await response.text()}`);
        }

        const filmes = await response.json();
        const listaFilmes = document.getElementById('listaFilmes');
        listaFilmes.innerHTML = ''; // Limpa a lista existente

        if (Object.keys(filmes).length === 0) {
            listaFilmes.innerHTML = '<li>Nenhum filme encontrado.</li>';
            return;
        }

        for (const key in filmes) {
            const filme = filmes[key];
            const li = document.createElement('li');
            li.textContent = `${filme.nome} (${filme.ano}, ${filme.duracao} min)`;
            listaFilmes.appendChild(li);
        }

    } catch (error) {
        alert('Erro ao carregar filmes. Verifique o token ou o console.');
        console.error('Erro ao carregar filmes:', error);
    }
}

document.getElementById('btnLoadFilmes').addEventListener('click', carregarFilmes);

document.getElementById('btnAddFilme').addEventListener('click', async () => {
    if (!authToken) {
        alert('Faça login primeiro para adicionar um filme!');
        return;
    }

    const nome = document.getElementById('addNomeFilme').value;
    const ano = parseInt(document.getElementById('addAnoFilme').value);
    const duracao = parseInt(document.getElementById('addDuracaoFilme').value);

    if (!nome || isNaN(ano) || isNaN(duracao)) {
        alert('Preencha todos os campos do filme!');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/filmes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}` // Enviando o token
            },
            body: JSON.stringify({ nome, ano, duracao })
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} - ${await response.text()}`);
        }

        const result = await response.json();
        alert(result.msg);
        document.getElementById('addNomeFilme').value = ''; // Limpa os campos
        document.getElementById('addAnoFilme').value = '';
        document.getElementById('addDuracaoFilme').value = '';
        carregarFilmes(); // Recarrega a lista
    } catch (error) {
        alert('Erro ao adicionar filme. Verifique o console.');
        console.error('Erro ao adicionar filme:', error);
    }
});