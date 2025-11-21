let cardContainer = document.querySelector(".card-container");
let campoBusca = document.querySelector("header input");
let dados = [];
let backgroundVideoContainer = document.getElementById("background-video-container");
//  Seleciona o elemento body
const body = document.querySelector('body'); 

// Função para exibir o trailer no background
function clearTrailerBackground() {
    backgroundVideoContainer.style.opacity = 0; // Torna invisível
    
    //  Remove a classe de imersão do body
    body.classList.remove('immersive-mode'); 
    
    // Mantenha o iframe no DOM para carregamento rápido
    // Apenas pause o vídeo, se o elemento iframe existir e tiver um método pause()
    const iframe = backgroundVideoContainer.querySelector('iframe');
    if (iframe) {
        // Envia uma mensagem para o player do YouTube para pausar
        // (Isso é mais confiável do que apenas remover o iframe)
        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo"}', '*');
    }

}

// A função showTrailerAsBackground continua como estava:
function showTrailerAsBackground(trailerUrl) {
    if (!trailerUrl) {
        backgroundVideoContainer.style.opacity = 0;
        return;
    }

    //  Adiciona a classe de imersão ao body
    body.classList.add('immersive-mode');

    // Verifica se a URL já está no iframe existente
    const iframe = backgroundVideoContainer.querySelector('iframe');
    if (iframe && iframe.src === trailerUrl) {
        // Se a URL for a mesma, apenas torna visível e tenta dar play (se o pause funcionou)
        backgroundVideoContainer.style.opacity = 1;
        iframe.contentWindow.postMessage('{"event":"command","func":"playVideo"}', '*');
        return;
    }

    // Se for uma nova URL, cria o iframe
    backgroundVideoContainer.innerHTML = `
        <iframe 
            src="${trailerUrl}" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
        </iframe>
    `;
    backgroundVideoContainer.style.opacity = 1; // Torna visível
}


async function iniciarBusca() {
    if (dados.length === 0) {
        try {
            let resposta = await fetch("data.json");
            dados = await resposta.json();
        } catch (error) {
            console.error("Falha ao buscar dados:", error);
            return;
        }
    }

    const termoBusca = campoBusca.value.toLowerCase();
    const dadosFiltrados = dados.filter(dado =>
        dado.nome.toLowerCase().includes(termoBusca) ||
        dado.descricao.toLowerCase().includes(termoBusca)
    );

    renderizarCards(dadosFiltrados);
}

function renderizarCards(dados) {
    cardContainer.innerHTML = "";
    for (let dado of dados) {
        let article = document.createElement("article");
        article.classList.add("card");

        // Adiciona os event listeners para mouseover e mouseout
        article.addEventListener('mouseover', () => {
            showTrailerAsBackground(dado.trailer_url);
        });
        article.addEventListener('mouseout', () => {
            clearTrailerBackground();
        });

        article.innerHTML = `
        <div class="card-conteudo">
            <img src="${dado.imagem_url}" alt="Capa do jogo ${dado.nome}" class="card-imagem">
            <div class="card-info">
                <h2>${dado.nome}</h2>
                <p class="card-data">${dado.data_criacao}</p>
                <p class="card-descricao">${dado.descricao}</p>
                <a href="${dado.link_oficial}" target="_blank">Saiba mais</a>
            </div>
        </div>
        `;
        cardContainer.appendChild(article);
    }
}

// Opcional: Chama iniciarBusca() ao carregar a página para exibir os cards
document.addEventListener('DOMContentLoaded', iniciarBusca);