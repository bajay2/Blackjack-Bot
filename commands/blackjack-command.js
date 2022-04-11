const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

const blackjack = require('../blackjack');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('blackjack')
		.setDescription('Play a hand of blackjack'),
	async execute(interaction) {
        let score = blackjack.initGame(1,2,3);
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
        await interaction.reply({ content: score, components: [row] });
	},
};