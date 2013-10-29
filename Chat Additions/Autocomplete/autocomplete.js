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

    //change to false to exlude from autocomplete
    var autocompleteEmotes = true;
    var autocompleteCommands = true;
    var autocompleteTags = true;

    var emotes = (function () {
        var arr = Object.keys($codes);

        for (var i = 0; i < arr.length; i++) {
            arr[i] = '/' + arr[i];
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
        "'kick",
        "'ban",
        "'unban",
        "'clean",
        "'remove",
        "'purge",
        "'move",
        "'play",
        "'pause",
        "'resume",
        "'seekto",
        "'seekfrom",
        "'setskip",
        "'banlist",
        "'modlist",
        "'save",
        "'leaverban",
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
    var tagKeys = Object.keys(tags);

    for (var i = 0; i < tagKeys.length; i++) {
        tagKeys[i] = tagKeys[i].replace(/\\/g,'');
    }

    var data = [];
    if(autocompleteEmotes){
        data = data.concat(emotes);
    } 
    if(autocompleteCommands){
        data =  data.concat(commands);
    }
    if(autocompleteTags){
        data = data.concat(tagKeys);
    }

    data.sort();
    //add the jquery autcomplete widget to InstaSynch's input field
    $("#chat input")    
    .bind("keydown", function(event) {
        // don't navigate away from the field on tab when selecting an item
        if (event.keyCode === $.ui.keyCode.TAB && isAutocompleteMenuActive) {
            event.keyCode = $.ui.keyCode.ENTER;  // fake select the item
            $(this).trigger(event);
        }
    })
    .autocomplete({
        delay: 0,
        minLength: 0,
        source: function (request, response) {
            var message = request.term.split(' ');
            var match = message[message.length-1].match(/((\[.*?\])*)(.*)/);
            match[1] = (match[1])?match[1]:'';
            var partToComplete = match[3];
            var matches = [];
            if(partToComplete.length>0){
                matches = $.map(data, function (item) {
                    if (item.toLowerCase().indexOf(partToComplete.toLowerCase()) === 0) {
                        return item;
                    }
                });
            }
            //show only 7 responses
            response(matches.slice(0, 7));
        },
        autoFocus:true,
        focus: function()  {
            return false; // prevent value inserted on focus
        },
        select: function(event, ui) {
            var message = this.value.split(' ');
            var match = message[message.length-1].match(/((\[.*?\])*)(.*)/);
            match[1] = (match[1])?match[1]:'';
            message[message.length-1] = match[1] + ui.item.value;
            this.value = message.join(' ');
            return false;
        },
        close : function(){
            isAutocompleteMenuActive = false;
        },
        open : function(){
            isAutocompleteMenuActive = true;
        }
    });
}
var isAutocompleteMenuActive = false;
afterConnectFunctions.push(loadAutoComplete);