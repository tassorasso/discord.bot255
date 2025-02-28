require('dotenv').config();
const Discord = require("discord.js");
const Client = new Discord.Client();
const BOT_TOKEN = process.env.BOT_TOKEN;

Client.on("ready", () => {
  console.log("Bot is Ready");

  function sendReminderMessage() {
    Client.guilds.cache.forEach(guild => {
      const reminderChannel = guild.channels.cache.find(c => c.name === "reminder" && c.isText());
      if (reminderChannel) {
        console.log('summon time!');
        let counter = 0;
        const interval = setInterval(() => {
          if (counter < 5) {
            reminderChannel.send("@here summon time");
            counter++;
          } else {
            clearInterval(interval);
          }
        }, 5000);
      } else {
        console.log(`Channel reminder not found in guild: ${guild.name}`);
      }
    });
  }

  function sendCountdownMessage() {
    Client.guilds.cache.forEach(guild => {
      const countdownChannel = guild.channels.cache.find(c => c.name === "countdown" && c.isText());
      if (countdownChannel) {
        const now = new Date();
        const minutes = now.getUTCMinutes();
        const seconds = now.getUTCSeconds();

        const minutesLeft = (29 - (minutes % 29) - 1);
        const timeLeft = `${minutesLeft}m ${60 - seconds}s until next summon`;

        console.log(timeLeft);
        countdownChannel.send(timeLeft);
      } else {
        console.log(`Channel countdown not found in guild: ${guild.name}`);
      }
    });
  }

  setInterval(sendCountdownMessage, 60000);

  setTimeout(() => {
    sendReminderMessage();
    setInterval(sendReminderMessage, 29 * 60 * 1000);
  }, 29 * 60 * 1000);
});

Client.on("message", (message) => {
  if (message.author.bot) return;
});

Client.login(BOT_TOKEN);
