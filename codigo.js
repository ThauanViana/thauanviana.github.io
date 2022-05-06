
    //Para facilitar a consulta neste código, utilize o seguinte sumário:
    //(só copiar do número até a primeira palavra)
//  1 - Objetos
//  2 - Importação as imagens utilizadas
//  3 - Menu principal
//  4 - Tela de seleção de fases
//  5 - Tela de nova fase
//  6 - Tela de game over
//  7 - Blocos de condições associadas aos cliques do mouse
//  8 - Desenho de todos elementos
//  9 - Movimento das nuvens
//  10 - Movimento da carriola
//  11 - Geração aleatória de boost
//  12 - Geração aleatória de cubos de vida
//  13 - Geração aleatória de penas
//  14 - Geração aleatória de pesos
//  15 - Geração aleatória de tijolos
//  16 - Desenho do score e objetivo
//  17 - Desenho da barra de vida, poder e peso
//  18 - Cálculo de FPS
//  19 - Função principal que engloba a linha do requestAnimationFrame


let canvas = document.getElementById("meuCanvas");
let ctx = canvas.getContext("2d")

//variáveis para fazer o cálculo com relação ao refresh rate do monitor
var fps, intervalo, startTime, agora, depois, tempoPassado;

//variável que guarda o valor da diferença dos framerate superiores a 60 ou inferiores
let ajuste2;

//varíável que guarda a pontuação durante o jogo para representá-la na tela de game over
let pontuacaoObtida;

//variável para determinar o fim do jogo
let fimDeJogo = false;

//variável que cria a pontuação durante o jogo
var pontuacao = 0;


////////////////pontuação objetivo das fases///////////////
let pontuacaoFase1 = 50;
let pontuacaoFase2 = 60;
let objetivoConcluido = false;

fps = 60 //coloque aqui o "refreshrate" do seu monitor - padrão 60hz
if(60/fps != 1){
    ajuste2 = 60/fps
}else{
    ajuste2 = 1;
}
let  ajusteParaFrameRate = 1.8*ajuste2 //parâmetro para ajustar a velocidade do jogo, já que eu fiz em 144hz, porém o padrão é 60hz.

//1 - OBJETOS
let chao = {
    x:0,
    y:canvas.height-50,         //chão
    largura: canvas.width+2,
    altura: 50
}
let carrinho = {
    x: canvas.width/2,
    y: canvas.height-(120+chao.altura),  //carrinho
    largura:140,
    altura:120,
    speed: 2*ajusteParaFrameRate,
    speedPadrao: 2*ajusteParaFrameRate,
    boost: 5*ajusteParaFrameRate,
    esquerda:false,
    direita:false
}

/* Caso queira fazer "peso" único
let pesoPesado = {
    x: 30 + Math.random()*canvas.width - 30,
    y: -20,
    largura:50,
    altura:50,
    velocidade: 1*ajusteParaFrameRate
}*/

let parede = {
    x:0,
    y:0,                        //parede de tijolos - fundo
    largura:canvas.width,
    altura: canvas.height-50
}
let nuvens = {
    x:canvas.width,
    y:0,
    largura:1000,                                //nuvens ao fundo
    altura:800,
    velocidade: 0.3*ajusteParaFrameRate
}
let barra_de_vida = {
    x:canvas.width*0.1,
    y:canvas.height -40,                //barra vermelha de vida
    larguraCheia:150,
    larguraDanificada: 150,
    altura:30,
    hit: 0,
    cor:'red',
    alerta:50
}
let barra_de_poder = {
    x:canvas.width*0.7,
    y:barra_de_vida.y,
    larguraDanificada:150,
    larguraCheia:150,                         //barra azul de poder
    altura:30,
    cor:'#4E8BDE'
}
let barra_de_peso_carregado = {
    x:canvas.width*0.4,
    y:barra_de_vida.y,
    larguraVazia: 0,
    larguraVaziaPadrao: 0,                  //barra colorida de peso
    larguraCheia: 150,
    altura: 30,
}

let iniciarJogo = {
    largura: 200,
    altura:50,
    get x(){
        return (canvas.width/2 - this.largura/2);   //botao de iniciar jogo
    },
    get y(){
        return (canvas.height/2 + this.altura/2);
    }
}
let fundoTelaDeFases = {
    x:20,
    y:20,
    largura: (canvas.width-40),             //fundo da tela de seleção de fases
    altura: (canvas.height - 40)
}
let telaGameOver = {
    larguraTentar:150,
    alturaTentar: 40,
    larguraMenu:75,
    alturaMenu:40,                          //configurações da tela de game over
    yTentar: (canvas.height/2) + 40,
    yMenu: (canvas.height/2) + 90,
    get xTentar(){
        return (canvas.width/2 - this.larguraTentar/2);
    },
    get xMenu(){
        return (canvas.width/2 - this.larguraMenu/2);
    },
}
//variáveis para capturar os cliques do mouse
let x_mouse;
let y_mouse;

////////2 - importação das imagens utilizadas
let imagem_carrinhoDireita = new Image();
imagem_carrinhoDireita.src = 'carrinhodemaodireita.png'; //carrinho esquerda

let imagem_carrinhoEsquerda = new Image ();
imagem_carrinhoEsquerda.src = 'carrinhodemaoesquerda.png' //carrinho direita

let imagem_tijolo1 = new Image();
imagem_tijolo1.src = 'tijolo1.png'; //tijolo

let imagem_peso = new Image();
imagem_peso.src = 'pesopesado.png'; //peso

let imagem_boost = new Image();
imagem_boost.src = 'boost.png';     //"boost" - balão de poder

let imagem_pena = new Image();
imagem_pena.src = 'pena2.png'   // pena - reduzir o peso

let imagem_chao = new Image();
imagem_chao.src = 'chao.png';   // chao

let imagem_cura = new Image();
imagem_cura.src = 'cura.png';

let imagem_parede = new Image();
imagem_parede.src = 'paredeintacta.png';    //parede padrão

let imagem_parede1 = new Image();
imagem_parede1.src = 'parede1.png';
let imagem_parede2 = new Image();
imagem_parede2.src = 'parede2.png';
let imagem_parede3 = new Image();
imagem_parede3.src = 'parede3.png';
let imagem_parede4 = new Image();
imagem_parede4.src = 'parede4.png';
let imagem_parede5 = new Image();
imagem_parede5.src = 'parede5.png';
let imagem_parede6 = new Image();
imagem_parede6.src = 'parede6.png';
let imagem_parede7 = new Image();
imagem_parede7.src = 'parede7.png';
let imagem_parede8 = new Image();
imagem_parede8.src = 'parede8.png'; //parede completamente destruída

let imagem_nuvens = new Image();    //nuvens ao fundo
imagem_nuvens.src = 'nuvens.png';




//Bloco que captura as teclas pressionadas
let teclas = {}
document.addEventListener('keydown',function(evento){
    teclas[evento.keyCode] = true;
})

document.addEventListener('keyup',function(evento){
    delete teclas[evento.keyCode];
})


let menu;
// 3 - Menu principal
function mainMenu(){
    menu = true
    ctx.fillStyle = 'blue';
    ctx.fillRect(iniciarJogo.x,iniciarJogo.y,iniciarJogo.largura,iniciarJogo.altura);
    ctx.fillStyle = "white";
    ctx.font = "25px IM Fell English SC";
    ctx.textAlign="center";
    ctx.textBaseline = "middle";
    ctx.fillText("Iniciar jogo ",iniciarJogo.x + (iniciarJogo.largura/2), iniciarJogo.y + (iniciarJogo.altura/2));

    ctx.font = "150px Festive";
    ctx.fillText("Wheel", canvas.width/2,canvas.height/2-170);
    ctx.fillText("Barrow", canvas.width/2,canvas.height/2-70);

}

// 4 - TELA DE SELEÇÃO DE FASES - inicio - parametros para a matriz da tela de seleção de fases
let fasesHorizontal = 3;
let fasesVerticais = 4;
let faseLargura = 150;
let faseAltura = 150;
let espacoEntreFases = 15;
let espacoEsquerda = (fundoTelaDeFases.largura - (faseLargura*fasesVerticais + (espacoEntreFases*(fasesVerticais-1))))/2;
let espacoCima = 120;

let fases = [];
let listaFases = [];
//fim - parametros para a matriz da tela de seleção de fases
function telaDeFases(){

    //Quantidade de fases feitas
    let fasesFeitas = 2

    //retângulo fundo da tela de seleção de fases
    ctx.fillStyle = 'dark blue';
    ctx.globalAlpha = 0.3;
    ctx.fillRect(fundoTelaDeFases.x,fundoTelaDeFases.y,fundoTelaDeFases.largura,fundoTelaDeFases.altura);
    ctx.globalAlpha = 1;

    //título da tela de seleção de fases
    ctx.fillStyle = "black";
    ctx.font = "65px IM Fell English SC";
    ctx.textAlign="center";
    ctx.textBaseline = 'middle';
    ctx.fillText("Seleção de fases ",fundoTelaDeFases.x + (fundoTelaDeFases.largura/2), 70);


    //criação dos elementos que compõem a tela de fases
    for(let c = 0; c < fasesVerticais; c++){
        let fasesL = [];
        for(let l = 0; l < fasesHorizontal; l++){
            let numeroCada = 0;
            numeroCada = 1;
            fasesL.push ({x:0, y:0, completado: false, numero:numeroCada});
            fases.push(fasesL);
        }
    }

    let contaLinha = 0;// - parâmetro utilizado para contar e escrever o número em cada retângulo da tela de fases
    let contaColuna = 0;// - parâmetro utilizado para contar e escrever o número em cada retângulo da tela de fases


    //Criação da matriz que dá origem à tela de seleção de fases
    for(let c = 0; c < fasesVerticais; c++){
        contaLinha += 1;
        contaColuna = contaLinha;
        for(let l = 0; l < fasesHorizontal; l++){
            let faseX = c * (faseLargura + espacoEntreFases) + espacoEsquerda + fundoTelaDeFases.x;
            let faseY = l * (faseAltura + espacoEntreFases) +  espacoCima + fundoTelaDeFases.x;
            fases[c][l].x = faseX;
            fases[c][l].y = faseY;
            if(contaColuna <= fasesFeitas){
                ctx.fillStyle = "red";
            }
            else{
                ctx.fillStyle = "gray";

            }
            ctx.fillRect(faseX, faseY,faseLargura,faseAltura);
            listaFases.push({x: faseX, y:faseY, largura: faseLargura, altura: faseAltura});
            ctx.fillStyle = "white";
            ctx.font = "30px Arial";
            ctx.textAlign="center";
            ctx.textBaseline = 'middle';
            ctx.fillText(contaColuna ,faseX + (faseLargura/2), faseY + (faseAltura/2));
            if(contaColuna >fasesFeitas){
                ctx.fillStyle = "black";
                ctx.font = "17px Arial";
                ctx.fillText("Em construção", faseX + (faseLargura/2), faseY + (faseAltura/2) + 40 );
            }
            contaColuna += 5
        }
    }
    jogando = false;
}

//5 - Tela de nova fase
function novaFase(){
    if (objetivoConcluido === true){

        //Chama todas funções que devem permanecer na tela de nova fase
        desenharElementos();
        movimentoCarrinho();
        desenharTijolos();
        barrasVidaEPoder();

        //Desenho "deseja prosseguir"
        ctx.fillStyle = "black";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = "70px Arial";
        if(objetivoConcluido === true){
            ctx.fillText('Objetivo concluído!', canvas.width / 2, (canvas.height - chao.altura) / 2 - 50);
            ctx.font = "35px Arial";
            ctx.fillText('Deseja prosseguir para a próxima fase ou para o menu?', canvas.width / 2, canvas.height / 2);
        }



        //Botão próxima fase
        ctx.fillStyle = 'gray';
        ctx.fillRect(telaGameOver.xTentar, telaGameOver.yTentar, telaGameOver.larguraTentar, telaGameOver.alturaTentar);
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = "20px Arial";
        ctx.fillText('Próxima Fase', telaGameOver.xTentar + telaGameOver.larguraTentar / 2, telaGameOver.yTentar + telaGameOver.alturaTentar / 2);

        //"Menu" na tela de nova fase
        ctx.fillStyle = 'gray';
        ctx.fillRect(telaGameOver.xMenu, telaGameOver.yMenu, telaGameOver.larguraMenu, telaGameOver.alturaMenu);
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = "20px Arial";
        ctx.fillText('Menu', telaGameOver.xMenu + telaGameOver.larguraMenu / 2, telaGameOver.yMenu + telaGameOver.alturaMenu / 2);

    }
}

//6 - Tela de game over
function gameover(){

    if(fimDeJogo === true) {
        //Chama todas funções que devem permanecer na tela de gameover
        desenharElementos();
        movimentoCarrinho();
        desenharTijolos();
        barrasVidaEPoder();

        //"Game over" e "Pontuação obtida" na tela de game over
        ctx.fillStyle = "black";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = "45px Arial";
        if(fimDeJogo === true){
            ctx.fillText('Pontuação obtida:' + pontuacaoObtida, canvas.width / 2, (canvas.height - chao.altura) / 2 - 50);
            ctx.font = "70px Arial";
            ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
        }



        //"Tentar de novo" na tela de game over
        ctx.fillStyle = 'gray';
        ctx.fillRect(telaGameOver.xTentar, telaGameOver.yTentar, telaGameOver.larguraTentar, telaGameOver.alturaTentar);
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = "20px Arial";
        ctx.fillText('Tentar de novo', telaGameOver.xTentar + telaGameOver.larguraTentar / 2, telaGameOver.yTentar + telaGameOver.alturaTentar / 2);

        //"Menu" na tela de game over
        ctx.fillStyle = 'gray';
        ctx.fillRect(telaGameOver.xMenu, telaGameOver.yMenu, telaGameOver.larguraMenu, telaGameOver.alturaMenu);
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = "20px Arial";
        ctx.fillText('Menu', telaGameOver.xMenu + telaGameOver.larguraMenu / 2, telaGameOver.yMenu + telaGameOver.alturaMenu / 2);

    }
}


//7 - Blocos de condições associadas aos cliques do mouse
//Variáveis que serão utilizadas no próximo bloco
let jogando = false;
let encherBarras = false;   //Reset das barras
let fase;       //Guardar o valor da fase em questão

//Bloco que adiciona interação do clique do mouse no código
addEventListener('click',function(evento){
    rect = canvas.getBoundingClientRect();
    x_mouse = Math.round(evento.clientX - rect.left);
    y_mouse = Math.round(evento.clientY - rect.top);


    //Iniciar jogo da tela do menu principal
    if ((x_mouse) >= iniciarJogo.x && (y_mouse) >= iniciarJogo.y && (x_mouse) <= (iniciarJogo.x + iniciarJogo.largura) && (y_mouse) <= (iniciarJogo.y + iniciarJogo.altura) && jogando === false  && menu === true){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        duracaoPena = 0;
        duracaoBoost = 0;
        duracaoVida = 0;
        jogando = false;
        fase = 0;
        menu = false;
        telaDeFases();

    }

    //Bloco que acessa a próxima fase ao clicar em "Próxima" na tela de nova fase
    if(objetivoConcluido === false){
        if ((x_mouse) >= telaGameOver.xTentar+2 && (y_mouse) >= telaGameOver.yTentar+2 && (x_mouse) <= (telaGameOver.xTentar + telaGameOver.larguraTentar+1) && (y_mouse) <= (telaGameOver.yTentar + telaGameOver.alturaTentar+2) && jogando === false && fimDeJogo === true){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            duracaoPena = 0;
            duracaoBoost = 0;
            duracaoVida = 0;
            jogando = true;
            encherBarras = true;
            fimDeJogo = false;
            boostFunciona = true;
            gerarTijolos(fase)

        }

        //Bloco que acessa o menu pela tela de nova fase
        if ((x_mouse) >= telaGameOver.xMenu+2 && (y_mouse) >= telaGameOver.yMenu+2 && (x_mouse) <= (telaGameOver.xMenu + telaGameOver.larguraMenu+1) && (y_mouse) <= (telaGameOver.yMenu + telaGameOver.alturaMenu+2) && jogando === false && fimDeJogo === true){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            duracaoPena = 0;
            duracaoBoost = 0;
            duracaoVida = 0;
            jogando = false;
            fimDeJogo = false;
            menu = true;
            mainMenu();


        }

    }

    //Bloco que acessa a fase de novo "tentar de novo" na tela de game over
    if ((x_mouse) >= telaGameOver.xTentar+2 && (y_mouse) >= telaGameOver.yTentar+2 && (x_mouse) <= (telaGameOver.xTentar + telaGameOver.larguraTentar+1) && (y_mouse) <= (telaGameOver.yTentar + telaGameOver.alturaTentar+2) && jogando === false && objetivoConcluido === true){
        fase = "fase 2";
        ctx.clearRect(0,0,canvas.width,canvas.height);
        duracaoPena = 0;
        duracaoBoost = 0;
        duracaoVida = 0;
        jogando = true;
        objetivoConcluido = false;
        vidaReset = true;
        pesoReset = true;
        encherBarras = true;
        boostFunciona = true;
        gerarTijolos(fase)
    }

    //Bloco que acessa o menu pela tela de Game over
    if ((x_mouse) >= telaGameOver.xMenu+2 && (y_mouse) >= telaGameOver.yMenu+2 && (x_mouse) <= (telaGameOver.xMenu + telaGameOver.larguraMenu+1) && (y_mouse) <= (telaGameOver.yMenu + telaGameOver.alturaMenu+2) && jogando === false && objetivoConcluido === true){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        duracaoPena = 0;
        duracaoBoost = 0;
        duracaoVida = 0;
        jogando = false;
        objetivoConcluido = false;
        fimDeJogo = false;
        menu = true;
        mainMenu();

    }

    if(menu === false){

        //Bloco que acessa a fase 1
        if (x_mouse >= listaFases[0].x && x_mouse <= listaFases[0].x + listaFases[0].largura && y_mouse >= listaFases[0].y && y_mouse <= listaFases[0].y + listaFases[0].altura && jogando === false){
            fase = "fase 1";
            duracaoPena = 0;
            duracaoBoost = 0;
            duracaoVida = 0;
            jogando = true;
            boostFunciona = true;
            gerarTijolos(fase);
            gameover(fase);

        }

        //Bloco que acessa a fase 2
        if (x_mouse >= listaFases[3].x && x_mouse <= listaFases[3].x + listaFases[3].largura && y_mouse >= listaFases[3].y && y_mouse <= listaFases[3].y + listaFases[3].altura && jogando === false){
            fase = "fase 2";
            duracaoPena = 0;
            duracaoBoost = 0;
            duracaoVida = 0;
            jogando = true;
            boostFunciona = true;
            gerarTijolos(fase);
            gameover(fase);


        }
    }

})





//8 - Desenho de todos elementos
//Desenho de todos elementos
function desenharElementos(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    //Desenho das nuvens
    ctx.drawImage(imagem_nuvens, nuvens.x, nuvens.y, nuvens.largura, nuvens.altura);
    movimentoNuvens();



    //Desenho das paredes de fundo
    if(atualizacaoBackground <= 400 && fimDeJogo === false){
        ctx.drawImage(imagem_parede,parede.x,parede.y,parede.largura,parede.altura);
    }else if(atualizacaoBackground > 400 && atualizacaoBackground <= 700){
        ctx.drawImage(imagem_parede1,parede.x,parede.y,parede.largura,parede.altura);
    }else if (atualizacaoBackground > 700&& atualizacaoBackground <= 1000){
        ctx.drawImage(imagem_parede2,parede.x,parede.y,parede.largura,parede.altura);
    }else if(atualizacaoBackground > 1000 && atualizacaoBackground <= 1300){
        ctx.drawImage(imagem_parede3,parede.x,parede.y,parede.largura,parede.altura);
    }else if(atualizacaoBackground > 1300 && atualizacaoBackground <= 1500){
        ctx.drawImage(imagem_parede4,parede.x,parede.y,parede.largura,parede.altura);
    }else if(atualizacaoBackground > 1500 && atualizacaoBackground <= 1750){
        ctx.drawImage(imagem_parede5,parede.x,parede.y,parede.largura,parede.altura);
    }else if(atualizacaoBackground > 1750 && atualizacaoBackground <= 2000){
        ctx.drawImage(imagem_parede6,parede.x,parede.y,parede.largura,parede.altura);
    }else if(atualizacaoBackground > 2000 && atualizacaoBackground <= 2250){
        ctx.drawImage(imagem_parede7,parede.x,parede.y,parede.largura,parede.altura);
    }else if (atualizacaoBackground > 2250 || fimDeJogo === true){
        ctx.drawImage(imagem_parede8,parede.x,parede.y,parede.largura,parede.altura);
    }

    //Desenho do carrinho
    if (carrinho.esquerda === false && carrinho.direita === true){
        ctx.drawImage(imagem_carrinhoDireita, carrinho.x, carrinho.y, carrinho.largura, carrinho.altura);
    }else{
        ctx.drawImage(imagem_carrinhoEsquerda, carrinho.x, carrinho.y, carrinho.largura, carrinho.altura);
    }

    //Desenho do chão
    ctx.drawImage(imagem_chao,chao.x,chao.y,chao.largura,chao.altura);

}

//9 - Movimento das nuvens
function movimentoNuvens(){
    nuvens.x -= nuvens.velocidade;
    if (nuvens.x < 0-nuvens.largura){
        nuvens.x = canvas.width
        nuvens.y += 20;
        if(nuvens.y == canvas.width/2){
            nuvens.y = 0;
        }
    }
}

//10 - Movimento da carriola
//Variáveis usadas no próximo bloco
let boostSegundo = 0;           //Determina a responsividade da barra de boost e o tempo pressionando o botão de boost
let boostFunciona = true;       //Limita o uso do boost
let pause = false;              //Pausar o jogo

function movimentoCarrinho() {
    //Movimento do carrinho para a esquerda
    if (65 in teclas) {
        carrinho.x -= carrinho.speed;
        carrinho.direita = false;
        carrinho.esquerda = true;
    }

    //Movimento do carrinho para direita
    if (68 in teclas) {
        carrinho.x += carrinho.speed;
        carrinho.direita = true;
        carrinho.esquerda = false;
    }




    //Bloco para utilizar o boost como shift e limitar o uso dele caso a barra de boost esteja vazia
    if (barra_de_poder.larguraDanificada > 0 && boostFunciona === true){
        if (16 in teclas && 68 in teclas) {
            carrinho.x += carrinho.boost
            boostSegundo += 1;
            if (boostSegundo > 20) {
                boostSegundo = 0;
                barra_de_poder.larguraDanificada -= 5;
            }
        } else if (16 in teclas && 65 in teclas) {
            carrinho.x -= carrinho.boost;
            if (barra_de_poder.larguraDanificada > 0) {
                boostSegundo += 1;
                if (boostSegundo > 20) {
                    boostSegundo = 0;
                    barra_de_poder.larguraDanificada -= 5;
                }
            }
        }
    }
    //Bloco para travar o uso do boost e escrever na tela "Muito Peso!"
    if(boostFunciona === false && (16 in teclas && 68 in teclas  || 16 in teclas && 65 in teclas)){
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.fillStyle = "red";
        ctx.font = "50px Arial";
        ctx.textAlign="center";
        ctx.textBaseline = 'middle';
        if(fimDeJogo == false && objetivoConcluido == false){
            ctx.fillText("Muito peso!" ,canvas.width/2, canvas.height/2);
            ctx.strokeText("Muito peso!" ,canvas.width/2, canvas.height/2);
        }
        ctx.lineWidth = 1;
    }

    //Limitar o carrinho dentro do canvas
    if (carrinho.x <= 0) {
        carrinho.x = 0
    }
    if (carrinho.x + carrinho.largura >= (canvas.width)) {
        carrinho.x = (canvas.width) - carrinho.largura;
    }
}


//11 - Geração aleatória de boost
function gerarBoosts(){
    this.speedY = 1*ajusteParaFrameRate;
    this.speedX = 1*ajusteParaFrameRate;
    this.x = 0 + Math.random()*60;
    this.y = -15
    this.largura = 70;
    this.altura = 35;
    this.velocidade = 1.5*ajusteParaFrameRate;
    this.paraDireita =  false;
    this.enchePoder =  false;
    this.aumentoDePoder = 75;
    this.tempoGeraBoost = 1000;
}


variosBoost = []  //acomodar boost gerados em uma lista
for (let item = 0; item < 1; item ++){          // gerar apenas 1
    variosBoost.push( new gerarBoosts() );
}



//Todas variáveis que serão utilizadas no bloco seguinte
let duracaoBoost = 0;
let fimBoostY = false;
let boostReset = false;
let atualizacaoBrowser = 0;
let atualizacaoBackground = 0

//Função que determina todo comportamento dinâmico do boost
function movimentoBoost(){
    for(var i = 0; i < variosBoost.length; i++){
        var boost = variosBoost[i]
        if(jogando === true){

            //Incremento nos parâmetros responsáveis pela atualização do jogo e padronização para outros PCs
            atualizacaoBackground += 1;
            atualizacaoBrowser += 1;
            if (atualizacaoBrowser > 1200){
                atualizacaoBrowser = 0;
            }
            //Limitar o boost em função do tempo
            if (atualizacaoBrowser > boost.tempoGeraBoost && atualizacaoBrowser < boost.tempoGeraBoost+100 || boost.y > 5) {
                duracaoBoost += 1;
                if (duracaoBoost > 1000) {
                    boost.y = -20;
                    duracaoBoost = 0;
                    new gerarBoosts();
                }
                ctx.shadowBlur = 20;
                ctx.shadowColor = 'blue';                                       //Desenho do boost
                ctx.drawImage(imagem_boost, boost.x, boost.y, boost.largura,
                    boost.altura);
                ctx.shadowBlur = 0;

                if (boost.y < (canvas.height - boost.altura - chao.altura + 1)) {   //Movimento em Y e X do boost
                    boost.y += boost.velocidade * boost.speedY;
                    boost.speedY = 1*ajusteParaFrameRate;
                    boost.speedX = 1*ajusteParaFrameRate;
                    fimBoostY = false;
                    boost.velocidade = 1*ajusteParaFrameRate;
                } else {
                    boost.speedY = 0;                                   //Boost toca o chão
                    fimBoostY = true;
                }

                if (boost.x >= (canvas.width - boost.largura)) {        //Boost bate na parede direita
                    boost.paraDireita = false;
                }
                if (boost.x <= 0) {                         //Boost bate na parede esquerda
                    boost.paraDireita = true;
                }

                if (boost.paraDireita === false) {              //Bloco que muda a trajetoria do boost quando ele bate na parede direita
                    boost.speedX = -1;
                    boost.x += boost.velocidade * boost.speedX;
                }
                if (boost.paraDireita === true) {                   //Bloco que mostra a trajetoria do boost quando ele está indo para a direita
                    boost.speedX = 1;
                    boost.x += boost.velocidade * boost.speedX;
                }
                if (fimBoostY === true) {                           //Bloco para alterar a velocidade do boost quando toca o chão
                    boost.velocidade = 0.5 * ajusteParaFrameRate;
                }

                if (boost.y === -20) {      //Bloco para assegurar o reset na tela de game over
                    boostReset = true;
                }


                //colisão carrinho indo para a esquerda
                if (carrinho.esquerda === true && carrinho.direita === false && boost.y >= canvas.height - carrinho.altura - chao.altura + 10 && boost.y <= canvas.height - chao.altura && boost.x >= (carrinho.x - 30) && boost.x <= carrinho.x + (carrinho.largura - 40) && barra_de_poder.larguraDanificada < 150) {
                    boost.speedY = 0;
                    boost.enchePoder = true;        //todo o reset do boost
                    boost.y = -20;
                    duracaoBoost = 0;


                    // bloco que enche a barra de poder em função do boost
                    if (boost.enchePoder === true) {
                        if (barra_de_poder.larguraDanificada + boost.aumentoDePoder > barra_de_poder.larguraCheia) {
                            barra_de_poder.larguraDanificada = barra_de_poder.larguraCheia;
                        } else {
                            barra_de_poder.larguraDanificada += boost.aumentoDePoder;
                        }
                    }
                }

                //colisão carrinho para a direita
                if (carrinho.esquerda === false && carrinho.direita === true && boost.y >= canvas.height - carrinho.altura - chao.altura + 10 && boost.y <= canvas.height - chao.altura && boost.x >= (carrinho.x +15) && boost.x <= carrinho.x + (carrinho.largura - 20) && barra_de_poder.larguraDanificada < 150) {
                    boost.speedY = 0;
                    boost.enchePoder = true;
                    boost.y = -20;
                    duracaoBoost = 0;
                    if (boost.enchePoder === true) {
                        if (barra_de_poder.larguraDanificada + boost.aumentoDePoder > barra_de_poder.larguraCheia) {
                            barra_de_poder.larguraDanificada = barra_de_poder.larguraCheia;
                        } else {
                            barra_de_poder.larguraDanificada += boost.aumentoDePoder;
                        }
                    }
                }

                //Bloco para gerar um boost com características novas (x,y)
                if (boost.y === -20) {
                    new gerarBoosts();

                }
            }
        }else{
            boost.y = -15 //Reset do boost na tela de game over
        }
    }
}
//12 - Geração aleatória de cubos de vida
//Função que gera cubo de vida
function gerarVida(){
    this.speedY = 1*ajusteParaFrameRate;
    this.speedX = 1*ajusteParaFrameRate;
    this.x = 0 + Math.random()*60;
    this.y = -15
    this.largura = 50;
    this.altura = 50;
    this.velocidade = 1.5*ajusteParaFrameRate;
    this.paraDireita =  false;
    this.aumentoDeVida = 50;
    this.tempoGeraVida = 500;
}

variasVidas = []  //acomodar vidas geradas em uma lista
for (let item = 0; item < 1; item ++){          // gerar apenas 1
    variasVidas.push( new gerarVida() );
}
let duracaoVida = 0;
let fimVidaY = false;
let vidaReset = false;


//Função que determina todo comportamento dinâmico do boost
function movimentoVida(){
    for(var i = 0; i < variasVidas.length; i++){
        var vida = variasVidas[i]
        if(jogando === true){

            //Limitar a vida em função do tempo
            if (atualizacaoBrowser > vida.tempoGeraVida && atualizacaoBrowser < vida.tempoGeraVida+100 || vida.y > 5) {
                duracaoVida += 1;
                if (duracaoVida > 1000) {
                    vida.y = -20;
                    duracaoVida = 0;
                    new gerarVida();
                }
                ctx.shadowBlur = 20;
                ctx.shadowColor = 'red';                                       //Desenho da vida
                ctx.drawImage(imagem_cura, vida.x, vida.y, vida.largura,
                    vida.altura);
                ctx.shadowBlur = 0;

                if (vida.y < (canvas.height - vida.altura - chao.altura + 1)) {   //Movimento em Y e X da vida
                    vida.y += vida.velocidade * vida.speedY;
                    vida.speedY = 1*ajusteParaFrameRate;
                    vida.speedX = 1*ajusteParaFrameRate;
                    fimVidaY = false;
                    vida.velocidade = 1*ajusteParaFrameRate;
                } else {
                    vida.speedY = 0;                                   //Vida toca o chão
                    fimVidaY = true;
                }

                if (vida.x >= (canvas.width - vida.largura)) {        //Vida bate na parede direita
                    vida.paraDireita = false;
                }
                if (vida.x <= 0) {                         //Vida bate na parede esquerda
                    vida.paraDireita = true;
                }

                if (vida.paraDireita === false) {              //Bloco que muda a trajetoria da vida quando ela bate na parede direita
                    vida.speedX = -1;
                    vida.x += vida.velocidade * vida.speedX;
                }
                if (vida.paraDireita === true) {                   //Bloco que mostra a trajetoria da vida quando ela está indo para a direita
                    vida.speedX = 1;
                    vida.x += vida.velocidade * vida.speedX;
                }
                if (fimVidaY === true) {                           //Bloco para alterar a velocidade da vida quando toca o chão
                    vida.velocidade = 0.5 * ajusteParaFrameRate;
                }

                if (vidaReset === true) {      //Bloco para assegurar o reset na tela de game over
                    vida.y = -20;
                }
                vidaReset = false;

                //colisão carrinho indo para a esquerda
                if (carrinho.esquerda === true && carrinho.direita === false && vida.y >= canvas.height - carrinho.altura - chao.altura - 5 && vida.y <= canvas.height - chao.altura && vida.x >= (carrinho.x - 20) && vida.x <= carrinho.x + (carrinho.largura - 30) && barra_de_vida.larguraDanificada < 150) {
                    vida.speedY = 0;
                    vida.enchePoder = true;        //todo o reset da vida
                    vida.y = -20;
                    duracaoVida = 0;


                    // bloco que enche a barra de vida em função da vida
                    if (vida.enchePoder === true) {
                        if (barra_de_vida.larguraDanificada + vida.aumentoDeVida > barra_de_vida.larguraCheia) {
                            barra_de_vida.larguraDanificada = barra_de_vida.larguraCheia;
                        } else {
                            barra_de_vida.larguraDanificada += vida.aumentoDeVida;
                        }
                    }
                }

                //colisão carrinho para a direita
                if (carrinho.esquerda === false && carrinho.direita === true && vida.y >= canvas.height - carrinho.altura - chao.altura - 5 && vida.y <= canvas.height - chao.altura && vida.x >= (carrinho.x +5) && vida.x <= carrinho.x + (carrinho.largura-10) && barra_de_vida.larguraDanificada < 150) {
                    vida.speedY = 0;
                    vida.enchePoder = true;
                    vida.y = -20;
                    duracaoVida = 0;
                    if (vida.enchePoder === true) {
                        if (barra_de_vida.larguraDanificada + vida.aumentoDeVida > barra_de_vida.larguraCheia) {
                            barra_de_vida.larguraDanificada = barra_de_vida.larguraCheia;
                        } else {
                            barra_de_vida.larguraDanificada += vida.aumentoDeVida;
                        }
                    }
                }

                //Bloco para gerar um boost com características novas (x,y)
                if (vida.y === -20) {
                    new gerarVida();

                }
            }
        }else{
            vida.y = -15 //Reset do boost na tela de game over
        }
    }
}

//13 - Geração aleatória de penas
//Função para gerar cada pena
function gerarPena(){
    this.speedY = 1*ajusteParaFrameRate;
    this.speedX = 1*ajusteParaFrameRate;
    this.x = canvas.width/2;
    this.y = -15;
    this.largura = 70;
    this.altura = 50;
    this.velocidade = 2*ajusteParaFrameRate;
    this.paraEsquerda =  false;
    this.reduzPeso = false;
    this.reduzBarraDePeso = 100;
    this.velocidadeX = 0.05;
    this.radianos = 0;
    this.tempoPena = 600;
}

variasPenas = []; //acomodar as penas geradas
for (let pena = 0; pena < 1; pena++){
    variasPenas.push( new gerarPena() );
}
let fimPenaY = false;           //variável de quando a pena atinge o chão
let duracaoPena = 0;            // contagem do tempo da pena dentro do mapa

//Função para todo o movimento da pena
function movimentoPena() {

    //"FOR" para tratar a criação do elemento pena, no momento só há um, mas caso queira aumentar
    for (let i = 0; i < variasPenas.length; i++) {

        var pena = variasPenas[i];   //linha que altera o nome do elemento em í para "pena", para ficar mais fácil o manuseio


        if(jogando === true) {

            //Bloco que limita a criação da pena em função do tempo
            if (atualizacaoBrowser > pena.tempoPena && atualizacaoBrowser < (pena.tempoPena + 100) || pena.y > 5) {


                //Bloco para duração da pena dentro do mapa
                duracaoPena += 1;
                if (duracaoPena > 800) {
                    pena.y = -20;
                    duracaoPena = 0;
                    new gerarPena();
                }

                //Desenho da pena
                ctx.shadowBlur = 30;
                ctx.shadowColor = 'white';
                ctx.drawImage(imagem_pena, pena.x, pena.y, pena.largura, pena.altura);
                ctx.shadowBlur = 0;

                //Movimento em Y da pena
                if (pena.y < (canvas.height - pena.altura - chao.altura + 1)) {
                    pena.y += (pena.velocidade * pena.speedY);
                    pena.speedY = 1;
                    fimPenaY = false;
                    pena.velocidade *= 1;


                //Bloco que reseta os parâmetros da pena quando ela toca o chão
                } else {
                    pena.speedY = 0;
                    pena.speedX = 0.5;
                    fimPenaY = true;
                    pena.paraEsquerda = false;
                }


                //Blocos para criar o movimento circular da pena em X
                if(fimPenaY === false){
                    pena.radianos += pena.velocidadeX*pena.speedX;
                }else{
                    pena.velocidadeX = 0;
                }
                if (pena.x >= 0 && pena.x <= canvas.width - pena.largura){
                    pena.x += Math.cos(pena.radianos)*8*pena.speedX;
                    if(pena.x == canvas.width - pena.largura && pena.y == canvas.height/2){
                        pena.paraEsquerda = true;
                    }
                }else{
                    pena.radianos *= -1;
                }

                if(pena.paraEsquerda == true){
                    pena.x -= 1;
                }

                //colisão com o carrinho indo para a esquerda
                    if (carrinho.esquerda === true && carrinho.direita === false && pena.y >= canvas.height - carrinho.altura - chao.altura && pena.y <= canvas.height - chao.altura && pena.x >= (carrinho.x - 30) && pena.x <= carrinho.x + (carrinho.largura - 40) && barra_de_peso_carregado.larguraVazia > 0) {
                        pena.speedY = 0;
                        pena.reduzPeso = true;
                        pena.y = -20;                       //Se pegar a pena, reseta todos parâmetros
                        pena.x = canvas.width/2;
                        pena.velocidadeX = 0.05;
                        duracaoPena = 0;
                        boostFunciona = true;
                        //Bloco que impede que a barra de peso fique menor que o padrão
                        if (pena.reduzPeso === true) {
                            if (barra_de_peso_carregado.larguraVazia - pena.reduzBarraDePeso < barra_de_peso_carregado.larguraVaziaPadrao) {
                                barra_de_peso_carregado.larguraVazia = barra_de_peso_carregado.larguraVaziaPadrao;

                                //bloco que reduz o tamanho da barra de peso em função da pena
                            } else {
                                barra_de_peso_carregado.larguraVazia -= pena.reduzBarraDePeso;
                            }
                        }

                        //colisão da pena com o carrinho indo para a direita
                    } if(carrinho.esquerda === false && carrinho.direita === true && pena.y >= canvas.height - carrinho.altura - chao.altura && pena.y <= canvas.height - chao.altura && pena.x >= (carrinho.x - 30) && pena.x <= carrinho.x + (carrinho.largura - 40) && barra_de_peso_carregado.larguraVazia > 0) {
                        pena.speedY = 0;
                        pena.reduzPeso = true;
                        pena.y = -20;
                        pena.x = canvas.width/2;
                        pena.velocidadeX = 0.05;
                        duracaoPena = 0;
                        boostFunciona = true;
                        if (pena.reduzPeso === true) {   // Mesma coisa que o do lado esquerdo
                            if (barra_de_peso_carregado.larguraVazia - pena.reduzBarraDePeso < barra_de_peso_carregado.larguraVaziaPadrao) {
                                barra_de_peso_carregado.larguraVazia = barra_de_peso_carregado.larguraVaziaPadrao;
                            } else {
                                barra_de_peso_carregado.larguraVazia -= pena.reduzBarraDePeso;
                            }
                        }
                    }
            }
        }else{
            pena.y = -15;  //Se jogando = false, pena não aparece (reset dela no game over)
        }
    }
}

//14 - Geração aleatória de pesos
let pesoLarguraAtual;
let pesoAlturaAtual;
//Função "objeto" que cria cada peso
function pesoAleatorio(){
    this.largura = 50;
    this.comprimento = 50;
    this.x = 30 + Math.random()*(canvas.width-30);
    this.y = 0 - Math.random()*300;
    this.velocidade = 1*ajusteParaFrameRate;
    this.aumentoBarraPeso = 25;
    this.tempoPeso = 300;

    pesoLarguraAtual = this.largura;
    pesoAlturaAtual = this.altura;
}

//Bloco que gera a função de pesos
let pesos = [];
let quantidadePesos;
function gerarPesos(){
    quantidadePesos = 5;

    for(let i=0; i < quantidadePesos; i++){
        pesos.push(new pesoAleatorio());
    }
}

let pesoReset;
function desenharPesos(){


    for(var i = 0; i < pesos.length; i++) {
        var peso = pesos[i];
        if (jogando === true) {
            //Bloco que limita a criação do peso em função do tempo
            if (atualizacaoBrowser > peso.tempoPeso && atualizacaoBrowser < (peso.tempoPeso + 100) || peso.y > 5) {

                //desenho do peso da lista de pesos
                ctx.drawImage(imagem_peso, peso.x, peso.y, peso.largura, peso.comprimento);

                //movimento em Y do peso da lista de pesos
                if (peso.y < canvas.height) {
                    peso.y += peso.velocidade;
                }

                if(fimDeJogo === true || objetivoConcluido === true){
                    peso.y = -20;
                }
                //colisão carrinho indo para a esquerda
                if (carrinho.esquerda === true && carrinho.direita === false && peso.y >= (canvas.height - carrinho.altura - chao.altura - 10) && peso.y <= (canvas.height - chao.altura - 8 - carrinho.altura / 2 - 10) && peso.x >= (carrinho.x - 45) && peso.x <= carrinho.x + (carrinho.largura - 40)) {
                    peso.y = -20;
                    carrinho.speed = (carrinho.speedPadrao - 1.2 - (barra_de_peso_carregado.larguraVazia/ barra_de_peso_carregado.larguraCheia).toFixed(3));
                    if (barra_de_peso_carregado.larguraVazia + peso.aumentoBarraPeso > barra_de_peso_carregado.larguraCheia) {
                        barra_de_peso_carregado.larguraVazia = barra_de_peso_carregado.larguraCheia //evitar que a barra de peso fique acima dos 150
                        boostFunciona = false;

                    }else{
                        barra_de_peso_carregado.larguraVazia += peso.aumentoBarraPeso;            //incremento na barra de peso
                        boostFunciona = true;
                    }
                                                                                      //parametro para habilitar o boost
                    if (barra_de_peso_carregado.larguraVazia >= barra_de_peso_carregado.larguraCheia) {
                        boostFunciona = false;                                                //parâmetro para desativar o boost se a barra estiver cheia ou mais
                    }else{
                        boostFunciona = true;
                    }

                }
                //colisão carrinho indo para a direita
                if (carrinho.direita === true && carrinho.esquerda === false && peso.y >= (canvas.height - carrinho.altura - chao.altura - 10) && peso.y <= (canvas.height - chao.altura - 8 - carrinho.altura / 2 - 10) && peso.x >= (carrinho.x) && peso.x <= carrinho.x + (carrinho.largura - 5)) {
                    peso.y = -20
                    carrinho.speed = (carrinho.speedPadrao - 1.2 - (barra_de_peso_carregado.larguraVazia / barra_de_peso_carregado.larguraCheia).toFixed(3));
                    if (barra_de_peso_carregado.larguraVazia < (barra_de_peso_carregado.larguraCheia)) {
                        barra_de_peso_carregado.larguraVazia += peso.aumentoBarraPeso;            //incremento na barra de peso
                        boostFunciona = true;                                                               //parametro para habilitar o boost
                        if (barra_de_peso_carregado.larguraVazia + peso.aumentoBarraPeso > barra_de_peso_carregado.larguraCheia) {
                            barra_de_peso_carregado.larguraVazia = barra_de_peso_carregado.larguraCheia  //evitar que a barra de peso fique acima dos 150
                        }
                    }
                    if (barra_de_peso_carregado.larguraVazia >= barra_de_peso_carregado.larguraCheia) {
                        boostFunciona = false;                                                //parâmetro para desativar o boost se a barra estiver cheia ou mais
                    }else{
                        boostFunciona = false;
                    }
                }
            }
        }else{
            peso.y = -15; //Reset game over
        }
    }
}


    //Função para peso único
    /*function desenharPeso() {
    ctx.drawImage(imagem_peso, pesoPesado.x, pesoPesado.y, pesoPesado.largura, pesoPesado.altura);

    if (pesoPesado.y < canvas.height) {
        pesoPesado.y += pesoPesado.velocidade;
    }
}*/

//15 - Geração aleatória de tijolos
//Função "objeto" que cria cada tijolo
function tijoloAleatorio(){
    this.largura = 40+Math.random()*8;
    this.comprimento = 50 + Math.random()*13;
    this.x = 5 + Math.random()*canvas.width - 20;
    this.y = 0 - Math.random()*1000;
    this.velocidade = 1*ajusteParaFrameRate;
    this.aumento = 5;
}

function reinicializarBarras(){             //Função que reinicializa todas as barras as condições padrões
    if(encherBarras === true){
        barra_de_poder.larguraDanificada = barra_de_poder.larguraCheia;     //barra de poder cheia
        barra_de_vida.larguraDanificada = barra_de_vida.larguraCheia;       //barra de vida cheia

    }
    if(barra_de_vida.larguraDanificada == barra_de_vida.larguraCheia){
        encherBarras = false;
    }
    barra_de_peso_carregado.larguraVazia = barra_de_peso_carregado.larguraVaziaPadrao;    //barra de peso vazia
    cresceVida = true;
}


let tijolos = [];
let quantidadeTijolosGerados;

//Função usada para gerar os tijolos de cada fase
function gerarTijolos(fase){
    tijolos = [];
    pesos = [];


    duracaoVida = 1100;
    reinicializarBarras();

    if(fase == 'fase 1'){                       //Bloco para gerar a lista de tijolos da fase 1
        quantidadeTijolosGerados = 8;
        for(var c = 0;c < quantidadeTijolosGerados; c++){
            tijolos.push(new tijoloAleatorio());
        }
    }
    if(fase == 'fase 2'){                       //Bloco para gerar a lista de tijolos da fase 2
        quantidadeTijolosGerados = 40;
        for(var c = 0;c < quantidadeTijolosGerados; c++){
            tijolos.push(new tijoloAleatorio());
        }
    }

    fimDeJogo = false;          //Preparação para inicialização da fase:
    gerarPena();                //Iniciar a função que gera penas
    gerarBoosts();              //Iniciar a função que gera boosts
    gerarVida();                //Iniciar a função que gera vidas
    gerarPesos();               //Iniciar a função que gera pesos
    calculoFPS(fps);            //Iniciar a função que calcula a atualização padrão do monitor
}


function desenharTijolos() {   //Função que desenha os tijolos

    if (jogando === true) {
        for (var c = 0; c < tijolos.length; c++) {  // "FOR" usado para desenhar cada tijolo da lista e aplicar movimento à eles

            //desenho do tijolo[c] da lista de tijolos
            ctx.drawImage(imagem_tijolo1, tijolos[c].x, tijolos[c].y, tijolos[c].largura, tijolos[c].comprimento);

            //movimento em Y do tijolo[c] da lista de tijolos
            tijolos[c].y += tijolos[c].velocidade;


            //colisão com o carrinho indo para a esquerda
            if (carrinho.esquerda === true && carrinho.direita === false && tijolos[c].y >= (canvas.height - carrinho.altura - chao.altura - 10) && tijolos[c].y <= (canvas.height - chao.altura - 8 - carrinho.altura / 2+20) && tijolos[c].x >= (carrinho.x - 15) && tijolos[c].x <= carrinho.x + (carrinho.largura - 40))
            {
                tijolos[c] = new tijoloAleatorio();  // quando os tijolos são coletados, gera novos

                carrinho.speed = carrinho.speedPadrao- 1.2 - (barra_de_peso_carregado.larguraVazia/barra_de_peso_carregado.larguraCheia).toFixed(3); //reduzir o peso de acordo com a barra de peso
                pontuacao += 1                                                                                                          // pontuação por tijolo
                if (barra_de_peso_carregado.larguraVazia + tijolos[c].aumento > barra_de_peso_carregado.larguraCheia ) {
                    barra_de_peso_carregado.larguraVazia = barra_de_peso_carregado.larguraCheia  //evitar que a barra de peso fique acima dos 150
                    boostFunciona = false;
                }else{
                    barra_de_peso_carregado.larguraVazia += tijolos[c].aumento;            //incremento na barra de peso
                    boostFunciona = true;       //parametro para habilitar o boost
                }


                if (barra_de_peso_carregado.larguraVazia >= barra_de_peso_carregado.larguraCheia) {
                    boostFunciona = false;                                                //parâmetro para desativar o boost se a barra estiver cheia ou mais
                }
            }
            //colisao com o carrinho indo para a direita
            if (carrinho.direita === true && carrinho.esquerda === false && tijolos[c].y >= (canvas.height - carrinho.altura - chao.altura - 10) && tijolos[c].y <= (canvas.height - chao.altura - 8 - carrinho.altura / 2 +20) && tijolos[c].x >= (carrinho.x+15) && tijolos[c].x <= carrinho.x + (carrinho.largura - 5))
            {
                tijolos[c] = new tijoloAleatorio();  // quando os tijolos são coletados, gera novos

                carrinho.speed = carrinho.speedPadrao - 1.2 - (barra_de_peso_carregado.larguraVazia/barra_de_peso_carregado.larguraCheia).toFixed(3);
                pontuacao += 1
                if (barra_de_peso_carregado.larguraVazia < (barra_de_peso_carregado.larguraCheia)) {                                        //Bloco que aumenta o tamanho da barra de peso
                    barra_de_peso_carregado.larguraVazia += tijolos[c].aumento;
                    boostFunciona = true;
                    if (barra_de_peso_carregado.larguraVazia + tijolos[c].aumento > barra_de_peso_carregado.larguraCheia) { // Bloco que evita que a barra de peso fique
                        barra_de_peso_carregado.larguraVazia = barra_de_peso_carregado.larguraCheia                                      //acima do tamanho máximo
                    }
                }
                if (barra_de_peso_carregado.larguraVazia >= barra_de_peso_carregado.larguraCheia) {  // Bloco que trava o uso de boost com a barra de peso cheia ou mais
                    boostFunciona = false;
                }
            }


            if (tijolos[c].y > canvas.height) {                     //Tijolos chegam no fim e chama a função de novo e adiciona 1 de dano
                tijolos[c] = new tijoloAleatorio();
                barra_de_vida.hit += 1;
                if (barra_de_vida.larguraDanificada > 0) {      //Bloco que vai reduzir o tamanho da barra de vida
                    barra_de_vida.larguraDanificada -= 2;
                } else {                                        //Linha que faz o reset de todos parâmetros e chama a gameover
                    pontuacaoObtida = pontuacao;
                    fimDeJogo = true;
                    gameover();
                    pontuacao = 0;
                    carrinho.speed = carrinho.speedPadrao;
                    barra_de_vida.larguraDanificada = 0;
                    encherBarras = true;
                    barra_de_vida.hit = 0;
                    jogando = false;
                    atualizacaoBackground = 0;
                    atualizacaoBrowser = 0;
                    movimentoBoost();
                    movimentoPena();
                }
            }
        }
    }

}

//16 - Desenho do score e objetivo
let scoreFase;
function score(fase){         //Função que desenha o score desenhado durante o mapa (diferente do score mostrado na tela Game Over)
    if(fimDeJogo === false && objetivoConcluido === false){
        ctx.fillStyle = "black";
        ctx.textAlign = 'center';
        ctx.font = "45px Arial";
        ctx.fillText(pontuacao, canvas.width/2, (canvas.height-chao.altura)/2-100);

        ctx.fillStyle = "white";
        ctx.textAlign = 'center';
        ctx.font = "45px Arial";
        ctx.fillText("Objetivo", canvas.width/2, 30);
        if(fase == "fase 1"){
            ctx.fillText(pontuacaoFase1, canvas.width/2, 80);
            scoreFase  = pontuacaoFase1

        }else if(fase == "fase 2"){
            ctx.fillText(pontuacaoFase2, canvas.width/2, 80);
            scoreFase = pontuacaoFase2
        }

        if (pontuacao >= scoreFase){
            objetivoConcluido = true;
            novaFase();
            pontuacaoObtida = pontuacao;
            fimDeJogo = true;
            pontuacao = 0;
            carrinho.speed = carrinho.speedPadrao;
            barra_de_vida.larguraDanificada = 0;
            encherBarras = true;
            barra_de_vida.hit = 0;
            jogando = false;
            atualizacaoBackground = 0;
            atualizacaoBrowser = 0;
            movimentoBoost();
            movimentoPena();
        }

    }
}

//17 - Desenho da barra de vida, poder e peso
function barrasVidaEPoder() {
    //gradiente que será utilizado na barra de peso
    var grd = ctx.createLinearGradient(400,0,550,0);

    //Desenho da barra de vida baseado na largura atual
    if(barra_de_vida.larguraCheia > 0){
        //Desenho do brilho da barra de vida caso esteja abaixo do alerta
        if(barra_de_vida.larguraDanificada < barra_de_vida.alerta){
            ctx.shadowBlur = 60;
            ctx.shadowColor = 'red';
        }
        ctx.fillStyle = barra_de_vida.cor;
        ctx.fillRect(barra_de_vida.x, barra_de_vida.y, barra_de_vida.larguraDanificada, barra_de_vida.altura);
        ctx.shadowBlur = 0;
    }


    //ctx.strokeStyle = "black";
    //ctx.rect(barra_de_vida.x,barra_de_vida.y,barra_de_vida.larguraCheia,barra_de_vida.altura);  //borda da barra de vida, porém fica muito pesado 2 barras
    //ctx.stroke();

    //Escrita "VIDA" na barra de vida
    ctx.fillStyle = "Black";
    ctx.font = "bold 23px Tuppence";
    ctx.textAlign="center";
    ctx.textBaseline = "middle";
    ctx.fillText("Vida",barra_de_vida.x + (barra_de_vida.larguraCheia/2), barra_de_vida.y + (barra_de_vida.altura/2));


    //Desenho da barra de poder baseado na largura atual
    if(barra_de_poder.larguraDanificada > 0){
        ctx.fillStyle = barra_de_poder.cor;
        ctx.fillRect(barra_de_poder.x, barra_de_poder.y, barra_de_poder.larguraDanificada, barra_de_poder.altura)
    }

    //ctx.strokeStyle = "black";
    //ctx.rect(barra_de_poder.x,barra_de_poder.y,barra_de_poder.larguraCheia,barra_de_poder.altura); // borda da barra de poder, porém fica muito pesado 2 barras
    //ctx.stroke();

    //Escrita "PODER" na barra de poder
    ctx.fillStyle = "black";
    ctx.font = "bold 23px Tuppence";
    ctx.textAlign="center";
    ctx.textBaseline = "middle";
    ctx.fillText("Poder",barra_de_poder.x + (barra_de_poder.larguraCheia/2), barra_de_poder.y + (barra_de_poder.altura/2));

    //offset para repartir a barra de peso
    let offSet1 = 0.25;
    let offSet2 = 0.5;
    let offSet3 = 0.75;
    let offSet4 = 1;


    //gradientes que serão utilizados para pintar as parcelas da barra peso referente ao offset
    grd.addColorStop(0,"#33C1FF");
    grd.addColorStop(offSet1,"#33C1FF");
    grd.addColorStop(offSet1,'green');
    grd.addColorStop(offSet2,'green');
    grd.addColorStop(offSet2,'yellow');
    grd.addColorStop(offSet3,'yellow');
    grd.addColorStop(offSet3,'red');
    grd.addColorStop(offSet4,'red');

    //condição usada para desenhar a barra de peso
    if(barra_de_peso_carregado.larguraVazia > 0 && barra_de_peso_carregado.larguraVazia <= barra_de_peso_carregado.larguraCheia){
        ctx.fillStyle = grd;

        //condições as seguir controlam o brilho ao redor da barra peso de acordo com o quão cheia está
        if(barra_de_peso_carregado.larguraVazia >= (barra_de_peso_carregado.larguraCheia/4) && barra_de_peso_carregado.larguraVazia < (barra_de_peso_carregado.larguraCheia/2) ){
            ctx.shadowBlur = 20;
            ctx.shadowColor = "#33C1FF";
        }else if(barra_de_peso_carregado.larguraVazia >= (barra_de_peso_carregado.larguraCheia/2) && barra_de_peso_carregado.larguraVazia < (barra_de_peso_carregado.larguraCheia*3/4) ){
            ctx.shadowColor = 'green';
        }else if(barra_de_peso_carregado.larguraVazia >= (barra_de_peso_carregado.larguraCheia*3/4)  && barra_de_peso_carregado.larguraVazia < barra_de_peso_carregado.larguraCheia ){
            ctx.shadowColor = 'yellow';
        }else if(barra_de_peso_carregado.larguraVazia >= barra_de_peso_carregado.larguraCheia){
            ctx.shadowBlur = 40;
            ctx.shadowColor = 'red';
        }
        //desenho da barra de peso com a largura do momento
        ctx.fillStyle = grd;
        ctx.fillRect(barra_de_peso_carregado.x, barra_de_peso_carregado.y, barra_de_peso_carregado.larguraVazia, barra_de_peso_carregado.altura);
    }
    //ctx.strokeStyle = "black";
    //ctx.rect(barra_de_peso_carregado.x,barra_de_peso_carregado.y,barra_de_peso_carregado.larguraCheia,barra_de_peso_carregado.altura); //borda da barra de peso, porém fica muito pesado 2 barras.
    //ctx.stroke();

    ctx.fillStyle = "black";
    ctx.font = "bold 23px Tuppence";                 //Escrita "PESO" no centro da barra de peso
    ctx.textAlign="center";
    ctx.textBaseline = "middle";
    ctx.fillText("Peso",barra_de_peso_carregado.x + (barra_de_peso_carregado.larguraCheia/2), barra_de_peso_carregado.y + (barra_de_peso_carregado.altura/2));
    ctx.shadowBlur = 0;
}


//18 - Cálculo de FPS
function calculoFPS(fps){
    intervalo = 1000 / fps;     //função que determina os parâmetros para o cálculo da taxa de atualização padrão para todos
    depois = Date.now();        //monitores e chama a função que executa as animações
    startTime = depois;
    principal();
}

//19 - Função principal (que englobal a linha do requestAnimationFrame)
let atualizacao = 0;
let contador2 = 0;
function principal(){    ///função que executa as todas as animações
    if(fimDeJogo === false && objetivoConcluido === false){    //parâmetro para determinar o gameover e cortar animações
        requestAnimationFrame(principal)

    }

    agora = Date.now();                             //Cálculos feitos para fazer com que o framerate não importe na animação,
    tempoPassado = agora - depois;                  //ou seja, uma pessoa com 144hz, vai ter o mesmo número de animações que
    if(tempoPassado > intervalo){                   //alguém com 60hz.
        atualizacao +=1                             //
        depois = agora - (tempoPassado % intervalo); //

        desenharElementos();
        movimentoCarrinho();
        desenharTijolos();
        desenharPesos();
        movimentoVida();
        if(fimDeJogo === false && objetivoConcluido === false){
            movimentoBoost();
            movimentoPena();
            barrasVidaEPoder();
            score(fase);
            contador2 = 0
        }else if(fimDeJogo === true){                                                   //executar a linha de gameover
            ctx.clearRect(0,0,canvas.width,canvas.height);
            atualizacao = 0;
            gameover();
        }else if(objetivoConcluido === true){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            atualizacao = 0;
            novaFase();
        }
    }
}

mainMenu();
