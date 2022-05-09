const { SlashCommandBuilder } = require('@discordjs/builders');
var pool = require ('../db.js');
const bonus = require ('../bonus.js');
const humanizeDuration = require('humanize-duration');
var hourly = 100;
const cooldowns = new Map();
const shortEnglishHumanizer = humanizeDuration.humanizer({
    language: "shortEn",
    languages: {
      shortEn: {
        y: () => "y",
        mo: () => "mo",
        w: () => "w",
        d: () => "d",
        h: () => "h",
        m: () => "m",
        s: () => "s",
        ms: () => "ms",
      },
    },
  });
module.exports = {
    data: new SlashCommandBuilder()
            .setName('hourly')
            .setDescription('Receive your hourly bonus'),
        async execute(interaction) {
            const cooldown = cooldowns.get(interaction.user.id);
            if (cooldown) {
                const timeRemaining = shortEnglishHumanizer(cooldown - Date.now(), {round: true});
                interaction.reply({ content: `Please wait ${timeRemaining} for next hourly bonus`, ephemeral: true });
                
            } else {
                cooldowns.set(interaction.user.id, Date.now() + 3600000);
                    setTimeout(() => {
                    cooldowns.delete(interaction.user.id);
                    }, 3600000);   
              
                pool.connect()
                    .then((client) => {
                        client.query(`select balance from users where id = $1`,[interaction.user.id])
                            .then(res => {
                                if(res.rows == 0){
                                    client.query('insert into users (id, balance) values ($1, 1000)',
                                    [interaction.user.id], (err, res) => {  
                                        interaction.reply({ content: 'Welcome! You have been given a balance of 1000 to play with.', components: [] });
                                        client.release();
                                    });
                                } else {
                                    var balance = res.rows[0].balance;
                                    balance += hourly;
                                    client.query(`update users set balance=($1) where id=($2)`,[balance, interaction.user.id])
                                    interaction.reply({ content: 'You received 100 credits. You now have ' + balance.toString(), components: [] });
                                    client.release();
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
        }
};
