document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const btnTarefas = document.getElementById('btnTarefas');
    const tarefasResult = document.getElementById('tarefasResult');
    const comentarioForm = document.getElementById('comentarioForm');
    const comentarioResult = document.getElementById('comentarioResult');
    const btnBuscar = document.getElementById('btnBuscar');
    const personagemInput = document.getElementById('personagemInput');
    const personagensResult = document.getElementById('personagensResult');

    // 1. Listar Tarefas com Fallback
    btnTarefas.addEventListener('click', async function() {
        tarefasResult.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Carregando tarefas...</p>';
        
        try {
            // Tenta API principal
            const response = await fetch('https://dummyjson.com/todos?limit=5');
            const { todos } = await response.json();
            showTasks(todos);
        } catch (error) {
            console.error('Erro na API principal:', error);
            // Fallback para API alternativa
            try {
                const backupResponse = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
                const backupData = await backupResponse.json();
                const adaptedTasks = backupData.map(task => ({
                    todo: task.title,
                    completed: task.completed
                }));
                showTasks(adaptedTasks);
            } catch (backupError) {
                console.error('Erro no backup:', backupError);
                // Fallback para dados locais
                const localTasks = [
                    { todo: "Fazer compras", completed: false },
                    { todo: "Estudar JavaScript", completed: true },
                    { todo: "Limpar a casa", completed: false }
                ];
                showTasks(localTasks);
            }
        }
    });

    function showTasks(tasks) {
        let html = '<ul>';
        tasks.forEach(task => {
            html += `
                <li class="${task.completed ? 'completed' : 'incomplete'}">
                    ${task.todo} - ${task.completed ? 'Completa' : 'Incompleta'}
                </li>`;
        });
        html += '</ul>';
        tarefasResult.innerHTML = html;
    }

    // 2. Formulário de Comentários
    comentarioForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value;
        const comentario = document.getElementById('comentario').value;
        
        if (!nome || !comentario) {
            comentarioResult.innerHTML = '<p class="error">Preencha todos os campos.</p>';
            return;
        }
        
        comentarioResult.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Enviando...</p>';
        
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
            comentarioResult.innerHTML = `
                <p><strong>Nome:</strong> ${data.name}</p>
                <p><strong>Comentário:</strong> ${data.body}</p>
                <p><em>(API de teste - dados não são armazenados)</em></p>
            `;
            
            comentarioForm.reset();
        } catch (error) {
            comentarioResult.innerHTML = '<p class="error">Erro ao enviar comentário.</p>';
            console.error('Erro:', error);
        }
    });

    // 3. Busca de Personagens
    btnBuscar.addEventListener('click', buscarPersonagem);
    personagemInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') buscarPersonagem();
    });

    async function buscarPersonagem() {
        const nomePersonagem = personagemInput.value.trim();
        
        if (!nomePersonagem) {
            personagensResult.innerHTML = '<p class="error">Digite um nome.</p>';
            return;
        }
        
        personagensResult.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Buscando...</p>';
        
        try {
            const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${nomePersonagem}`);
            const data = await response.json();
            
            if (data.error) {
                personagensResult.innerHTML = '<p class="error">Personagem não encontrado.</p>';
                return;
            }
            
            let html = '';
            data.results.forEach(personagem => {
                html += `
                    <div>
                        <img src="${personagem.image}" alt="${personagem.name}" width="100">
                        <p><strong>${personagem.name}</strong></p>
                        <p>${personagem.status} - ${personagem.species}</p>
                    </div>`;
            });
            personagensResult.innerHTML = html;
        } catch (error) {
            personagensResult.innerHTML = '<p class="error">Erro na busca.</p>';
            console.error('Erro:', error);
        }
    }
});