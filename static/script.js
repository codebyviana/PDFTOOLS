
const inputArquivos = document.getElementById("arquivos");
const listaArquivos = document.getElementById("lista-arquivos");
const botaoJuntar = document.querySelector(".botao-juntar");

let arquivosSelecionados = [];

inputArquivos.addEventListener("change", function () {

    arquivosSelecionados = Array.from(inputArquivos.files);

    listaArquivos.innerHTML = "";

    arquivosSelecionados.forEach(function (arquivo) {

        const item = document.createElement("div");
        item.classList.add("arquivo-item");

        const tamanho = (arquivo.size / 1024 / 1024).toFixed(2);

        item.textContent = `${arquivo.name} - ${tamanho} MB`;

        listaArquivos.appendChild(item);

    });

    botaoJuntar.disabled = arquivosSelecionados.length < 2;

    botaoJuntar.style.opacity =
        arquivosSelecionados.length >= 2 ? "1" : "0.5";

    botaoJuntar.style.cursor =
        arquivosSelecionados.length >= 2 ? "pointer" : "not-allowed";

});


botaoJuntar.addEventListener("click", async function () {

    if (arquivosSelecionados.length < 2) {
        return;
    }

    const formulario = new FormData();

    arquivosSelecionados.forEach(function (arquivo) {
        formulario.append("arquivos", arquivo);
    });

    botaoJuntar.disabled = true;
    botaoJuntar.textContent = "Juntando PDFs...";

    try {

        const resposta = await fetch("/juntar", {
            method: "POST",
            body: formulario
        });

        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.erro);
        }

        const pdf = await resposta.blob();
        const url = URL.createObjectURL(pdf);

        const link = document.createElement("a");
        link.href = url;
        link.download = "PDF_Final.pdf";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);

        botaoJuntar.textContent = "PDF gerado com sucesso!";

    } catch (erro) {

        alert(erro.message);
        botaoJuntar.textContent = "Juntar PDFs";

    } finally {

        botaoJuntar.disabled = false;

    }

});
