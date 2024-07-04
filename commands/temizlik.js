const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const config = require("../config.json");

module.exports = {
    name: "temizlik",
    description: "Ana sunucuda bulunmayan üyeleri otomatik olarak banlar.",
    type: 1,
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: "❌ | Bu komutu kullanmak için yönetici yetkisine sahip olmalısınız!", ephemeral: true });
        }

        const mainServer = client.guilds.cache.get(config.anasunucuID);
        const secondaryServer = client.guilds.cache.get(config.ikinciID);

        if (mainServer && secondaryServer) {
            const mainMembers = await mainServer.members.fetch();
            const secondaryMembers = await secondaryServer.members.fetch();

            const excludedRoles = config.excludedRoles;
            let banCount = 0;

            for (const [id, member] of secondaryMembers) {
                if (!mainMembers.has(id) && !member.user.bot) {
                    const hasExcludedRole = member.roles.cache.some(role => excludedRoles.includes(role.id));
                    if (!hasExcludedRole) {
                        await member.ban({ reason: "Ana sunucuda bulunmayan üye" });
                        banCount++;
                    }
                }
            }

            const embed = new EmbedBuilder()
                .setColor("Random")
                .setDescription(`✅ | Temizlik tamamlandı! ${banCount} üye banlandı.`);

            interaction.reply({ embeds: [embed] });
        } else {
            interaction.reply({ content: "❌ | Sunucular bulunamadı.", ephemeral: true });
        }
    },
};
