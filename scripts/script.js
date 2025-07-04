document.addEventListener('DOMContentLoaded', function() {
    // 1. Listar Tarefas
    document.getElementById('btnTarefas').addEventListener('click', async function() {
        const resultDiv = document.getElementById('tarefasResult');
        resultDiv.innerHTML = '<p>Carregando tarefas...</p>';
        
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos');
            const tarefas = await response.json();
            
            let html = '<h3>10 Primeiras Tarefas:</h3><ul>';
            tarefas.slice(0, 10).forEach(tarefa => {
                html += `<li class="${tarefa.completed ? 'completed' : 'incomplete'}">
                    ${tarefa.title} - <strong>${tarefa.completed ? 'Completa' : 'Incompleta'}</strong>
                </li>`;
            });
            html += '</ul>';
            
            resultDiv.innerHTML = html;
        } catch (error) {
            resultDiv.innerHTML = '<p class="error">Erro ao carregar tarefas. Tente novamente.</p>';
            console.error('Erro:', error);
        }
    });

    // 2. Formulário de Comentários
    document.getElementById('comentarioForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value;
        const comentario = document.getElementById('comentario').value;
        const resultDiv = document.getElementById('comentarioResult');
        
        if (!nome || !comentario) {
            resultDiv.innerHTML = '<p class="error">Preencha todos os campos.</p>';
            return;
        }
        
        resultDiv.innerHTML = '<p>Enviando comentário...</p>';
        
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/comments', {
                method: 'POST',
                body: JSON.stringify({
                    name: nome,
                    body: comentario,
                    postId: 1
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            
            const data = await response.json();
            resultDiv.innerHTML = `
                <h3>Comentário Enviado com Sucesso!</h3>
                <p><strong>Nome:</strong> ${data.name}</p>
                <p><strong>Comentário:</strong> ${data.body}</p>
                <p class="note">Observação: Esta é uma API de teste. O comentário não será realmente armazenado.</p>
            `;
            
            // Limpa o formulário
            document.getElementById('comentarioForm').reset();
        } catch (error) {
            resultDiv.innerHTML = '<p class="error">Erro ao enviar comentário. Tente novamente.</p>';
            console.error('Erro:', error);
        }
    });

    // 3. Busca de Personagens
    document.getElementById('btnBuscar').addEventListener('click', buscarPersonagem);
    document.getElementById('personagemInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            buscarPersonagem();
        }
    });

    async function buscarPersonagem() {
        const nomePersonagem = document.getElementById('personagemInput').value.trim();
        const resultadoDiv = document.getElementById('personagensResult');
        
        if (!nomePersonagem) {
            resultadoDiv.innerHTML = '<p class="error">Digite o nome de um personagem.</p>';
            return;
        }
        
        resultadoDiv.innerHTML = '<p>Buscando personagens...</p>';
        
        try {
            const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${nomePersonagem}`);
            const data = await response.json();
            
            if (data.error) {
                resultadoDiv.innerHTML = `<p class="error">Personagem "${nomePersonagem}" não encontrado.</p>`;
                return;
            }
            
            if (data.results && data.results.length > 0) {
                let html = '';
                data.results.forEach(personagem => {
                    html += `
                        <div class="character-card">
                            <img src="${personagem.image}" alt="${personagem.name}">
                            <div class="character-info">
                                <h3>${personagem.name}</h3>
                                <p>
                                    <span class="status ${personagem.status.toLowerCase()}"></span>
                                    ${personagem.status} - ${personagem.species}
                                </p>
                            </div>
                        </div>
                    `;
                });
                resultadoDiv.innerHTML = html;
            } else {
                resultadoDiv.innerHTML = `<p class="error">Nenhum personagem encontrado com o nome "${nomePersonagem}".</p>`;
            }
        } catch (error) {
            resultadoDiv.innerHTML = '<p class="error">Erro na busca. Tente novamente.</p>';
            console.error('Erro:', error);
        }
    }
});