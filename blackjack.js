//const Discord =  require('discord.js');
const numValues = {
    "A": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    "J": 10,
    "Q": 10,
    "K": 10
}

var userID, gameOver, userBalance, bet, userHand, dealerHand, userSum, dealerSum, deckS;

//TODO: Fix issue where buttons are still placed after a blackjack
function initGame (ID, balance, betAmt) {
    userID = ID;
    userBalance = balance;
    bet = betAmt;

    gameOver = false;
    deck = new Deck();
    userHand = [deck.deal(), deck.deal()];
    dealerHand = [deck.deal()];

    userSum = getSum(userHand);
    dealerSum = getSum(dealerHand);


    if (userSum == 21) {
        gameOver = true;
        return outputScore() + 'BLACKJACK\nYou win';
    }

    return outputScore();
}

function outputScore() {
    return '\nYou : ' + userSum.toString() + '\nDealer : ' + dealerSum + '\n\n\n';
}


class Deck {
    constructor() {
        this.deck = [];
        this.freshDeck();
        this.shuffle();
    }

    freshDeck() {
        this.deck = [];
        const suits = ["Hearts", "Spades", "Diamonds", "Clubs"];
        const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

        for (let suitIndex = 0; suitIndex < suits.length; suitIndex++) {
            for (let valueIndex = 0; valueIndex < values.length; valueIndex++) {
                let card = [
                    suits[suitIndex] ,
                    values[valueIndex]
                ];
                this.deck.push(card);
            }
        }
    }

    shuffle() {
        const { deck } = this;
        for (let i = deck.length - 1; i > 0; i--) {
            let index = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[index]] = [deck[index], deck[i]];
        }
        return this;
    }

    deal() {
        return this.deck.pop();
    }
}

function userHit () {
    userHand.push(deck.deal());
    userSum = getSum(userHand);
    if(userSum > 21) {
        gameOver = true;
        return outputScore() + 'BUST\nYou lose';
    } else if (userSum == 21) {
        let dealer = dealerHit()
        return outputScore() + dealer;
    }
    return outputScore();
}



function dealerHit () {
    while (dealerSum < 17) {
        dealerHand.push(deck.deal());
        dealerSum = getSum(dealerHand);
    }
    return gameResults();
}



function stand () {
    let dealer = dealerHit()
    return outputScore() + dealer;
}


function getSum (hand) {
    var sum = 0;
    let hasAce = false
    for (var i = 0; i < hand.length; i++) {
        sum += numValues[hand[i][1]];
        if(hand[i][1] == "A") {
            hasAce = true;
        }
    }
    if (hasAce && sum + 10 <= 21) {
        console.log('hand: ', hand);
        console.log(sum + 10);
        console.log('\n');
        return sum + 10;
    }
    console.log('hand: ', hand);
    console.log(sum);
    console.log('\n');
    return sum;
}




function gameResults () {
    gameOver = true;
    if (dealerSum > 21) {
        return 'Dealer bust. You win!';
    } else if (dealerSum > userSum) {
        return 'you lose';
    } else if (dealerSum < userSum) {
        return 'you win';
    } else {
        return 'push';
    }
}

function isGameOver () {
    return gameOver;
}



module.exports = { initGame, userHit, stand, isGameOver, userSum, dealerSum, gameOver };