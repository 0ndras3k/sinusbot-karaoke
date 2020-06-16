registerPlugin({
    name: 'Karaoke',
    version: '1.0.0',
    backends: ['ts3'],
    description: 'Karaoke texts in bot.',
    author: '0ndras3k <ja@0ndras3k.tech>',
    vars: [
        {   name: 'clientUids',
            title: 'clientUids',
            type: 'string'
        }
    ],
    requiredModules: ["http"]
}, (sinusbot, config) => {

    const event = require('event');
    const engine = require('engine');
    const http = require('http');
    const media = require('media');
    const audio = require('audio');

    function getKaraoke(text, client) {
        var celytext = "";
        var hudba = "";
        var name = "";
        http.simpleRequest({
            'method': 'GET',
            'url': 'https://api.frantajaros.cz/karaoke/?token=a6a9eb1c6f63e1ea99d6c6b09d2bde69&search=' + text,
            'timeout': 6000,
        }, function (error, response) {
            if (error) {
                engine.log("Request err: " + error);
                return;
            }
            if (response.statusCode != 200) {
                engine.log("HTTP Error: " + response.status);
                return;
            }
            res = response.data.toString();
            var obj = JSON.parse(res);
            celytext = obj.text;
            hudba = obj.youtube;
            name = obj.name;
            audio.say('Playing song ' + name, 'cz');
            media.yt(hudba);
            client.chat(celytext);
        });
    }

    event.on('chat', function(ev) {
        let msg = ev.text;
        let client = ev.client;
        var uids = config.clientUids.split(',');
        engine.log(msg);
        if (msg.includes("!karaoke")) {
        if (uids.indexOf(ev.client.uniqueID())){
            let text = msg.split(" ")[1];
            getKaraoke(text, client);
        }
        }
    });

});
