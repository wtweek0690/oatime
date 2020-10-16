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
        var current_time = calcTime()
        
        return message.channel.send(`Current time in UTC${_sign()}${config.offset.hour}:${config.offset.minutes} is ${current_time.getHours()}:${current_time.getMinutes()}`)
    }
})

function _sign(){
    if(config.offset.add)
        return "+"
    else
        return "-"
}

function calcTime(){
    var current_time = new Date()

    if(config.offset.add){
        current_time.setUTCHours(current_time.getUTCHours() + config.offset.hour)
        current_time.setUTCMinutes(current_time.getUTCMinutes() + config.offset.minutes)
    }else{
        current_time.setUTCHours(current_time.getUTCHours() - config.offset.hour)
        current_time.setUTCMinutes(current_time.getUTCMinutes() - config.offset.minutes)
    }

    return current_time
}

function time_channel_check(guildid, channelid, json, wait_time){ // string, string, array, time in millisecond 
    const guild = client.guilds.cache.get(guildid)
    const channel = guild.channels.cache.get(channelid)
    
    var channelname = channel.name;

    var current_time = calcTime().getTime()

    var sunrise_time = calcTime()
    sunrise_time.setHours(parseInt(json[0].time.hour), parseInt(json[0].time.minute))

    var morning_time = calcTime()
    morning_time.setHours(parseInt(json[1].time.hour), parseInt(json[1].time.minute))

    var sunset_time = calcTime()
    sunset_time.setHours(parseInt(json[2].time.hour), parseInt(json[2].time.minute))
    
    var night_time = calcTime()
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