const fs = require('node:fs');
const { Client, Intents, Collection, MessageActionRow, MessageButton } = require('discord.js');
const { token } = require('./config.json');
const blackjack = require('./blackjack');
var pool = require('./db.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}
client.login(token);


client.on('ready', () => {
	console.log('Ready!');
	pool.connect( (err, client, done) => {
		client.query('create table if not exists users( \
			id text primary key, \
			balance integer default 100)', (err, res) => {
				done(err);
		});
	});
});

client.on('interactionCreate', async interaction => {
	if (interaction.isCommand()) {
		if(interaction.commandName == 'blackjack') {
			
		}
		const command = client.commands.get(interaction.commandName);
		
		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });		
		}
	//TODO button interaction exclusivity
	} else if (interaction.isButton()) {
		if (interaction.customId.includes('-button')) {	
			if (interaction.customId.includes('hit')) {
				let hit = blackjack.userHit();
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
				if(!blackjack.isGameOver()) {
					await interaction.update({ content: hit, components: [row] })
				} else {
					pool.connect()
						.then((client) => {
							client.query(`update users set balance=($1) where id=($2)`,[hit[1],interaction.user.id])
						})
						.catch(err => {
							console.error(err);
						});
					await interaction.update({ content: hit[0], components: []})
				}

			} else if (interaction.customId.includes('stand')) {
				let stand = blackjack.stand();
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
				pool.connect()
						.then((client) => {
							client.query(`update users set balance=($1) where id=($2)`,[stand[1],interaction.user.id])
						})
						.catch(err => {
							console.error(err);
						});
				await interaction.update({ content: stand[0], components: [] })
			}
		}
	}
		
	
});

