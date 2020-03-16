
//le terrain de jeu
const gameBoard = document.getElementById("gameBoard");

//notre personnage
const player = document.getElementById("player");

//tableau des directions possibles (on s'en sert dans la fonction move)
const directions = ["up", "down", "left", "right"];

//tableau qui contient nos ennemis
const ennemies = [...document.getElementsByClassName("ennemi")];
//compteur vie
let vie = 3;
// afficher le compteur dans la span
//BOnne réponse
let compteurvie = document.getElementById("vie");
//Mauvaise réponse

compteurvie.innerText ="3";
//compteurvie.appendChild(span);

//document.getElementsByClassName("vie").textContent = "3";

//image gameover
let img = document.getElementById("img");

          
//fonction qui permet de récupérer la valeur calculée d'une propriété CSS d'un élément HTML 
function getComputedStyleInteger(element, property) {
    //sinon, on peut utiliser : offsetLeft et offsetTop
    return parseInt(window.getComputedStyle(element).getPropertyValue(property));
}

//fonction pour obtenir un nombre aléatoire compris entre min et max
function getRandomIntBetwenRange(max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//fonction pour faire bouger un élément dans notre espace de jeu
function move(element, direction) {
    const leftElement = getComputedStyleInteger(element, "left");
    const topElement = getComputedStyleInteger(element, "top");

    switch (direction) {
        case "up":
            if (topElement > 0) {
                element.style.top = topElement - 50 + "px";
            }
            break;

        case "down":
            if (topElement < 700) {
                element.style.top = topElement + 50 + "px";
            }
            break;

        case "left":
            if (leftElement > 0) {
                element.style.left = leftElement - 50 + "px";
            }
            break;

        case "right":
            if (leftElement < 700) {
                element.style.left = leftElement + 50 + "px";
            }
            break;
    }
}

//écouter le fait d'appuyer sur une touche
document.addEventListener("keydown", function (e) {
    switch (e.key) {
        case "ArrowLeft":
            move(player, "left");
            break;

        case "ArrowRight":
            move(player, "right")
            break;

        case "ArrowUp":
            move(player, "up")
            break;

        case "ArrowDown":
            move(player, "down")
            break;

        case " ":
            createBomb(getComputedStyleInteger(player, "top"), getComputedStyleInteger(player, "left"))
            
            break;
    }
});

//faire bouger aléatoirement nos ennemis toutes les secondes
setInterval(function () {
    for (let i = 0; i < ennemies.length; i++) {
        let direction = directions[getRandomIntBetwenRange(3, 0)];
        move(ennemies[i], direction); 

    }
}, 300)

function createExplosion(bomb) {
    //changement de style
    bomb.classList.add("explosion");
    bomb.classList.remove("bomb");
    //léger décalage car je dois faire ça avec mon CSS pour avoir le résultat que je veux
    bomb.style.top = parseInt(bomb.style.top) - 50 + "px";
    bomb.style.left = parseInt(bomb.style.left) - 50 + "px";
    //on appelle la fonction pour voir si on touche un(des) ennemi(s)
    detectionExplosion(bomb);
    setTimeout(function () {
        gameBoard.removeChild(bomb);
    }, 300);
}

//fonction qui sert à créer une bombe
function createBomb(top, left) {
    //on créé un élément HTML
    let bomb = document.createElement("div");
    bomb.setAttribute("class", "bomb");
    bomb.style.top = top + "px";
    bomb.style.left = left + "px";
    //on ajoute notre élément HTML comme enfant de la div qui représente notre terrain de jeu
    gameBoard.appendChild(bomb);
//on appelle la fonction pour voir si on touche un(des) ennemi(s)
    //detectionExplosion(bomb);
    //au bout de 3 secondes on appelle la function createExplosion
    setTimeout(function () {
        createExplosion(bomb);
    }, 3000);
}
function detectionExplosion(bomb) {
    //top et left de ma bombe
    const bombTop = getComputedStyleInteger(bomb, "top");
    const bombLeft = getComputedStyleInteger(bomb, "left");

    //on vérifie pour chaque ennemi s'il est dans le périmètre de la bombe, c'est à dire plus des maths qu'autre chose dans ce cas
    for (let i = 0; i < ennemies.length; i++) {
        //top et left d'un ennemi (et on boucle sur tous, donc on aura toutes leur position)
        const ennemiTop = getComputedStyleInteger(ennemies[i], "top");
        //console.log(ennemiTop);
        const ennemiLeft = getComputedStyleInteger(ennemies[i], "left");
        //console.log(ennemiLeft);
        
        //Si notre ennemmi est dans le périmètre de la bombe (donc touché)
        if ((ennemiTop >= bombTop && ennemiTop <= bombTop + 100) && (ennemiLeft >= bombLeft && ennemiLeft <= bombLeft + 100)) {
            //on enlève notre ennemi du plateau de jeu, on enlève un élément HTML
            gameBoard.removeChild(ennemies[i]);
            //on enlève notre ennemi touché du tableau des ennemis
            ennemies.splice(i, 1);
            //si notre tableau des ennemis est vide, nous avons gagné
            if (ennemies.length <= 0) {
                let victoire = document.createElement("img");
                console.log(victoire);
                    victoire.classList.add("img")
                    console.log(victoire);
                    victoire.src = "../images/win.png";
                    console.log(victoire);
                    gameBoard.appendChild(victoire);
                console.log("Vous avez gagné !");
            }
        }
    }
        //on recupere la position du player au moment de l'explosion
        const playerTop = getComputedStyleInteger(player, "top");
        const playerLeft = getComputedStyleInteger(player, "left");

        //on verifie si le player est bien dans le périmetre de l'explosion
        if ((playerTop >= bombTop && playerTop <= bombTop + 100) && (playerLeft >= bombLeft && playerLeft <= bombLeft + 100)) {
            //si c'est vrai on lui retire 1 vie
            vie--;
            pertedevie();
            
            console.log(vie);
       
        }
    
    }
    //fonction des actions des points de vie
    function pertedevie(){

        if(vie === 2) {

            //faire blinker le player pendant 3sec
           player.style.animation ="blink 1s reverse infinite";
           compteurvie.innerHTML = "2";
            setTimeout(function(){
                
            player.style.animation = "";},3000);
        }
        if(vie === 1){

            player.style.animation ="blink 1s reverse infinite";
            compteurvie.innerHTML = "1";
            setTimeout(function(){
                
            player.style.animation = "";},3000);
        }

        if(vie === 0){

           // alert("tu t'est fait défoncer!!");
           compteurvie.innerHTML = "0";
           //let img = document.createElement("div");//img.setAttribute("class","img");*/
        
           document.getElementById("img").style.display = "block";
          //console.log(img);
           
        }
    }