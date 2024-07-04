const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require("croxydb");
const config = require("../config.json");
module.exports = {
    name: "abone-rol",
    description: "Birine abone rolü ver!",
    type: 1,
    options: [
        {
            name: "kullanıcı",
            description: "Abone rolü verilecek kullanıcıyı seçin!",
            type: 6, 
            required: true
        },
    ],
    run: async(client, interaction) => {
        const yetkiliRolId = db.get("aboneRolYetkilisi");
        const aboneRolId = db.get("aboneRol");

        if (!yetkiliRolId || !aboneRolId) {
            return interaction.reply({ content: "❌ | Abone rol sistemi ayarlanmamış!", ephemeral: true });
        }

        if (!interaction.member.roles.cache.has(yetkiliRolId)) {
            return interaction.reply({ content: "❌ | Bu komutu kullanmak için gerekli yetkiye sahip değilsiniz!", ephemeral: true });
        }

        const kullanıcı = interaction.options.getMember('kullanıcı');
        const aboneRol = interaction.guild.roles.cache.get(aboneRolId);

        kullanıcı.roles.add(aboneRol);

        // Kullanıcıya özel mesaj gönder
        const dmEmbed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`✅ | Abone rolünüz verildi! Bu kanaldan altyapılar sunucusuna erişebilirsiniz.\n Kanal: ${config.abonerolkanallink}`);
        
        kullanıcı.send({ embeds: [dmEmbed] }).catch(err => console.log(`DM gönderilemedi: ${err}`));

        const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`✅ | Başarıyla ${kullanıcı} kullanıcısına abone rolü verildi!`);
        
        interaction.reply({ embeds: [embed] });
    },
};