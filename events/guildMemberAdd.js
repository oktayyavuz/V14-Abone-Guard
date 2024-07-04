const config = require("../config.json");

module.exports = {
    name: 'guildMemberAdd',
    async run(client, member) {
        const mainServer = client.guilds.cache.get(config.anasunucuID);

        if (!mainServer) return;

        try {
            const mainMembers = await mainServer.members.fetch();
            
            if (!mainMembers.has(member.id) && !member.user.bot) {
                const excludedRoles = config.excludedRoles || [];
                const hasExcludedRole = member.roles.cache.some(role => excludedRoles.includes(role.id));
                
                if (!hasExcludedRole) {
                    await member.ban({ reason: "Ana sunucuda bulunmayan üye" });
                }
            }
        } catch (error) {
            console.error(`Bir hata oluştu: ${error}`);
        }
    },
};