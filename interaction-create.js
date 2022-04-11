module.ecports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try{
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: 'Error executing command!',
                    ephemeral: true
                });
            }
        } else if (interaction.isButton()) {
            if (interaction.customId.includes('-button')) {
                if (interaction.customId.includes('hit')) {
                    await interaction.reply({ content: 'hit button works' })
                } else if (interaction.customId.includes('stand')) {
                    await interaction.reply({ content: 'stand button works' })
                }
            }
        }
    }
}