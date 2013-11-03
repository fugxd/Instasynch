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
    //load settings
    var setting = settings.get('autocompleteEmotes');
    if(setting){
        autocompleteEmotes = setting ==='false'?false:true;
    }else{
        settings.set('autocompleteEmotes',true);
    }

    setting = settings.get('autocompleteTags');
    if(setting){
        autocompleteTags = setting ==='false'?false:true;
    }else{
        settings.set('autocompleteTags',true);
    }

    setting = settings.get('autocompleteCommands');
    if(setting){
        autocompleteCommands = setting ==='false'?false:true;
    }else{
        settings.set('autocompleteCommands',true);
    }
    
    setting = settings.get('autocompleteAddonSettings');
    if(setting){
        autocompleteAddonSettings = setting ==='false'?false:true;
    }else{
        settings.set('autocompleteAddonSettings',true);
    }
    var emotes = (function () {
        var arr = Object.keys($codes);

        for (var i = 0; i < arr.length; i++) {
            arr[i] = '/' + arr[i];
        }
        return arr;
        })(),
        commands = [
            "'skip",
            "'reload",
            "'resynch",
            "'togglePlaylistLock",
            "'toggleFilter",
            "'toggleAutosynch",
            "'togglePlayer",
            "'printWallCounter",
            "'mirrorPlayer",
            "'printAddonSettings"
        ],
        modCommands = [
            "'ready",
            "'kick ",
            "'ban ",
            "'unban ",
            "'clean",
            "'remove ",
            "'purge ",
            "'move ",
            "'play ",
            "'pause",
            "'resume",
            "'seekto ",
            "'seekfrom ",
            "'setskip ",
            "'banlist",
            "'modlist",
            "'save",
            "'leaverban ",
            //commented those so you can't accidently use them
            //"'clearbans",
            //"'motd ",
            //"'mod ",
            //"'demod ",
            //"'description ",
            "'next"
        ],
        tagKeys = Object.keys(tags);

    addOnSettings = [
        ":toggleAutocompleteTags",
        ":toggleAutocompleteEmotes",
        ":toggleAutocompleteCommands",
        ":toggleAutocompleteAddOnSettings",
        ":toggleAutomaticPlayerMirror",
        ":toggleTags",
        ":toggleNSFWEmotes"
    ];
    if (window.isMod) {
        commands = commands.concat(modCommands);
    }

    for (var i = 0; i < tagKeys.length; i++) {
        tagKeys[i] = tagKeys[i].replace(/\\/g,'');
    }
    autocompleteData = autocompleteData.concat(emotes);
    autocompleteData = autocompleteData.concat(commands);
    autocompleteData = autocompleteData.concat(addOnSettings);
    autocompleteData = autocompleteData.concat(tagKeys);
    

    autocompleteData.sort();
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
            if(!autocomplete){
                return;
            }
            var message = request.term.split(' '),
                match = message[message.length-1].match(/((\[.*?\])*)(.*)/),
                partToComplete = match[3],
                matches = [];

            match[1] = (match[1])?match[1]:'';
            if(partToComplete.length>0){
                if(!autocompleteEmotes && partToComplete[0] === '/'){
                    return;
                }
                if(!autocompleteCommands && partToComplete[0] === '\''){
                    return;
                }
                if(!autocompleteTags && partToComplete[0] === '['){
                    return;
                }
                if(!autocompleteAddonSettings && partToComplete[0] === ':'){
                    return;
                }
                matches = $.map(autocompleteData, function (item) {
                    if (item.toLowerCase().indexOf(partToComplete.toLowerCase()) === 0) {
                        return item;
                    }
                });
            }
            //show only 7 responses
            response(matches.slice(0, 7));
        },
        autoFocus: true,
        focus: function()  {
            return false; // prevent value inserted on focus
        },
        select: function(event, ui) {
            var message = this.value.split(' '),
                match = message[message.length-1].match(/((\[.*?\])*)(.*)/);
            match[1] = (match[1])?match[1]:'';
            message[message.length-1] = match[1] + ui.item.value;
            this.value = message.join(' ');

            //if the selected item is a emote trigger a fake enter event
            if((ui.item.value[0] === '/') || ((ui.item.value[0] === '\''|| ui.item.value[0] === ':') && ui.item.value[ui.item.value.length-1] !== ' ')){
                $(this).trigger($.Event( 'keypress', { which: 13,keyCode : 13 })); 
            }
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

var isAutocompleteMenuActive = false,
    autocomplete = true,
    autocompleteEmotes = true,
    autocompleteCommands = true,
    autocompleteTags = true,
    autocompleteAddonSettings = true,
    autocompleteData = [];

afterConnectFunctions.push(loadAutoComplete);