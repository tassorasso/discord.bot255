require('dotenv').config();
const Discord = require("discord.js");
const Client = new Discord.Client();
const BOT_TOKEN = process.env.BOT_TOKEN;

Client.on("ready", () => {
  console.log("Bot is Ready");

  // Function to calculate the delay until the next :30 minute mark
  function getNextInterval() {
    const now = new Date();
    const minutes = now.getUTCMinutes();
    let nextAlertMinute;

    // Always target the 30-minute mark
    if (minutes < 30) {
      nextAlertMinute = 27; // 3 minutes earlier than 30-minute mark
    } else {
      nextAlertMinute = 57; // 3 minutes earlier than the next full hour (i.e., 60 minutes)
    }

    // Calculate the delay in minutes until the next alert
    const delayMinutes = (nextAlertMinute - minutes + 60) % 60;
    const delay = delayMinutes * 60 * 1000 - (now.getUTCSeconds() * 1000); // Convert to milliseconds

    console.log(`Next alert in ${delayMinutes} minutes.`);
    return delay;
  }

  // Function to send the reminder message to the "reminder" channel
  function sendReminderMessage() {
    const guild = Client.guilds.cache.first(); // Fetch the first guild the bot is in
    if (guild) {
      const reminderChannel = guild.channels.cache.find(c => c.name === "reminder" && c.isText()); // Find the "reminder" channel
      if (reminderChannel) {
        console.log('Sending reminder message!');
        // Send the @here message 5 times with 5-second intervals
        let counter = 0;
        const interval = setInterval(() => {
          if (counter < 5) {
            reminderChannel.send("@here summon time");
            counter++;
          } else {
            clearInterval(interval); // Stop after 5 messages
          }
        }, 5000); // 5 seconds between messages
      } else {
        console.log('Channel "reminder" not found.');
      }
    } else {
      console.log('Bot is not in any guilds!');
    }
  }

  // Function to send the countdown to the "countdown" channel
  function sendCountdownMessage() {
    const now = new Date();
    const minutes = now.getUTCMinutes();
    const seconds = now.getUTCSeconds();

    const guild = Client.guilds.cache.first(); // Fetch the first guild the bot is in
    if (guild) {
      const countdownChannel = guild.channels.cache.find(c => c.name === "countdown" && c.isText()); // Find the "countdown" channel
      if (countdownChannel) {
        let nextAlertMinute = 27; // Always aim for 27 minutes (3 minutes before 0:30)

        const minutesLeft = (nextAlertMinute - minutes + 60) % 60;
        const timeLeft = `${minutesLeft}m until next summon`;

        console.log(timeLeft); // For logging purposes
        countdownChannel.send(timeLeft); // Send the countdown message to the "countdown" channel
      } else {
        console.log('Channel "countdown" not found.');
      }
    }
  }

  // Start the countdown messages every minute (once per minute)
  setInterval(sendCountdownMessage, 60000); // Every 60 seconds (1 minute)

  // Wait until the next :30 minute mark (but send reminder 3 minutes earlier), then start sending reminders
  setTimeout(() => {
    sendReminderMessage();

    // After the first message, send every 30 minutes
    setInterval(sendReminderMessage, 30 * 60 * 1000); // Repeat every 30 minutes
  }, getNextInterval()); // Start after the calculated delay
});

Client.on("message", (message) => {
  if (message.author.bot) return;
});

Client.login(BOT_TOKEN);