const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const blackjack = require('../blackjack');

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
        const bet = interaction.options.getInteger('bet');
        let score = blackjack.initGame(1,2,bet);
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
            await interaction.reply({ content: score, components: [row] });
        } else {
            await interaction.reply({ content: score, components: [] });
        }
	},
};