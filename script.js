document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.querySelector('.card-container');
    const inputBusca = document.querySelector('header input[type="text"]');
    const botaoBusca = document.getElementById('botao-busca');
    const avisoInteracao = document.getElementById('aviso-interacao');
    const videoBackgroundContainer = document.getElementById('background-video-container');
    
    let todosOsJogos = []; // Armazena todos os dados do JSON
    let cardComHover = null; // Para rastrear qual card está com o mouse

    // 1. Carregamento dos dados JSON
    async function carregarDados() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error('Erro ao carregar data.json');
            }
            todosOsJogos = await response.json();
            renderizarCards(todosOsJogos);
        } catch (error) {
            console.error("Não foi possível carregar os dados:", error);
            cardContainer.innerHTML = '<p style="color: red; font-size: 1.2rem;">Erro ao carregar a base de conhecimento.</p>';
        }
    }

    // 2. Função para renderizar os cards
    const renderizarCards = (dados) => {
        cardContainer.innerHTML = ''; // Limpa o container
        
        if (dados.length === 0) {
            cardContainer.innerHTML = '<p>Nenhum jogo encontrado para esta busca.</p>';
            return;
        }

        dados.forEach((jogo, index) => {
            const card = document.createElement('article'); 
            card.classList.add('card');
            
            // 🏆 MUDANÇA PRINCIPAL: Usamos o ID explícito do JSON
            const idDoJogo = jogo.id; 
            const detalhesUrl = `detalhes.html?id=${idDoJogo}`;

            // Adiciona o conteúdo do card
            card.innerHTML = `
                <div class="card-conteudo">
                    <img src="${jogo.imagem_url}" alt="Capa do Jogo ${jogo.nome}" class="card-imagem">
                    <div class="card-info">
                        <h2>${jogo.nome}</h2>
                        <p class="card-data">Lançamento: ${jogo.data_criacao}</p>
                        <p class="card-descricao">${jogo.descricao}</p>
                        
                        <div class="card-botoes">
                            <a href="${detalhesUrl}" class="btn-requisitos">Req. Mínimos</a> 
                            
                            <a href="${jogo.link_oficial}" target="_blank">Site Oficial</a>
                        </div>
                    </div>
                </div>
            `;
            
            // 3. Adiciona Manipuladores de Eventos (Hover e Clique)
            
            // Evento de HOVER (Mouse Enter) para o background imersivo
            card.addEventListener('mouseenter', () => {
                ativarModoImersivo(jogo.trailer_url);
                cardComHover = card;
                if (avisoInteracao) {
                    avisoInteracao.style.opacity = '0'; // Esconde a dica
                }
            });

            // Evento de HOVER (Mouse Leave) para sair do modo imersivo
            card.addEventListener('mouseleave', () => {
                if (cardComHover === card) {
                    desativarModoImersivo();
                    cardComHover = null;
                }
            });

            cardContainer.appendChild(card);
        });
    };

    // 4. Função de Busca (acionada pelo botão ou tecla Enter)
    const iniciarBusca = () => {
        const termo = inputBusca.value.toLowerCase();
        
        // Filtra os jogos com base no nome ou tags
        const resultados = todosOsJogos.filter(jogo => 
            jogo.nome.toLowerCase().includes(termo) || 
            jogo.tags.some(tag => tag.toLowerCase().includes(termo))
        );
        
        renderizarCards(resultados);
    };

    botaoBusca.addEventListener('click', iniciarBusca);
    inputBusca.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            iniciarBusca();
        }
    });

    // 5. Funções do Modo Imersivo (Background de Vídeo)
    function ativarModoImersivo(trailerUrl) {
        document.body.classList.add('immersive-mode');
        videoBackgroundContainer.style.opacity = '1';
        videoBackgroundContainer.innerHTML = `
            <iframe src="${trailerUrl}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        `;
    }

    function desativarModoImersivo() {
        document.body.classList.remove('immersive-mode');
        videoBackgroundContainer.style.opacity = '0';
        // Atrasamos a remoção do iframe para que o efeito de transição de opacidade funcione
        setTimeout(() => {
            if (!cardComHover) {
                 videoBackgroundContainer.innerHTML = '';
            }
        }, 500); 
    }

    // Inicia o carregamento dos dados quando a página carrega
    carregarDados();
});