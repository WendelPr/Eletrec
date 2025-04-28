let dados = JSON.parse(localStorage.getItem('dados')) || [];
let codigoProduto = document.getElementById('codigoProduto');
let nomeProduto = document.getElementById('nomeProduto');
let preco = document.getElementById('preco');
let nomeFuncionario = document.getElementById('nomeFuncionario');
let categoria = document.getElementById('categoria'); // Captura do input de categoria
let editando = false;

// Função para exibir mensagens temporárias
function exibirMensagem(idMensagem) {
    const mensagem = document.getElementById(idMensagem);
    mensagem.style.display = "block";
    setTimeout(() => { mensagem.style.display = "none"; }, 3000);
}

// Evento de envio do formulário de novos produtos
document.getElementById("novosProdutos").addEventListener("submit", (e) => {
    e.preventDefault(); 

    const codigo = codigoProduto.value;
    const nome = nomeProduto.value;
    const precoProduto = parseFloat(preco.value);
    const funcionario = nomeFuncionario.value;
    const categoriaProduto = categoria.value;  // Captura a categoria

    if (editando !== false) {
        // Editando produto existente
        dados[editando] = {
            codigoProduto: codigo,
            nome: nome,
            preco: precoProduto,
            nomeFuncionario: funcionario,
            categoria: categoriaProduto  // Armazena a categoria
        };

        // Atualiza o localStorage
        localStorage.setItem("dados", JSON.stringify(dados));
        editando = false; 
        codigoProduto.disabled = false;
        exibirMensagem("mensagemEditado");
    } else {
        // Verifica se o produto já existe
        const produtoExistente = dados.some((produto) => produto.codigoProduto === codigo);
        if (produtoExistente) {
            exibirMensagem("mensagemEditado1");
            return;
        }

        // Adiciona novo produto
        const novoProduto = {
            codigoProduto: codigo,
            nome: nome,
            preco: precoProduto,
            nomeFuncionario: funcionario,
            categoria: categoriaProduto  // Armazena a categoria
        };

        dados.push(novoProduto);
        localStorage.setItem("dados", JSON.stringify(dados));
        exibirMensagem("mensagemAdicionado");
    }

    // Limpa os campos do formulário
    codigoProduto.value = "";
    nomeProduto.value = "";
    preco.value = "";
    nomeFuncionario.value = "";
    categoria.value = "";  // Resetando categoria

    // Atualiza a tabela de produtos cadastrados
    atualizarTabela();
});

// Função para atualizar a tabela de produtos cadastrados
function atualizarTabela() {
    const tabelaBody = document.querySelector("#tabelaNovo tbody");
    tabelaBody.innerHTML = ""; 

    dados = JSON.parse(localStorage.getItem("dados")) || [];

    dados.forEach((produto, index) => {
        const novaLinha = document.createElement("tr");

        novaLinha.innerHTML = `
            <td>${produto.codigoProduto}</td>
            <td>${produto.nome}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>${produto.nomeFuncionario}</td>
            <td>${produto.categoria}</td>  <!-- Exibe a categoria -->
            <td>
                <button class="editar">Editar</button>
                <button class="excluir">Excluir</button>
            </td>`;

        tabelaBody.appendChild(novaLinha);
        novaLinha.querySelector(".editar").onclick = () => editarProduto(index);
        novaLinha.querySelector(".excluir").onclick = () => {
            removerProdutoDoEstoque(index);
            atualizarTabela();
        };
    });
}

// Função para remover produto do estoque
function removerProdutoDoEstoque(index) {
    const produto = dados[index];
    const estoque = JSON.parse(localStorage.getItem('estoque')) || {};

    // Verifica se o produto está no estoque
    if (estoque.hasOwnProperty(produto.codigoProduto)) {
        exibirMensagem("mensagemErroEstoque");
        return; 
    }

    // Remove o produto da lista de dados
    dados.splice(index, 1);
    localStorage.setItem("dados", JSON.stringify(dados));
    exibirMensagem("mensagemRemovido");
    atualizarTabela();
}

// Função para editar produto
function editarProduto(index) {
    const produto = dados[index];
    
    // Preenche os campos do formulário com os dados do produto
    document.getElementById("codigoProduto").value = produto.codigoProduto;
    document.getElementById("nomeProduto").value = produto.nome;
    document.getElementById("preco").value = produto.preco;
    document.getElementById("nomeFuncionario").value = produto.nomeFuncionario;
    document.getElementById("categoria").value = produto.categoria;  // Exibe a categoria no campo

    // Desabilita o campo de código para edição
    document.getElementById("codigoProduto").disabled = true;

    // Define que estamos editando o produto
    editando = index;
}

// Quando a página carrega, atualiza a tabela de produtos cadastrados
window.onload = atualizarTabela;
