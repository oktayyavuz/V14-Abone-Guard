const { Collection, ButtonStyle, EmbedBuilder } = require("discord.js");
const db = require("croxydb");
const config = require("../config.json"); 
const Discord = require("discord.js");
const edb = require("croxydb")
const { readdirSync } = require("fs");
const Rank = require("../func/Rank.js");
const AddRank = require("../func/AddRank.js")
const { createButton, deleteMessageButton } = require("../function/functions");
const RemoveRank = require("../func/RemoveRank.js")
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType, PermissionsBitField } = require('discord.js');
const moment = require("moment");
  require("moment-duration-format");
  const os = require("os");

module.exports =  {
name: Discord.Events.InteractionCreate,

  run: async(client, interaction) => {
  if(interaction.isChatInputCommand()) {

    if (!interaction.guildId) return;

    readdirSync('./commands').forEach(f => {

      const cmd = require(`../commands/${f}`);

      if(interaction.commandName.toLowerCase() === cmd.name.toLowerCase()) {

		console.log(`Komut kullandı: ${interaction.user.tag} (${interaction.user.id}) (${interaction.guild.name}) `)

       return cmd.run(client, interaction, db, Rank, AddRank, RemoveRank);

      }


    });



  }
}

};

//