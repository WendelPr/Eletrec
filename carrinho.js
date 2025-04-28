const formularioCarrinho = document.getElementById("formularioCarrinho");


function carregarProdutosEstoque() {
    const estoque = JSON.parse(localStorage.getItem("estoque")) || {}; 
    const produtoSelect = document.getElementById("produto");

    produtoSelect.innerHTML = `<option value="">Selecione</option>`;
    if (Object.keys(estoque).length === 0) {
        
        const option = document.createElement("option");
        option.value = "";
        produtoSelect.options[0].textContent = "Nenhum item no estoque";
        produtoSelect.appendChild(option);

        
  
        produtoSelect.disabled = true;
        quantidadeInput.disabled = true;

        
    }
    Object.keys(estoque).forEach(codigoProduto => {
        const produto = estoque[codigoProduto];
        const option = document.createElement("option");
        option.value = codigoProduto;
        option.textContent = produto.nome;
        produtoSelect.appendChild(option);
    });
}
/* */




function verificaEstoque(codigoProduto, quantidadeDesejada) {
    const estoque = JSON.parse(localStorage.getItem("estoque"));
    return estoque && estoque[codigoProduto] && estoque[codigoProduto].quantidade >= quantidadeDesejada;
}

function atualizarTabelaCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const tbody = document.querySelector("#tabelaCarrinho tbody");
    tbody.innerHTML = "";

    carrinho.forEach(produto => {
        const precoTotal = produto.preco * produto.quantidade;
        const novaLinha = document.createElement("tr");
        novaLinha.innerHTML = `
            <td>${produto.nome}</td>
            <td>${produto.codigoProduto}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>${produto.quantidade}</td>
            <td>R$ ${precoTotal.toFixed(2)}</td>
        `;
        tbody.appendChild(novaLinha);
    });
}

formularioCarrinho.addEventListener("submit", function (event) {
    event.preventDefault();

    const produtoSelect = document.getElementById("produto");
    const codigoProduto = produtoSelect.value;
    const quantidade = parseInt(document.getElementById("quantidade").value, 10);

    if (!verificaEstoque(codigoProduto, quantidade)) {
        document.getElementById("produtoJaAdicionado").style.display = 'block';
        setTimeout(() => {
            document.getElementById("produtoJaAdicionado").style.display = 'none';
        }, 3000);
        return;
    }

    const estoque = JSON.parse(localStorage.getItem("estoque"));
    const produtoEstoque = estoque[codigoProduto];
    const { nome, preco } = produtoEstoque;

    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const produtoExistente = carrinho.find(item => item.codigoProduto === codigoProduto);

    if (produtoExistente) {
        if (verificaEstoque(codigoProduto, produtoExistente.quantidade + quantidade)) {
            produtoExistente.quantidade += quantidade;
        } else {
            document.getElementById("produtoJaAdicionado").style.display = 'block';
            setTimeout(() => {
                document.getElementById("produtoJaAdicionado").style.display = 'none';
            }, 3000);
            return;
        }
    } else {
        carrinho.push({ codigoProduto, nome, preco, quantidade });
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    atualizarTabelaCarrinho();

    produtoSelect.selectedIndex = 0;
    document.getElementById("quantidade").value = 1;

    document.getElementById("produtoAdicionado").style.display = 'block';
    setTimeout(() => {
        document.getElementById("produtoAdicionado").style.display = 'none';
    }, 3000); 
});

document.getElementById("fimC").addEventListener("click", function() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    
    if (carrinho.length > 0) {
        const estoque = JSON.parse(localStorage.getItem("estoque"));

        carrinho.forEach(item => {
            if (estoque[item.codigoProduto]) {
                estoque[item.codigoProduto].quantidade -= item.quantidade;
                if (estoque[item.codigoProduto].quantidade <= 0) {
                    delete estoque[item.codigoProduto];
                }
            }
        });

        localStorage.setItem("estoque", JSON.stringify(estoque));
        document.getElementById("compraFinalizada").style.display = 'block';
        setTimeout(() => {
            document.getElementById("compraFinalizada").style.display = 'none';
        }, 3000);

        localStorage.removeItem("carrinho");
        atualizarTabelaCarrinho();
    } else {
        document.getElementById("carrinhoVazio").style.display = 'block';
        setTimeout(() => {
            document.getElementById("carrinhoVazio").style.display = 'none';
        }, 3000);
    }
});

document.getElementById("limparTabela").addEventListener("click", function () {
    document.querySelector("#tabelaCarrinho tbody").innerHTML = "";
    localStorage.removeItem("carrinho");
       
    document.getElementById("CarrinhoLimpo").style.display = 'block';
    setTimeout(() => {
    document.getElementById("CarrinhoLimpo").style.display = 'none'; }, 3000);
        
});

window.onload = function() {
    carregarCarrinho();
    carregarProdutosEstoque();
};

function carregarCarrinho() {
    atualizarTabelaCarrinho();
}
