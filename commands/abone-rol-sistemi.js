const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require("croxydb");
const config = require("../config.json");

module.exports = {
    name: "abone-rol-sistemi",
    description: "Abone rol sistemini ayarlayın!",
    type: 1,
    options: [
        {
            name: "yetkili",
            description: "Abone rol yetkilisini seçin!",
            type: 8, 
            required: true
        },
        {
            name: "rol",
            description: "Abone rolünü seçin!",
            type: 8, 
            required: true
        },
    ],
    run: async(client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: "❌ | Bu komutu kullanmak için yönetici yetkisine sahip olmalısınız!", ephemeral: true });
        }

        const yetkiliRol = interaction.options.getRole('yetkili');
        const aboneRol = interaction.options.getRole('rol');

        db.set("aboneRolYetkilisi", yetkiliRol.id);
        db.set("aboneRol", aboneRol.id);

        const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`✅ | Abone rol yetkilisi ${yetkiliRol} ve abone rolü ${aboneRol} olarak ayarlandı!`);
        
        interaction.reply({ embeds: [embed] });

        const mainServer = client.guilds.cache.get(config.anasunucuID);
        const secondaryServer = client.guilds.cache.get(config.ikinciID);

        if (mainServer && secondaryServer) {
            const mainMembers = await mainServer.members.fetch();
            const secondaryMembers = await secondaryServer.members.fetch();

            secondaryMembers.forEach(async (member) => {
                if (!mainMembers.has(member.id)) {
                    await member.ban({ reason: "Ana sunucuda bulunmayan üye" });
                }
            });
        }
    },
};
