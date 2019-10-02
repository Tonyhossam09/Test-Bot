const discord = require("discord.js");
const fs = require("fs");
const config = require("./config.json");
const bot = new discord.Client();
let cooldown = new Set();
let cdtime = 120000; //ms, 5min
let normal_cooldown = new Set();
let ncdtime = 21600000; //ms, 6hr

bot.on("ready", async() => {
    console.log("");
    console.log("Bot Loading...");
    console.log("Loaded!")
    console.log("Fully Authed!")
    console.log("Made By Defend#0001 And twenty#0020")
    bot.user.setActivity(config.description);
});

bot.commands = new discord.Collection();
fs.readdir("./commands/", (err, files) => {
    if(err) console.error(err);
    let jsfiles = files.filter(f => f.split(".").pop() == "js");

    if(jsfiles.length <= 0) {
        console.log("No commands avaible.");
        return;
    }
    console.log(`Loading ${jsfiles.length} commands:`);
    jsfiles.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${i + 1}: ${f} loaded.`);
        bot.commands.set(props.help.name, props);  
    });
});

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    
    if (message.channel.id === config.channel) {
        if(message.content.toLowerCase() == config.prefix+"bitdefender" || message.content.toLowerCase() == config.prefix+"hulu" || message.content.toLowerCase() == config.prefix+"ipvanish" || message.content.toLowerCase() == config.prefix+"minecraft" || message.content.toLowerCase() == config.prefix+"moviepass" || message.content.toLowerCase() == config.prefix+"nordvpn" || message.content.toLowerCase() == config.prefix+"scribd" || message.content.toLowerCase() == config.prefix+"stock" || message.content.toLocaleLowerCase() == config.prefix+"customstore") {
            if (message.content.toLowerCase() == config.prefix+"stock") {} else if(message.content.toLowerCase() == config.prefix+"sfa") {
                if(!message.member.roles.some(role => role.name === 'PREMIUM')) {
                    return message.channel.send("```You aren't allowed to perform this command.```").then(msg => msg.delete(3500));
                }
            }
            else if(!message.content.toLowerCase().startsWith(config.prefix)) { 
                message.channel.send("```Only commands are allowed in this channel.```").then(msg => msg.delete(3500));
            } else {
                if(message.member.roles.some(role => role.name === 'VIP') || message.member.roles.some(role => role.name === 'ULTRA')) {
                    if(cooldown.has(message.author.id)) {
                        message.delete();
                        return message.channel.send("```You have to wait 2 minutes to perform this command.```").then(msg => msg.delete(3500));
                    }
                    cooldown.add(message.author.id)
                    setTimeout(() => {
                        cooldown.delete(message.author.id)
                    }, cdtime);
                } else if(message.member.roles.some(role => role.name === 'Generator')) {
                    if (message.content.toLowerCase() == config.prefix+"ipvanish" || message.content.toLowerCase() == config.prefix+"moviepass") {
                        if(normal_cooldown.has(message.author.id)) {
                            return message.channel.send("```You aren't allowed to perform this command.```").then(msg => msg.delete(3500));
                        }
                    } else {
                        if(normal_cooldown.has(message.author.id)) {
                            message.delete();
                            return message.channel.send("```You have to wait 5 hours to perform this command.```").then(msg => msg.delete(3500));
                        }
                        normal_cooldown.add(message.author.id)
                        setTimeout(() => {
                            normal_cooldown.delete(message.author.id)
                        }, ncdtime);
                    }
                } else {
                    message.delete();
                    return message.channel.send("```Invite 3 friends to the server to gain access to the generator, or buy VIP/PREMIUM```").then(msg => msg.delete(5500));
                }
            }
        } else {
            message.delete();
            return message.channel.send("```Wrong command```").then(msg => msg.delete(3500));
        }
    } else {}

    let prefix = config.prefix;
    let messageArray = message.content.split(" ");
    let command = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);

    if(!command.startsWith(prefix)) return;
    let cmd = bot.commands.get(command.slice(prefix.length));
    if(cmd) cmd.run(bot, message, args);
});

bot.login(config.token);