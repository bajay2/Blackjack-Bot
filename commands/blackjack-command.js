const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const blackjack = require('../blackjack');
var pool = require ('../db.js');
var balance;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('blackjack')
		.setDescription('Play a hand of blackjack')
        .addIntegerOption(option =>
            option
                .setName('bet')
                .setDescription('Enter bet amount.')
                .setRequired(true)
            ),
	async execute(interaction) {
        pool.connect()
            .then((client) => {
                client.query(`select balance from users where id = $1`,[interaction.user.id])
                    .then(res => {
                        if(res.rows == 0) {
                            client.query('insert into users (id, balance) values ($1, 100)',
                            [interaction.user.id], (err, res) => {  
                                console.log("Welcome. You've been given a balance of 100 to gamble");
                                game();
                            });
                        }else {
                            client.query('select balance from users where id = $1',
                            [interaction.user.id], (err, res) => {  
                                balance = res.rows[0].balance;
                                game();
                            });
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    });
            })
            .catch(err => {
                console.error(err);
            });
        
        function game() {
            const bet = interaction.options.getInteger('bet');
            if (bet > balance) {
                interaction.reply({ content: 'Bet too large. Please lower your bet.'});
            } else {
                let score = blackjack.initGame(balance, bet);
                const row = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId('hit-button')
                        .setLabel('Hit')
                        .setStyle('SUCCESS'),
                    new MessageButton()
                        .setCustomId('stand-button')
                        .setLabel('Stand')
                        .setStyle('DANGER'),
                );
                //Don't place buttons if user gets blackjack
                if(!blackjack.isGameOver()) {
                    interaction.reply({ content: score, components: [row] });
                } else {
                    interaction.reply({ content: score[0], components: [] });
                }
            }
        }
	},
};