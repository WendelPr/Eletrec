const formularioAdmin = document.getElementById("formularioAdmin");
const produtoSelect = document.getElementById("produto");
const categoriasLista = document.getElementById("categorias-lista");
let editando = false;

function carregarProdutosCriados() {
    const produtos = JSON.parse(localStorage.getItem("dados")) || [];
    produtoSelect.innerHTML = '<option value="">Selecione</option>';
    produtos.forEach(produto => {
        const option = document.createElement("option");
        option.value = produto.codigoProduto;
        option.textContent = produto.nome;
        produtoSelect.appendChild(option);
    });
}

function carregarEstoque() {
    const estoque = JSON.parse(localStorage.getItem("estoque")) || {};
    const tabelaBody = document.querySelector("#tabelaAdmin tbody");
    tabelaBody.innerHTML = "";
    Object.values(estoque).forEach(produto => {
        const preco = parseFloat(produto.preco) || 0;
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${produto.nome}</td>
            <td>${produto.codigo}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>${produto.quantidade}</td>
            <td>${produto.nomeFuncionario}</td>
            <td>${produto.categoria}</td> <!-- Exibir categoria -->
            <td>
                <button class="editar">Editar</button>
                <button class="remover">Remover</button>
            </td>`;
        linha.querySelector(".remover").onclick = () => removerProdutoDoEstoque(produto.codigo);
        linha.querySelector(".editar").onclick = () => editarProduto(produto);
        tabelaBody.appendChild(linha);
    });
}

function exibirMensagem(idMensagem) {
    const mensagem = document.getElementById(idMensagem);
    mensagem.style.display = "block";
    setTimeout(() => { mensagem.style.display = "none"; }, 3000);
}

function removerProdutoDoEstoque(codigoProduto) {
    const estoque = JSON.parse(localStorage.getItem("estoque")) || {};
    delete estoque[codigoProduto];
    localStorage.setItem("estoque", JSON.stringify(estoque));
    if (editando) {
        editando = false;
        produtoSelect.disabled = false;
    }
    carregarEstoque();
    exibirMensagem("mensagemRemovido");
}

function editarProduto(produto) {
    document.getElementById("produto").value = produto.codigo;
    document.getElementById("quantidade").value = produto.quantidade;
    document.getElementById("nomeFuncionario").value = produto.nomeFuncionario;
    document.getElementById("produto").disabled = true;
    editando = true;
}

function atualizarEstoque(codigoProduto, nomeProduto, quantidade, preco, nomeFuncionario, categoria) {
    const estoque = JSON.parse(localStorage.getItem("estoque")) || {};
    estoque[codigoProduto] = { nome: nomeProduto, codigo: codigoProduto, preco, quantidade, nomeFuncionario, categoria };
    localStorage.setItem("estoque", JSON.stringify(estoque));
    carregarEstoque();
}

formularioAdmin.addEventListener("submit", function (event) {
    event.preventDefault();
    const codigoProduto = produtoSelect.value;
    const dados = JSON.parse(localStorage.getItem("dados")) || [];
    const produtoInfo = dados.find(p => p.codigoProduto === codigoProduto);
    const nomeProduto = produtoInfo.nome;
    const preco = produtoInfo.preco;
    const quantidade = parseInt(document.getElementById("quantidade").value);
    const nomeFuncionario = document.getElementById("nomeFuncionario").value;
    const categoria = produtoInfo.categoria;  // Obtém a categoria do produto

    const estoque = JSON.parse(localStorage.getItem("estoque")) || {};

    if (!editando && estoque.hasOwnProperty(codigoProduto)) {
        exibirMensagem("mensagemErroEstoque");  
        formularioAdmin.reset();  
        return;  
    }

    if (editando) {
        atualizarEstoque(codigoProduto, nomeProduto, quantidade, preco, nomeFuncionario, categoria);
        exibirMensagem("mensagemEditado");
        editando = false;
        produtoSelect.disabled = false;
    } else {
        atualizarEstoque(codigoProduto, nomeProduto, quantidade, preco, nomeFuncionario, categoria);
        exibirMensagem("mensagemAdicionado");
    }

    formularioAdmin.reset();
});

function carregarCategorias() {
    const estoque = JSON.parse(localStorage.getItem("estoque")) || {};
    const categorias = new Set();

    Object.values(estoque).forEach(produto => categorias.add(produto.categoria));

    categoriasLista.innerHTML = '';
    categorias.forEach(categoria => {
        const categoriaDiv = document.createElement("div");
        categoriaDiv.innerHTML = `<button class="categoria-btn">${categoria}</button>`;
        categoriaDiv.querySelector(".categoria-btn").onclick = () => filtrarPorCategoria(categoria);
        categoriasLista.appendChild(categoriaDiv);
    });
}

function filtrarPorCategoria(categoria) {
    const estoque = JSON.parse(localStorage.getItem("estoque")) || {};
    const tabelaBody = document.querySelector("#tabelaAdmin tbody");
    tabelaBody.innerHTML = "";

    Object.values(estoque).forEach(produto => {
        if (produto.categoria === categoria) {
            const preco = parseFloat(produto.preco) || 0;
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${produto.nome}</td>
                <td>${produto.codigo}</td>
                <td>R$ ${produto.preco.toFixed(2)}</td>
                <td>${produto.quantidade}</td>
                <td>${produto.nomeFuncionario}</td>
                <td>${produto.categoria}</td>
                <td>
                    <button class="editar">Editar</button>
                    <button class="remover">Remover</button>
                </td>`;
            linha.querySelector(".remover").onclick = () => removerProdutoDoEstoque(produto.codigo);
            linha.querySelector(".editar").onclick = () => editarProduto(produto);
            tabelaBody.appendChild(linha);
        }
    });
}

window.onload = () => {
    carregarEstoque();
    carregarProdutosCriados();
    carregarCategorias();
};
