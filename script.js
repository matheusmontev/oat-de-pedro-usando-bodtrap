const dddInput = document.getElementById('ddd');
const buscarDDDBtn = document.getElementById('buscarDDD');
const errorMessage = document.getElementById('error-message');
const loading = document.getElementById('loading');
const resultadoDiv = document.getElementById('resultado');
const dddForm = document.getElementById('dddForm');

// Função para limpar erros e resultados anteriores
function limparMensagens() {
    errorMessage.textContent = '';
    resultadoDiv.innerHTML = '';
}

// Função para desativar o botão durante a requisição
function toggleBotao(disable) {
    buscarDDDBtn.disabled = disable;
}

// Função para exibir ou esconder o indicador de carregamento
function mostrarLoading(mostrar) {
    loading.style.display = mostrar ? 'block' : 'none';
    loading.style.opacity = mostrar ? '1' : '0';
}

// Evento de envio do formulário
dddForm.addEventListener('submit', function(event) {
    event.preventDefault();  // Evita o recarregamento da página
    const ddd = dddInput.value.replace(/\D/g, '');  // Remove caracteres não numéricos
    limparMensagens();

    // Validação do DDD (precisa ter 2 dígitos)
    if (ddd.length !== 2) {
        errorMessage.textContent = 'Por favor, insira um DDD válido com 2 dígitos.';
        return;
    }

    toggleBotao(true);  // Desativa o botão
    mostrarLoading(true);  // Exibe o carregamento

    // Faz a requisição à API da BrasilAPI para o DDD
    fetch(`https://brasilapi.com.br/api/ddd/v1/${ddd}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error('DDD não encontrado');
            }

            // Gerar a lista de cidades em colunas
            const cityList = data.cities.map(city => `<li>${city}</li>`).join('');

            resultadoDiv.innerHTML = `
                <div class="card mt-3">
                    <div class="card-body">
                        <p><strong>Estado:</strong> ${data.state}</p>
                        <div class="city-list">
                            <strong>Cidades:</strong>
                            <ul>
                                ${cityList}
                            </ul>
                        </div>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            resultadoDiv.innerHTML = '<div class="alert alert-danger">DDD não encontrado!</div>';
        })
        .finally(() => {
            mostrarLoading(false);  // Esconde o carregamento
            toggleBotao(false);  // Reativa o botão
            dddInput.value = '';  // Limpa o campo de DDD
        });
});
