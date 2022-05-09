var userID, gameOver, userBalance, bet, userHand, dealerHand, userSum, dealerSum, deck, userBust, dealerBust;
var winnings = 0;
var dbl;

function initGame (balance, betAmt) {
    bal = balance;
    bet = betAmt;
    dbl = '';
    gameOver = dealerBust = userBust = false;
    deck = new Deck();
    userHand = [deck.deal(), deck.deal()];
    dealerHand = [deck.deal()];

    userSum = getSum(userHand);
    dealerSum = getSum(dealerHand);


    if (userSum == 21) {
        gameOver = true;
        winnings = Math.round(bet * 1.5);
        return [outputScore(userHand, dealerHand) + '**BLACKJACK** (Bet * 1.5)\nYou win: ' + winnings.toString() + '\nYou now have: ' + + (bal + winnings).toString(), bal + winnings, winnings];
    }

    return outputScore(userHand, dealerHand);
}

function outputScore(userHand, dealerHand) {
    if (dealerHand.length == 1) {
        if(userBust){
            return dbl + '\n**You | ' + userSum.toString() + ' (Bust)' + '**' + getEmojis(userHand) + '\n**Dealer | ' + dealerSum + '**' + getEmojis(dealerHand) + '<:back_of_card:963564621350989874>' + '\n\n';
        }
        return dbl + '\n**You | ' + userSum.toString() + '**' + getEmojis(userHand) + '\n**Dealer | ' + dealerSum + '**' + getEmojis(dealerHand) + '<:back_of_card:963564621350989874>' + '\n\n';
    }
    else if (dealerBust) {
        return dbl + '\n**You | ' + userSum.toString() + '**' + getEmojis(userHand) + '\n**Dealer | ' + dealerSum + ' (Bust)' + '**' + getEmojis(dealerHand) + '\n\n';
    } else {
        return dbl + '\n**You | ' + userSum.toString() + '**' + getEmojis(userHand) + '\n**Dealer | ' + dealerSum + '**' + getEmojis(dealerHand) + '\n\n';
    }
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
        gameOver = userBust = true;
        winnings = -bet;
        return [outputScore(userHand, dealerHand) + '**Loser**\nYou lost ' + bet.toString() + '\nYou now have: ' + (bal + winnings).toString(), bal + winnings, winnings];
    } else if (userSum == 21 && userHand.length < 5) {
        let dealer = dealerHit()
        return outputScore(userHand, dealerHand) + dealer;
    } else if (userHand.length == 5) {
        gameOver = true;
        winnings = Math.round(bet * 1.5);
        return [outputScore(userHand, dealerHand) + '**5-CARD CHARLIE** (Bet * 1.5)\nYou win: ' + winnings.toString() + '\nYou now have: ' + (bal + winnings).toString(), bal + winnings, winnings];
    }
    return outputScore(userHand, dealerHand);
}

function double () {
    bet *= 2;
    userHand.push(deck.deal());
    userSum = getSum(userHand);
    dbl = 'You doubled your bet.';
    return stand();
}

function dealerHit () {
    while (dealerSum < 17) {
        dealerHand.push(deck.deal());
        dealerSum = getSum(dealerHand);
    }
    return gameResults();
}



function stand () {
    let dealer = dealerHit();
    return [outputScore(userHand, dealerHand) + dealer[0], dealer[1], dealer[2]];
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
        return sum + 10;
    }
    return sum;
}


function getEmojis (hand){
    let emojis = '\n';
    for (var i = 0; i < hand.length; i++) {
        let card = hand[i][1]+ '_of_' + hand[i][0].toLowerCase();
        emojis += '<:' + card + ':' + emojiNames[card] + '>';
    }
    return emojis;
}


function gameResults () {
    gameOver = true;
    if (dealerSum > 21) {
        dealerBust = true;
        winnings = bet;
        return ['**WINNER** \nYou win: ' + winnings.toString() + '\nYou now have: ' + (bal + winnings).toString(), bal + winnings, winnings];
    } else if (dealerSum > userSum) {
        winnings = -bet;
        return ['**Loser** \nYou lost: ' + bet.toString() + '\nYou now have: ' + (bal + winnings).toString(), bal + winnings, winnings];
    } else if (dealerSum < userSum) {
        winnings = bet;
        return ['**WINNER** \nYou win: ' + winnings.toString() + '\nYou now have: ' + (bal + winnings).toString(), bal + winnings, winnings];
    } else {
        winnings = 0;
        return ['**Push**\nYou win: 0\nYou now have: ' + (bal + winnings).toString(), bal + winnings, winnings];
    }
}

function isGameOver () {
    return gameOver;
}



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



//set some duplicates since theres a limit of 50 custom emojis per server
const emojiNames = {
    '2_of_diamonds' : '963564620411449384',  //duplicate of 2 of clubs
    '3_of_diamonds' : '963564620365307965',
    '4_of_diamonds' : '963564620415643758',
    '5_of_diamonds' : '963564620465971200',
    '6_of_diamonds' : '963564620931543120',
    '7_of_diamonds' : '963564620600197131',
    '8_of_diamonds' : '963564621254520923',
    '9_of_diamonds' : '963564621271277568',
    '10_of_diamonds' : '963566395814215770',
    'J_of_diamonds' : '963564621309050913',
    'Q_of_diamonds' : '963564621099315241',
    'K_of_diamonds' : '963564621267079168',
    'A_of_diamonds' : '963564620843483197',

    '2_of_hearts' : '963564620143001621',
    '3_of_hearts' : '963564620872814712',
    '4_of_hearts' : '963564620067512382',
    '5_of_hearts' : '963564620927344640',   //duplicate of 5 of spades
    '6_of_hearts' : '963564621023821834',
    '7_of_hearts' : '963564621040615454',
    '8_of_hearts' : '963564621015425025',
    '9_of_hearts' : '963564621124481024',
    '10_of_hearts' : '963577924362055720',
    'J_of_hearts' : '963564621271285820',
    'Q_of_hearts' : '963564620927352833',
    'K_of_hearts' : '963564621199974461',
    'A_of_hearts' : '963564620960899124',

    '2_of_spades' : '963564620583424050',
    '3_of_spades' : '963564620365307965',  //duplicate of 3 of diamonds
    '4_of_spades' : '963564620566642789',
    '5_of_spades' : '963564620927344640',
    '6_of_spades' : '963564621061554246',
    '7_of_spades' : '963564620667306086',
    '8_of_spades' : '963564621304827945',
    '9_of_spades' : '963564621241917450',
    '10_of_spades' : '963577954061938769',
    'J_of_spades' : '963564621309046854',
    'Q_of_spades' : '963564621296463872',
    'K_of_spades' : '963564620990263397',
    'A_of_spades' : '963564621241925672',

    '2_of_clubs' : '963564620411449384',
    '3_of_clubs' : '963564620465995797',
    '4_of_clubs' : '963564620478578810',
    '5_of_clubs' : '963564620591816744',
    '6_of_clubs' : '963564621116100620',
    '7_of_clubs' : '963564620897980417',
    '8_of_clubs' : '963564621174820887',
    '9_of_clubs' : '963564621158056017',
    '10_of_clubs' : '963566395503808623',
    'J_of_clubs' : '963564621074149487',
    'Q_of_clubs' : '963564621309018184',
    'K_of_clubs' : '963564621254512680',
    'A_of_clubs' : '963564621158043678',

    'back_of_card' : '963564621350989874'
}


module.exports = { initGame, userHit, stand, double, isGameOver, userSum, dealerSum, gameOver };