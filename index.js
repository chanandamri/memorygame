const startButton = document.getElementById("startGame")
startButton.addEventListener('click', startGame)
const game = document.getElementById("game")
const selected = document.getElementById("selected")
let allPickedCard = [], cards = [], cardSelectedFirst = true, firstCard = "", delay = false, cardselectedAll = 0, numOfCards = 6, players = [], currentPlayer, StartState = firstStart = true

function createCard(number, id) {
    return {
        number,
        order: Math.random(),
        id
    }
}
function createCards(stackLength) {
    cards = []
    for (i = 0; i < stackLength * 2; i++) {
        cards.push(createCard(Math.floor(i / 2) + 1, i))
    }
    cards.sort((a, b) => a.order - b.order)
    createCardGame()
}
function cardCreatUI(stack, card) {
    let elem = document.createElement(`div`)
    elem.setAttribute("id", `card${card.id}`)
    let child = document.createElement(`p`)
    child.innerText = card.number
    child.classList.add('notVisible')
    elem.classList.add('card', "col-xs-2")
    if (stack == game) {
        elem.addEventListener('click', selectCard)
        elem.addEventListener('mouseover', changeCardMouseOver)
    }
    elem.append(child)
    stack.append(elem)
}
function createCardGame() {
    showCurrentPlayerSelectedCards()
    game.innerHTML = ""
    for (i of cards) {
        cardCreatUI(game, i)
    }
}
function moveCardToSelected(card) {
    card.firstChild.classList.remove("visible")
    changeCardStyleGeneral(card, "matchCard")
    currentPlayer.cards.push(card);
    showCurrentPlayerSelectedCards()
}
function showCurrentPlayerSelectedCards() {
    selected.innerHTML = `<h1>Player ${currentPlayer.name}</h1>
    <h2>Number of pairs: ${currentPlayer.numOfCards}</h2>
    <h2>selected cards:</h2>
    <div>`
    currentPlayer.cards.forEach(item => {
        test = cardFromID(item)
        selected.innerHTML += `<div class="card pickedCard col-xs-3">${test.number}</div>`
    })
    selected.innerHTML += "<div/>"

}
function changeCardMouseOver(card) {
    if (!delay) {
        card.target.addEventListener("mouseout", changeCardMouseOut)
        changeCardStyleGeneral(card.target, "mouseOverCard")
    }
}
function changeCardMouseOut(card) {
    card.target.classList.remove("mouseOverCard")
    card.target.removeEventListener("mouseout", changeCardMouseOut)
}
function winning() {
    players.sort((a, b) => b.numOfCards - a.numOfCards)
    let text = ''
    players.forEach(v => text += `player ${v.name} with ${v.numOfCards} pairs\n`)
    alert(`All cards were selected! the winner is ${players[0].name} with ${players[0].numOfCards} pairs!
    Here is the list of players:
    ${text}
    Game over`)
}
function identicalCards() {
    delay = true
    setTimeout(() => {
        console.log("amazing!!");
        currentPlayer.numOfCards++
        secondCard.removeEventListener('click', selectCard)
        secondCard.removeEventListener('mouseover', changeCardMouseOver)
        moveCardToSelected(firstCard)
        moveCardToSelected(secondCard)
        cardselectedAll++
        if (cardselectedAll == numOfCards) { winning() }
        delay = false
    }, 500);

}
function unSelect(card) {
    card.addEventListener('click', selectCard)
    card.classList.remove("pickedCard")
    card.firstChild.classList.remove("visible")
    card.addEventListener('mouseover', changeCardMouseOver)
}
function differentCards() {
    delay = true
    setTimeout(() => {
        unSelect(firstCard)
        unSelect(secondCard)
        playersHandling()
        delay = false
    }, 500);

}
function changeCardStyleGeneral(card, style) {
    card.classList.add(style)
}
function selectCardStyle(card) {
    changeCardStyleGeneral(card, "pickedCard")
    console.log(card.firstChild);
    changeCardStyleGeneral(card.firstChild, "visible")

}
function cardFromID(item) {
    return cards.find(v => item.id.substring(4) == (v.id))
}
function playersCreation(numOfPlayers) {
    players = []
    for (i = 0; i <= numOfPlayers - 1; i++) {
        players.push({
            id: i,
            name: prompt(`Player ${i + 1} what is your name?`),
            cards: [],
            numOfCards: 0
        })
    }
    currentPlayer = players[0]

}
function playersHandling() {
    currentPlayer = players.length == (currentPlayer.id + 1) ? players[0] : players[currentPlayer.id + 1]
    console.log(currentPlayer);
    showCurrentPlayerSelectedCards()
}
function selectCard(e) {
    if (!delay) {
        let cardSelect = e.target
        console.log(cardSelect);
        cardSelect.classList.remove("mouseOverCard")
        if (cardSelectedFirst) {
            firstCard = cardSelect
            selectCardStyle(firstCard)
            firstCard.removeEventListener('click', selectCard)
            firstCard.removeEventListener('mouseover', changeCardMouseOver)
            console.log("first");
            cardSelectedFirst = false
        } else {
            secondCard = cardSelect
            selectCardStyle(secondCard)
            console.log("2nd");
            cardSelectedFirst = true

            cardFromID(secondCard).number == cardFromID(firstCard).number ? identicalCards() : differentCards()
        }
    }
}
function startGame() {

    if (firstStart) {
        startButton.innerHTML = "Restart the game"
    }
    firstStart = false
    numOfCards = document.getElementById("howmanycards").value
    numOfPlayers = document.getElementById("howManyPlayers").value
    cardselectedAll = 0
    playersCreation(numOfPlayers)
    createCards(numOfCards)
}
