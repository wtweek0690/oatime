const Discord = require('discord.js');
const config = require('./config.json')

const client = new Discord.Client();
client.once('ready', () => {
    console.log('Ready!');
    
    time_channel_check(config.guildid, config.channelid, config.time, config.checktime)
});

client.on("message", (message)=>{
    if(message.content == "$time")
    {
        var current_time = calcTime(config.offset)
        
        return message.channel.send(`Current time in GMT${_sign()}${config.offset.hour}:${config.offset.minutes} is ${current_time.getUTCHours()}:${current_time.getUTCMinutes()}`)
    }
})

function _sign(){
    if(config.offset.add)
        return "+"
    else
        return "-"
}

function time_channel_check(guildid, channelid, json, wait_time){ // string, string, array, time in millisecond 
    const guild = client.guilds.cache.get(guildid)
    const channel = guild.channels.cache.get(channelid)
    
    var channelname = channel.name;

    var current_time = new Date().getTime()

    var sunrise_time = new Date()
    sunrise_time.setHours(parseInt(json[0].time.hour), parseInt(json[0].time.minute))

    var morning_time = new Date()
    morning_time.setHours(parseInt(json[1].time.hour), parseInt(json[1].time.minute))

    var sunset_time = new Date()
    sunset_time.setHours(parseInt(json[2].time.hour), parseInt(json[2].time.minute))
    
    var night_time = new Date()
    night_time.setHours(parseInt(json[3].time.hour), parseInt(json[3].time.minute))

    if(night_time.getTime() - current_time < 0){
        channelname = json[3].name
    }else if(sunset_time.getTime() - current_time < 0){
        channelname = json[2].name
    }else if(morning_time.getTime() - current_time < 0){
        channelname = json[1].name
    }else if(sunrise_time.getTime() - current_time < 0){
        channelname = json[0].name
    }

    if(channel.name != channelname){
        console.log(channelname)
        channel.setName(channelname).then(()=>{
            console.log("done")
        }).catch(err => {
            console.log(err)
        })
    }
    setTimeout(function() {
        time_channel_check(guildid, channelid, json, wait_time)
    }, wait_time)

} 

client.login(config.token);