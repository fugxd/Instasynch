// ==UserScript==
// @name        Autocomplete
// @namespace   Bibby
// @description autocompletes emotes and or commands
// @include     http://*.instasynch.com/rooms/*
// @include     http://instasynch.com/rooms/*
// @version     1
// @grant       none
// ==/UserScript==
loadAutoComplete();

function loadAutoComplete() {

    //wait until we got a connection to the server
    if (messages < 3) {
        setTimeout(function () {
            loadAutoComplete();
        }, 100);
        return;
    }

    //change to false to exlude from autocomplete
    var autocompleteEmotes = true;
    var autocompleteCommands = true;

    var emotes = (function () {
        var arr = Object.keys($codes);

        for (var i = 0; i < arr.length; i++) {
            arr[i] = "/" + arr[i];
        }
        return arr;
    })();

    var commands = [
        "'skip",
        "'reload",
        "'resynch",
        "'toggleplaylistlock",
        "'togglefilter",
        "'toggleautosynch"
    ];
    var modCommands = [
        "'ready",
        "'kick ",
        "'ban ",
        "'unban ",
        "'clean",
        "'next",
        "'remove",
        "'purge",
        "'move ",
        "'play",
        "'pause",
        "'resume",
        "'seekto ",
        "'seekfrom ",
        "'setskip ",
        "'banlist",
        "'modlist",
        "'save",
        "'leaverban ",
        //"'clearbans",
        //"'motd ",
        //"'mod ",
        //"'demod ",
        //"'description ",
        "'next"
    ];

    if (window.isMod) {
        //add mod commands
        commands = commands.concat(modCommands);
    }

    var autocomplete = 
        (autocompleteEmotes && autocompleteCommands) ? 
            emotes.concat(commands) : 
        (autocompleteEmotes) ? 
            emotes : 
        (autocompleteCommands) ? 
            commands : 
        null;

    //add the jquery autcomplete widget to the input field
    $("#chat input").autocomplete({

        //this function is needed so that the string will be matched from the beginng so /a won't find /pekaface
        source: function (request, response) {
            var matches = $.map(autocomplete, function (item) {
                if (item.toUpperCase().indexOf(request.term.toUpperCase()) === 0) {
                    return item;
                }
            });

            //show only 7 responses
            response(matches.slice(0, 7));
        },
        delay: 0
    });
}