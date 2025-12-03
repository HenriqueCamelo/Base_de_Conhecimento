document.addEventListener('DOMContentLoaded', () => {
    // 1. Obter o ID do jogo da URL
    const params = new URLSearchParams(window.location.search);
    const gameId = parseInt(params.get('id')); // Garantimos que é um número

    // Verifica se a ID é um número válido antes de carregar
    if (isNaN(gameId)) {
        console.error("ID de jogo inválida na URL.");
        window.location.href = 'index.html'; 
        return;
    }

    /**
     * Função assíncrona para carregar o JSON e preencher os detalhes.
     */
    async function carregarDetalhesDoJogo() {
        try {
            // 2. Chamada ao JSON (Substituição da constante 'dados' pelo fetch)
            const response = await fetch('data.json'); 

            // Verifica se a resposta foi bem-sucedida (status 200)
            if (!response.ok) {
                throw new Error(`Erro ao carregar data.json: ${response.statusText}`);
            }

            // Converte a resposta para JSON
            const dados = await response.json(); 

            // 🏆 MUDANÇA PRINCIPAL: Usa find() para procurar o jogo pela ID
            const jogo = dados.find(item => item.id === gameId);
            

            if (!jogo || !jogo.requisitos) {
                console.error("Jogo não encontrado ou dados incompletos.");
                window.location.href = 'index.html'; 
                return;
            }

            // 3. Inserir o Trailer de Background
            const trailerContainer = document.getElementById('trailer-background');
            trailerContainer.innerHTML = `
                <iframe src="${jogo.trailer_url}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
            `;

            // 4. Preencher as informações do Jogo
            document.getElementById('titulo-pagina').textContent = jogo.nome;
            document.getElementById('detalhe-nome').textContent = jogo.nome;
            document.getElementById('detalhe-descricao').textContent = jogo.descricao;
            document.getElementById('detalhe-link-oficial').href = jogo.link_oficial;
            document.getElementById('detalhe-link-oficial').textContent = `Acesse o site oficial de ${jogo.nome}`;
            
            // Preencher as Tags
            const tagsContainer = document.getElementById('detalhe-tags');
            tagsContainer.innerHTML = ''; // Limpa antes de preencher
            jogo.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.classList.add('tag-item');
                tagElement.textContent = tag;
                tagsContainer.appendChild(tagElement);
            });

            // 5. Preencher os Requisitos
            document.getElementById('req-ram').textContent = jogo.requisitos.ram;
            document.getElementById('req-processador').textContent = jogo.requisitos.processador;
            document.getElementById('req-placa-video').textContent = jogo.requisitos.placa_video;
            document.getElementById('req-espaco-disco').textContent = jogo.requisitos.espaco_disco;

            // 6. Efeito de Revelação ao Rolar
            const requisitosSecao = document.getElementById('requisitos-secao');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visivel');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.2 
            });

            observer.observe(requisitosSecao);

        } catch (error) {
            // Em caso de erro (ex: arquivo não encontrado, JSON malformado)
            console.error("Erro ao processar dados do jogo:", error);
            //window.location.href = 'index.html'; 
        }
    }

    // Inicia o carregamento
    carregarDetalhesDoJogo();
});