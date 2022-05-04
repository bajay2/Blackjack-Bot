const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const blackjack = require('../blackjack');
var pool = require ('../db.js');
var balance, user;
var greet = '';

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
                            client.query('insert into users (id, balance) values ($1, 1000)',
                            [interaction.user.id], (err, res) => {  
                                greet = 'Welcome! You have been given a balance of 1000 to play with.\n';
                                balance = 1000;
                                client.release()
                                game();
                            });
                        }else {
                            client.query('select balance from users where id = $1',
                            [interaction.user.id], (err, res) => {  
                                greet = '';
                                balance = res.rows[0].balance;
                                client.release()
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
            user = interaction.user.id;
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
                    new MessageButton()
                        .setCustomId('double-button')
                        .setLabel('2x')
                        .setStyle('PRIMARY'),
                );
                //Don't place buttons if user gets blackjack
                if(!blackjack.isGameOver()) {
                    interaction.reply({ content: greet + score, components: [row] });
                } else {
                    pool.connect()
						.then((client) => {
							client.query(`update users set balance=($1) where id=($2)`,[score[1],interaction.user.id])
                            client.release();
						})
						.catch(err => {
							console.error(err);
						});
                    interaction.reply({ content: greet + score[0], components: [] });
                }
            }
        }
	},
};