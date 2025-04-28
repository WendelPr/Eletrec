const dialogo = document.getElementById("abreDialog");
const fechar = document.getElementById("btnFechar");
const login = document.getElementById('login');

dialogo.onclick = function() {
    login.showModal();
};

fechar.onclick = function() {
    login.close();
};

const formLogin = document.querySelector('#login form');

let dadosUsuarios = [
    { nome: "Wendel", email: "wendel@email.com", senha: "positivo" },
    { nome: "Nycolas", email: "nycolas@email.com", senha: "1" },
];

formLogin.addEventListener('submit', evento => {
    evento.preventDefault();

    let msgErro = document.querySelector('.erro');
    if (msgErro) login.removeChild(msgErro);

    let email = document.getElementById('email').value;
    let senha = document.getElementById('senha').value;

    let usuarioValido = false;

    for (let usuario of dadosUsuarios) {
        if (email == usuario.email && senha == usuario.senha) {
            usuarioValido = true;
            sessionStorage.setItem('usuarioLogado', true);
            sessionStorage.setItem('nomeUsuario', usuario.nome);
            window.location.href = "./admin/admin.html";
            break;
        }
    }

    if (!usuarioValido) {
        let erro = document.createElement('p');
        erro.classList.add("erro");
        erro.innerText = "Login ou senha inválidos!";
        login.insertBefore(erro, login.firstChild);
        document.querySelector("#login form").reset();
    }
});





