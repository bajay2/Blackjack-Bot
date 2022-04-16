const { SlashCommandBuilder } = require('@discordjs/builders');
var pool = require ('../db.js');
var balance;
module.exports = {
    data: new SlashCommandBuilder()
            .setName('balance')
            .setDescription('Check your current balance'),
        async execute(interaction) {
            pool.connect()
                .then((client) => {
                    client.query(`select balance from users where id = $1`,[interaction.user.id])
                        .then(res => {
                            if(res.rows == 0){
                                interaction.reply({ content: 'Use /blackjack to start an account and receive 100 credit: ', components: [] });
                            } else {
                                balance = res.rows[0].balance;
                                interaction.reply({ content: 'Your balance is: ' + balance.toString(), components: [] });
                            }
                        })
                        .catch(err => {
                            console.error(err);
                        });
                })
                .catch(err => {
                    console.error(err);
                });
        }
};
