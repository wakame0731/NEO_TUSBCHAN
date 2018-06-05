var config = require('config');

var mc = require('minecraft-protocol');
var client = mc.createClient({
  host: config.MCServer.IP,
  port: config.MCServer.IP.Port,
  username: config.MCAccount.ID,
  password: config.MCAccount.Pass,
});
var Discord = require('discord.js');
var client_discord = new Discord.Client();
var channel_id = config.Discord_Channnel;

/*minecraftのチャットを取得してDiscordに投げる */
client.on('chat', function(packet) {
    console.log(packet.message);
    var msg = JSON.parse(packet.message);
    try {
      var user = msg.with[0].text;
      var content = msg.with[1].extra[0].text;
      console.log("[C]"+user+" » "+content);
      client_discord.channels.get(channel_id).send("[C]"+user+" » "+content);  
    } catch (error) {
      console.log("error!\n"+packet.message);
    }
});
/*
client.on('player_info', function(packet) {
  var user = JSON.parse(packet.action);
  var data = JSON.parse(packet.data);
});*/

client_discord.on('ready', () => {
	console.log('NEO TUSBちゃん起動!\n');
});

client_discord.on('message', message => {
    if(message.channel.id==channel_id && message.content!="" && message.author.id!=client_discord.user.id){
        msg = "/tellraw @a {\"text\":\"[Discord]"+message.author.username+" » "+message.content+"\"}";
        console.log("[Discord]"+message.author.username+" » "+message.content);
        client.write('chat', {message: msg});
    }
});
client_discord.login(config.Discord_Key);