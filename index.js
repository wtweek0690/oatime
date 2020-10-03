const Discord = require('discord.js');
const config = require('./config.json')

const client = new Discord.Client();
client.once('ready', () => {
    console.log('Ready!');
    
    time_channel_check(config.guildid, config.channelid, config.time, config.offset, config.checktime)
});

function time_channel_check(guildid, channelid, json, offset, wait_time){ // string, string, array, time in millisecond 
    const guild = client.guilds.cache.get(guildid)
    const channel = guild.channels.cache.get(channelid)
    
    var channelname = channel.name;

    var sunrise_time = calcTime(offset)
    sunrise_time.setHours(json[0].time.hour, json[0].time.minute, 0)

    var morning_time = calcTime(offset)
    morning_time.setHours(json[1].time.hour, json[1].time.minute, 1)

    var sunset_time = calcTime(offset)
    sunset_time.setHours(json[2].time.hour, json[2].time.minute, 2)
    
    var night_time = calcTime(offset)
    night_time.setHours(json[3].time.hour, json[3].time.minute, 3)

    if(night_time.getTime() - Date.now() < 0){
        channelname = json[3].name
    }else if(sunset_time.getTime() - Date.now() < 0){
        channelname = json[2].name
    }else if(morning_time.getTime() - Date.now() < 0){
        channelname = json[1].name
    }else if(sunrise_time.getTime() - Date.now() < 0){
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
        time_channel_check(guildid, channelid, json, offset, wait_time)
    }, wait_time)

} 

function calcTime(offset) {
    var to_return = new Date();
    if(offset.add == true){
        to_return.setHours(to_return.getHours() + offset.hour)
        to_return.setMinutes(to_return.getMinutes() + offset.minutes)
    }else{
        to_return.setHours(to_return.getHours() - offset.hour)
        to_return.setMinutes(to_return.getMinutes() - offset.minutes)
    }
    return to_return
}

client.login(config.token);