/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Faqqq- Modified InstaSynch client code>
    Copyright (C) 2013  Faqqq
    
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    http://opensource.org/licenses/GPL-3.0
*/



function loadAutoComplete() {

    //wait until we got a connection to the server
    //needs to be replaced with something better

    if (messages < 3) {
        setTimeout(function () {loadAutoComplete();}, 100);
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

    //add the jquery autcomplete widget to InstaSynch's input field
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

loadAutoComplete();

