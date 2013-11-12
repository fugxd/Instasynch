var afterConnectFunctions = [];
var beforeConnectFunctions = [];

function afterConnect(){
	if (messages < 3) {
	    setTimeout(function () {afterConnect();}, 100);
	    return;
	}

	for(var i = 0; i< afterConnectFunctions.length;i++){
		afterConnectFunctions[i]();
	}
}
function beforeConnect(){
	for(var i = 0; i< beforeConnectFunctions.length;i++){
		beforeConnectFunctions[i]();
	}
}/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

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
    if(afterConnectFunctions.lastIndexOf(loadAutoComplete) != afterConnectFunctions.length-1){
        afterConnectFunctions.push(loadAutoComplete);
        return;
    }
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

    //add the commands
    commands.set('addOnSettings',"TagsAutoComplete",toggleTagsAutocomplete);
    commands.set('addOnSettings',"EmotesAutoComplete",toggleEmotesAutocomplete);
    commands.set('addOnSettings',"CommandsAutoComplete",toggleCommandsAutocomplete);
    commands.set('addOnSettings',"AddOnSettingsAutoComplete",toggleAddonSettingsAutocomplete);

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
        tagKeys = Object.keys(tags);

    for (var i = 0; i < tagKeys.length; i++) {
        tagKeys[i] = tagKeys[i].replace(/\\/g,'');
    }
    autocompleteData = autocompleteData.concat(emotes);
    autocompleteData = autocompleteData.concat(commands.get('regularCommands'));
    autocompleteData = autocompleteData.concat(tagKeys);
    if (isUserMod()) {
        autocompleteData = autocompleteData.concat(commands.get('modCommands'));
    }

    autocompleteData.sort();
    autocompleteData = autocompleteData.concat(commands.get('addOnSettings').sort());
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
            var message = request.term,
                caretPosition = doGetCaretPosition(cin),
                lastIndex = lastIndexOfSet(message.substring(0,caretPosition),['/','\'','[','~']),
                partToComplete = message.substring(lastIndex,caretPosition),
                matches = [];

            if(partToComplete.length>0){
                switch(partToComplete[0]){
                    case '/': if(!autocompleteEmotes) return;
                    case "'": if(!autocompleteCommands) return;
                    case '[': if(!autocompleteTags) return;
                    case '~': if(!autocompleteAddonSettings) return;
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

            var message = this.value,
                caretPosition = doGetCaretPosition(cin),
                lastIndex = lastIndexOfSet(message.substring(0,caretPosition),['/','\'','[','~']);
            //prevent it from autocompleting when a little changed has been made and its already there
            if(message.indexOf(ui.item.value) === lastIndex && lastIndex+ui.item.value.length !== caretPosition){
                doSetCaretPosition(cin,lastIndex+ui.item.value.length);
                return false;
            }
            //insert the autocompleted text and set the cursor position after it
            this.value = message.substring(0,lastIndex) + ui.item.value + message.substring(caretPosition,message.length);
            doSetCaretPosition(cin,lastIndex+ui.item.value.length);
            //if the selected item is a emote trigger a fake enter event
            if(lastIndex === 0 && ((ui.item.value[0] === '/') || ((ui.item.value[0] === '\''|| ui.item.value[0] === '~') && ui.item.value[ui.item.value.length-1] !== ' '))){
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
function lastIndexOfSet(input, set){
    var index = -1;
    for (var i = 0; i < set.length; i++) {
        index = Math.max(index, input.lastIndexOf(set[i]));
    }
    return index;
}
var isAutocompleteMenuActive = false,
    autocomplete = true,
    autocompleteEmotes = true,
    autocompleteCommands = true,
    autocompleteTags = true,
    autocompleteAddonSettings = true,
    autocompleteData = [];

function toggleTagsAutocomplete(){
    autocompleteTags = !autocompleteTags; 
    settings.set('autocompleteTags',autocompleteTags);
}
function toggleEmotesAutocomplete(){
    autocompleteEmotes = !autocompleteEmotes; 
    settings.set('autocompleteEmotes',autocompleteEmotes);
}
function toggleCommandsAutocomplete(){
    autocompleteCommands = !autocompleteCommands; 
    settings.set('autocompleteCommands',autocompleteCommands);
}
function toggleAddonSettingsAutocomplete(){
    autocompleteAddonSettings = !autocompleteAddonSettings; 
    settings.set('autocompleteAddonSettings',autocompleteAddonSettings);
}

afterConnectFunctions.push(loadAutoComplete);
/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

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

function loadAutoscrollFix(){

    //remove autoscroll stop on hover (for now by cloning the object and thus removing all events)
    //could not figure out how to delete an anonymous function from the events
    var old_element = document.getElementById("chat_list"),
        new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);

    //all not working
    // var eventListeners = jQuery._data( chat_list, "events" );
    // for(var e in eventListeners){
    //     if(e === 'mouseover' || e === 'mouseout'){
    //         $('#chat_list')[0].removeEventListener(e,eventListeners[e][0]['handler']);
    //         $('#chat_list').unbind(e,eventListeners[e][0]['handler']);
    //     }
    // }
    // $('#chat_list').unbind('mouseover');
    // $('#chat_list').unbind('mouseout');
    // $('#chat_list').unbind('hover');


    //add a scrolling event to the chat
    $('#chat_list').on('scroll',function()
    {
        var scrollHeight = $(this)[0].scrollHeight, 
            scrollTop = $(this).scrollTop(),   
            height = $(this).height();

        //scrollHeight - scrollTop will be 290 when the scrollbar is at the bottom
        //height of the chat window is 280, not sure where the 10 is from
        if ((scrollHeight - scrollTop) < height*1.05){
            autoscroll = true;
        }else{
            autoscroll = false;
        }
    });

    //overwrite cleanChat Function so it won't clean when autoscroll is off
    //,also clean all the messages until messages === MAXMESSAGES
    cleanChat = function cleanChat(){
        var max = MAXMESSAGES;
        //increasing the maximum messages by the factor 2 so messages won't get cleared 
        //and won't pile up if the user goes afk with autoscroll off
        if(!autoscroll){
            max = max*2;
        }
        while(messages > max){
            $('#chat_list > :first-child').remove(); //span user
            $('#chat_list > :first-child').remove(); //span message
            $('#chat_list > :first-child').remove(); //<br>
            messages--;
        }
    };
}


afterConnectFunctions.push(loadAutoscrollFix);
/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

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


function loadInputHistory(){

    $("#chat input").bind('keypress',function(event){
        if(event.keyCode === 13){
            if($(this).val() != ""){
                if(inputHistoryIndex != 0){
                    //remove the string from the array
                    inputHistory.splice(inputHistoryIndex,1);
                }
                //add the string to the array at position 1
                inputHistory.splice(1,0,$(this).val());

                //50 messages limit (for now)
                if(inputHistory.length === 50){
                    //delete the last
                    inputHistory.splice(inputHistory.length-1,1);
                }
                setInputHistoryIndex(0);
            }
        }else{
            setInputHistoryIndex(0);
        }
    });    

    $("#chat input").bind('keydown',function(event){
        if(isAutocompleteMenuActive && inputHistoryIndex == 0){
            return ;
        }
        if(event.keyCode === 38){//upkey
            if(inputHistoryIndex < inputHistory.length){
                setInputHistoryIndex(inputHistoryIndex+1);
            }else{
                setInputHistoryIndex(0);
            }   
            //insert the string into the text field
            $(this).val(inputHistory[inputHistoryIndex]);         

        }else if(event.keyCode === 40){//downkey
            if(inputHistoryIndex > 0){
                setInputHistoryIndex(inputHistoryIndex-1);
            }else{
                setInputHistoryIndex(inputHistory.length-1);
            }            
            //insert the string into the text field
            $(this).val(inputHistory[inputHistoryIndex]);
        }
    });
}
function setInputHistoryIndex(index){
    inputHistoryIndex = index;
    if(index === 0){
        autocomplete = true;
    }else{
        autocomplete = false;
    }
}

var inputHistory = [""],
    inputHistoryIndex = 0;

beforeConnectFunctions.push(loadInputHistory);
/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

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

function loadLogInOffMessages(){
    //load settings
    var setting = settings.get('logInOffMessages');
    if(setting){
        logInOffMessages = setting ==='false'?false:true;
    }else{
        settings.set('logInOffMessages',false);
    }
    //add the command
    commands.set('addOnSettings',"LogInOffMessages",toggleLogInOffMessages);
    
    // Overwriting Adduser
    var oldAddUser = addUser;

    addUser = function(user, css, sort) {
        // Only if blackname or mod
        if (user.loggedin && logInOffMessages){
            addMessage('', user.username + ' logged on.', '','hashtext');
        }
        oldAddUser(user,css,sort);
    }

    // Overwriting removeUser
    var oldRemoveUser = removeUser;

    removeUser = function(id) {
        var user = users[getIndexOfUser(id)];
        if (user.loggedin && logInOffMessages){
            addMessage('',user.username + ' logged off.', '','hashtext');
            if (user.username === 'JustPassingBy'){
                addMessage('','Wish him a happy birthday !', '', 'hastext');
            }
        }
        oldRemoveUser(id);
    }
}

var logInOffMessages = false;

function toggleLogInOffMessages(){
    logInOffMessages = !logInOffMessages;
    settings.set('logInOffMessages',logInOffMessages);
}

afterConnectFunctions.push(loadLogInOffMessages);


/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

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


function loadMessageFilter() {
    //load settings
    var setting = settings.get('filterTags');
    if(setting){
        filterTags = setting ==='false'?false:true;
    }else{
        settings.set('filterTags',true);
    }

    setting = settings.get('NSFWEmotes');
    if(setting){
        NSFWEmotes = setting ==='false'?false:true;
    }else{
        settings.set('NSFWEmotes',false);
    }

    //add the commands
    commands.set('addOnSettings',"Tags",toggleTags);
    commands.set('addOnSettings',"NSFWEmotes",toggleNSFWEmotes);

    //init
    if(NSFWEmotes){
        $codes['boobies'] = '<spamtag><img src="http://i.imgur.com/9g6b5.gif" width="51" height="60" spam="1"></spamtag>';
        $codes['meatspin'] = '<img src="http://i.imgur.com/nLiEm.gif" width="30" height="30">';
    }
    var oldLinkify = linkify,
        oldAddMessage = addMessage,
        oldCreatePoll = createPoll;

    linkify = function linkify(str, buildHashtagUrl, includeW3, target) {
        var emotes =[],
            index = 0;
        //remove image urls so they wont get linkified
        str = str.replace(/src=\"(.*?)\"/gi,function(match){emotes.push(match); return 'src=\"\"';});
        str = oldLinkify(str, buildHashtagUrl, includeW3, target);
        //put them back in
        str = str.replace(/src=\"\"/gi,function(){return emotes[index++];});
        return str;
    };


    //overwrite InstaSynch's addMessage function
    addMessage = function addMessage(username, message, userstyle, textstyle) {
        var isChatMessage = true;
        if(username === ''){
            isChatMessage = false;
        }
        oldAddMessage(username, parseMessage(message,isChatMessage), userstyle, textstyle);
        //continue with InstaSynch's addMessage function
    };

    createPoll = function createPoll(poll){
        var i;
        poll.title = linkify(parseMessage(poll.title,false), false, true);
        for(i = 0; i< poll.options.length;i++){
            poll.options[i].option = parseMessage(poll.options[i].option,false);
        }
        oldCreatePoll(poll);
    };

}
function toggleTags(){
    filterTags = !filterTags; 
    settings.set('filterTags',filterTags);
}
function toggleNSFWEmotes(){
    if(!NSFWEmotes){
        $codes['boobies'] = '<spamtag><img src="http://i.imgur.com/9g6b5.gif" width="51" height="60" spam="1"></spamtag>';
        $codes['meatspin'] = '<img src="http://i.imgur.com/nLiEm.gif" width="30" height="30">';
        autocompleteData.push('/boobies');
        autocompleteData.push('/meatspin');
        autocompleteData.sort();
    }else{
        delete $codes['boobies'];
        delete $codes['meatspin'];
        autocompleteData.splice(autocompleteData.indexOf('/boobies'), 1);
        autocompleteData.splice(autocompleteData.indexOf('/meatspin'), 1);
    }
    NSFWEmotes = !NSFWEmotes;
    settings.set('NSFWEmotes',NSFWEmotes);
}

function parseMessage(message,isChatMessage){
    var emoteFound = false,
        match = message.match(/^((\[.*?\])*)\/([^\[ ]+)((\[.*?\])*)/i),
        emote,
        word;
    //if the text matches [tag]/emote[/tag] or /emote
    if (match &&isChatMessage) {
        emoteFound = true;
        emote = ($codes.hasOwnProperty(match[3].toLowerCase()))?$codes[match[3].toLowerCase()]: "/"+match[3];
        message = "<span class='cm'>" + match[1] + emote + match[4] + "</span>";
    } else {
        var greentext = false;
        //if the text matches [tag]>* or >*
        if (message.match(/^((\[.*?\])*)((&gt;)|>)/) ) {
            greentext = true;
        } else {
            //split up the message and add hashtag colors #SWAG #YOLO
            var words = message.split(" ");
            for (var i = 0; i < words.length; i++) {
                if (words[i][0] == "#") {
                    words[i] = "<span class='cm hashtext'>" + words[i] + "</span>";
                }
            }
            //join the message back together
            message = words.join(" ");
        }
        if (greentext) {
            message = "<span class='cm greentext'>" + message + "</span>";
        } else {
            message = "<span class='cm'>" + message + "</span>";
        }
    }
    if(!isChatMessage){
        //filter all emotes
        message = parseEmotes(message);
    }
    //filter words
    for (word in filteredwords) {
        message = message.replace(new RegExp(word, 'g'), filteredwords[word]);
    }
    //filter tags
    for (word in tags) {
        message = message.replace(new RegExp(word, 'gi'),function(){return (filterTags)?tags[word]:'';});
    }    
    //filter advancedTags
    for (word in advancedTags) {
        message = message.replace(new RegExp(advancedTags[word], 'g'),
            function(match, m1, m2){
                var ret = '';
                switch(word){
                    case 'hexcolor': ret = '<span style="color:' +m1+ '">';break;
                    case 'marquee' : ret = '<MARQUEE behavior="scroll" direction='+(m1?"left":"right")+' width="100%" scrollamount="'+ m2 +'">'; break;
                    case 'alternate': ret = '<MARQUEE behavior="alternate" direction="right" width="100%" scrollamount="'+ m1 +'">'; break;
                }
                return (filterTags)?ret:'';
            });
    }
    //remove unnused tags [asd] if there is a emote
    if(emoteFound && isChatMessage){
        message = message.replace(/\[.*?\]/, '');
    }
    
    return message;
}

//parse multiple emotes in a message
 function parseEmotes(message){
    var possibleEmotes = [],
        exactMatches = [],
        emoteStart = -1,
        emote = '',
        end = false,
        i,
        j,
        code;
    
    while(!end){
        emoteStart = message.indexOf('/',emoteStart+1);
        if(emoteStart == -1){
            end = true;
        }else{
            possibleEmotes = Object.keys($codes);
            exactMatches = [];
            emote = '';
            for(i = emoteStart+1; i< message.length;i++){
                emote += message[i];

                for(j = 0; j < possibleEmotes.length;j++){
                    if(emote.indexOf(possibleEmotes[j]) == 0 ){
                        exactMatches.push(possibleEmotes[j]);
                        possibleEmotes.splice(j,1);
                        j--;
                        continue;
                    }
                    if(possibleEmotes[j].indexOf(emote) != 0){
                        possibleEmotes.splice(j,1);
                        j--;
                    }
                }
                if(possibleEmotes.length == 0){
                    break;
                }
            }
            if(exactMatches.length != 0){
                code = $codes[exactMatches[exactMatches.length-1]];
                message = message.substring(0,emoteStart) + code + message.substring(emoteStart+exactMatches[exactMatches.length-1].length+1);
                i=emoteStart+ code.length;
            }
            emoteStart = i-1;

        }
    }
    return message;
}
function toggleNSFWEmotes(){
    if(!NSFWEmotes){
        $codes['boobies'] = '<spamtag><img src="http://i.imgur.com/9g6b5.gif" width="51" height="60" spam="1"></spamtag>';
        $codes['meatspin'] = '<img src="http://i.imgur.com/nLiEm.gif" width="30" height="30">';
        autocompleteData.push('/boobies');
        autocompleteData.push('/meatspin');
        autocompleteData.sort();
    }else{
        delete $codes['boobies'];
        delete $codes['meatspin'];
        autocompleteData.splice(autocompleteData.indexOf('/boobies'), 1); 
        autocompleteData.splice(autocompleteData.indexOf('/meatspin'), 1); 
    }
    NSFWEmotes = !NSFWEmotes;
    settings.set('NSFWEmotes',NSFWEmotes);
}

var filterTags = true,
    NSFWEmotes = false,
    filteredwords = {
    "skip": "upvote",
    "SKIP": "UPVOTE",
    "club": "party",
    "CLUB": "PARTY",
    "gay" : "hetero",
    "GAY" : "HETERO"
},
    advancedTags = {
       'hexcolor': '\\[(#[0-9A-F]{1,6})\\]',
       'marquee': '\\[marquee(-)?(\\d{1,2})\\]',
       'alternate': '\\[alt(\\d{1,2})\\]'
    },
    tags = {
    '\\[black\\]': '<span style="color:black">',
    '\\[/black\\]': '</span>',
    '\\[blue\\]': '<span style="color:blue">',
    '\\[/blue\\]': '</span>',
    '\\[darkblue\\]': '<span style="color:darkblue">',
    '\\[/darkblue\\]': '</span>',
    '\\[cyan\\]': '<span style="color:cyan">',
    '\\[/cyan\\]': '</span>',
    '\\[red\\]': '<span style="color:red">',
    '\\[/red\\]': '</span>',
    '\\[green\\]': '<span style="color:green">',
    '\\[/green\\]': '</span>',
    '\\[darkgreen\\]': '<span style="color:darkgreen">',
    '\\[/darkgreen\\]': '</span>',
    '\\[violet\\]': '<span style="color:violet">',
    '\\[/violet\\]': '</span>',
    '\\[purple\\]': '<span style="color:purple">',
    '\\[/purple\\]': '</span>',
    '\\[orange\\]': '<span style="color:orange">',
    '\\[/orange\\]': '</span>',
    '\\[blueviolet\\]': '<span style="color:blueviolet">',
    '\\[/blueviolet\\]': '</span>',
    '\\[brown\\]': '<span style="color:brown">',
    '\\[/brown\\]': '</span>',
    '\\[deeppink\\]': '<span style="color:deeppink">',
    '\\[/deeppink\\]': ' </span>',
    '\\[aqua\\]': '<span style="color:aqua">',
    '\\[/aqua\\]': '</span>',
    '\\[indigo\\]': '<span style="color:indigo">',
    '\\[/indigo\\]': '</span>',
    '\\[pink\\]': '<span style="color:pink">',
    '\\[/pink\\]': '</span>',
    '\\[chocolate\\]': '<span style="color:chocolate">',
    '\\[/chocolate\\]': '</span>',
    '\\[yellowgreen\\]': '<span style="color:yellowgreen">',
    '\\[/yellowgreen\\]': '</span>',
    '\\[steelblue\\]': '<span style="color:steelblue">',
    '\\[/steelblue\\]': '</span>',
    '\\[silver\\]': '<span style="color:silver">',
    '\\[/silver\\]': '</span>',
    '\\[tomato\\]': '<span style="color:tomato">',
    '\\[/tomato\\]': '</span>',
    '\\[tan\\]': '<span style="color:tan">',
    '\\[/tan\\]': '</span>',
    '\\[royalblue\\]': '<span style="color:royalblue">',
    '\\[/royalblue\\]': '</span>',
    '\\[navy\\]': '<span style="color:navy">',
    '\\[/navy\\]': '</span>',
    '\\[yellow\\]': '<span style="color:yellow">',
    '\\[/yellow\\]': '</span>',
    '\\[white\\]': '<span style="color:white">',
    '\\[/white\\]': '</span>',

    '\\[/span\\]': '</span>',
    '\\[/\\]': '</span>',

    '\\[rmarquee\\]': '<marquee>',
    '\\[/rmarquee\\]': '</marquee>',
    '\\[alt\\]': '<marquee behavior="alternate" direction="right">',
    '\\[/alt\\]': '</marquee>',
    '\\[falt\\]': '<marquee behavior="alternate" scrollamount="50" direction="right">',
    '\\[/falt\\]': '</marquee>',
    '\\[marquee\\]': '<marquee direction="right">',
    '\\[/marquee\\]': '</marquee>',
    '\\[rsanic\\]': '<MARQUEE behavior="scroll" direction="left" width="100%" scrollamount="50">',
    '\\[/rsanic\\]': '</marquee>',
    '\\[sanic\\]': '<MARQUEE behavior="scroll" direction="right" width="100%" scrollamount="50">',
    '\\[/sanic\\]': '</marquee>',
    '\\[spoiler\\]' : "<span style=\"background-color: #000;\" onmouseover=\"this.style.backgroundColor='#FFF';\" onmouseout=\"this.style.backgroundColor='#000';\">",
    '\\[/spoiler\\]': '</span>',

    '\\[i\\]': '<span style="font-style:italic">',
    '\\[/i\\]': '</span>',
    '\\[italic\\]': '<span style="font-style:italic">',
    '\\[/italic\\]': '</span>',
    '\\[strike\\]': '<strike>',
    '\\[/strike\\]': '</strike>',
    '\\[strong\\]': '<strong>',
    '\\[/strong\\]': '</strong>'
};


beforeConnectFunctions.push(loadMessageFilter);
/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

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

function loadModSpy(){
	//load settings
	var setting = settings.get('modSpy');
	if(setting){
		modSpy = setting ==='false'?false:true;
	}else{
		settings.set('modSpy',false);
	}
	//add command
    commands.set('addOnSettings',"ModSpy",toggleModSpy);

	// Overwriting console.log
	var oldLog = console.log, 
		oldMoveVideo = moveVideo;

	console.log = function (message) {
		// We don't want the cleaning messages in the chat (Ok in the console) .
		if (message && message.match && !message.match(/cleaned the playlist/g) && modSpy)
		{
			if (message.match(/ moved a video/g) && bumpCheck)
			{
				message = message.replace("moved","bumped");
				bumpCheck = false;
			}
			addMessage('', message, '','hashtext');   
		}
		oldLog.apply(console,arguments);
	};

	// Overwriting moveVideo to differentiate bump and move
	moveVideo = function(vidinfo, position) {
		oldMoveVideo(vidinfo,position);
		
		if ( Math.abs(getActiveVideoIndex()-position) <= 10){ // "It's a bump ! " - Amiral Ackbar
			bumpCheck = true;
		}
	}

}	
function toggleModSpy(){
	modSpy = !modSpy; 
	settings.set('modSpy',modSpy);
}
var modSpy = false,
	bumpCheck = false;

beforeConnectFunctions.push(loadModSpy);
/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

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


function loadAutocomplete() {
    $("#chat input").bind('keydown',function(event){
        
        if(event.keyCode == 9){//tab
            //prevent loosing focus from input
            event.preventDefault();
            //split the message
            var message = $(this).val().split(' '),
                //make a regex out of the last part 
                messagetags = message[message.length-1].match(/((\[.*?\])*\[?)([\w-]+)/),
                name,
                data,
                partToComplete = '',
                username,
                i,
                j,
                sub;
            if(!messagetags || !messagetags[3]){
                return;
            }
            if(!messagetags[1]){
                 messagetags[1] = '';
            }
            
            //make a regex out of the name
            name = new RegExp('^'+messagetags[3],'i');

            //find matching users
            for(i = 0; i< users.length;i++){
                username = users[i].username;
                if(username.match(name)){
                    if(partToComplete == ''){
                        partToComplete = username;
                    }else{
                        //check for partial matches with other found users
                        for(j = partToComplete.length; j>=0 ;j--){
                            sub = partToComplete.substring(0,j);
                            if(username.indexOf(sub) == 0){
                                partToComplete = sub;
                                break;
                            }
                        }
                    }
                }
            }
            if(partToComplete != ''){
                //put messagetags and the autocompleted name back into the message
                message[message.length-1] =messagetags[1] + partToComplete;
                $(this).val(message.join(' '));
            }

        }
    });

}

beforeConnectFunctions.push(loadAutocomplete);
/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

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

function loadOnClickKickBan(){

    var oldAddMessage = addMessage;

    //overwrite InstaSynch's  addMessage function
    addMessage = function addMessage(username, message, userstyle, textstyle) {
        
        oldAddMessage(username, message, userstyle, textstyle);
        //only add the onclick events if the user is a mod and its not a system message
        if(username != '' && isUserMod()){
            var currentElement,
                //the cursor doesnt need to be changed if the key is still held down
                isCtrlKeyDown = false,
                keyDown = 
                function(event){
                    if(!isCtrlKeyDown && (event.ctrlKey || (event.ctrlKey && event.altKey))) {
                        isCtrlKeyDown = true;
                        currentElement.css( 'cursor', 'pointer' );
                    }
                },
                keyUp = 
                function(event){
                    if(isCtrlKeyDown && !event.ctrlKey){
                        isCtrlKeyDown = false;
                        currentElement.css('cursor','default');
                    }
                };
            //add the events to the latest username in the chat list
            $('#chat_list > span:last-of-type').prev()
            .on('click', function(event){
                if(event.ctrlKey){
                    var user = $(this)[0].innerText,
                        userFound = false,
                        isMod = false,
                        userId,
                        i;
                    user = user.substring(0,user.length-1);
                    for(i = 0; i< users.length;i++){
                        if(users[i].username === user ) {
                            if(users[i].permissions > 0){
                                isMod = true;
                                break;
                            }
                            userId = users[i].id;
                            userFound = true;
                            break;
                        }
                    }       
                    if(event.altKey){
                        if(isMod){
                            addMessage('', "Can't ban a mod", '', 'hashtext');
                        }else{
                            if(userFound){
                                sendcmd('ban', {userid: userId});    
                                addMessage('', 'b& user: '+user, '', 'hashtext');
                            }else{
                                sendcmd('leaverban', {userid: userId});    
                                addMessage('', 'Leaverb& user: '+user, '', 'hashtext');
                            }
                        }
                    }else{          
                    if(isMod){
                            addMessage('', "Can't kick a mod", '', 'hashtext');
                        }else{
                            if(userFound){
                                sendcmd('kick', {userid: userId});   
                                addMessage('', 'Kicked user: '+user, '', 'hashtext');
                            }else{
                                addMessage('', "Didn't find the user", '', 'hashtext');
                            }
                        }
                    }
                }
            })        
            .hover(
            function(event){
                currentElement = $(this);
                $(document).bind('keydown',keyDown);
                $(document).bind('keyup',keyUp);
            },function(){       
                currentElement.css('cursor','default');
                isCtrlKeyDown = false;
                $(document).unbind('keydown',keyDown);
                $(document).unbind('keyup',keyUp);
            });
        }
    };
};


beforeConnectFunctions.push(loadOnClickKickBan);
/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

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

function loadBumpCommand(){
    commands.set('modCommands',"bump ",bump);
}

function bump(params){
    var user = params[1],
        bumpIndex = -1,
        i;
    
    if(!user){
        addMessage('','No user specified: \'bump [user]','','hashtext');
        return;
    }
    for (i = playlist.length - 1; i >= 0; i--) {
        if(playlist[i].addedby.toLowerCase() === user.toLowerCase()){
            bumpIndex = i;
            break;
        }
    }
    if (bumpIndex === -1){
        addMessage('',"The user didn't add any videos",'','hashtext');
    }else{
        sendcmd('move', {info: playlist[bumpIndex].info, position: getActiveVideoIndex()+1});
    }
}


beforeConnectFunctions.push(loadBumpCommand);
/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

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


function loadClearChatCommand(){
    commands.set('regularCommands',"clearChat",clearChat);
}

function clearChat(){
	$('#chat_list').empty();
	messages = 0;
}


beforeConnectFunctions.push(loadClearChatCommand);
/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

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

function loadCommandFloodProtect(){
    var oldsendcmd = sendcmd;
    sendcmd = function sendcmd(command, data){
        if(command){
            //add the command to the cache
            commandCache.push({command:command,data:data});
        }
        //are we ready to send a command?
        if(sendcmdReady){
            if(commandCache.length !== 0){
                //set not ready
                sendcmdReady = false;
                //send the command
                oldsendcmd(commandCache[0].command,commandCache[0].data);
                //remove the sent command
                commandCache.splice(0,1);
                //after 750ms send the next command
                setTimeout(function(){sendcmdReady = true;sendcmd();},750);
            }
        }
    }
}

var sendcmdReady = true,
    commandCache = [];
    
beforeConnectFunctions.push(loadCommandFloodProtect);
/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

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

function loadCommandLoader(){
    commands = new function() {
        var items = {};
        items['regularCommands'] = [
            "'reload",
            "'resynch",
            "'toggleFilter",
            "'toggleAutosynch"
        ]; 
        items['modCommands'] = [
            "'togglePlaylistLock",
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
        ];
        items['addOnSettings'] = [];
        items['commandFunctionMap'] = {};
        return {
            "set": function(arrayName, funcName, func) {
                if(arrayName === 'addOnSettings'){
                    funcName = "~"+funcName;
                }else{
                    funcName = "'"+funcName;
                }
                items[arrayName].push(funcName);
                items['commandFunctionMap'][funcName.toLowerCase()] = func;
            },
            "get": function(arrayName) {
                return items[arrayName];
            },
            "getAll":function(){
                return items;
            },
            "execute":function(funcName, params){
                funcName = funcName.toLowerCase();
                if(items['commandFunctionMap'].hasOwnProperty(funcName)){
                    items['commandFunctionMap'][funcName](params);
                }
                funcName = funcName +' ';
                if(items['commandFunctionMap'].hasOwnProperty(funcName)){
                    items['commandFunctionMap'][funcName](params);
                }
            }
        }
    };    

    $("#chat input").bind("keypress", function(event) {
        if (event.keyCode === $.ui.keyCode.ENTER) {
            var params = $(this).val().split(' ');
            commands.execute(params[0],params);
        }
    });
}
var commands;

beforeConnectFunctions.splice(0,0,loadCommandLoader);
/*
    Copyright (C) 2013  Bibbytube
   
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
 
function loadDescription(){
    var descr="";
    descr += "<p style=\"font-family: Palatino; text-align: center; \">";
    descr += "  <span style=\"color:#003399;\"><strong style=\"font-size: 20pt; \">Bibbytube<\/strong><\/span><\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 16pt; text-align: center; \">";
    descr += "  <strong>instasynch&#39;s most <img src=\"http:\/\/i.imgur.com\/L1Nuk.gif\" \/> room<\/strong><\/p>";
    descr += "<hr noshade color='black' width='550' size='5' align='center'>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  <span style=\"font-size: 14pt; \">Playlist is always unlocked, so add videos for everyone to watch.<\/span><\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  <span style=\"color:#003399;\">New content\/OC is appreciated.<\/span><\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 12pt; text-align: center; \">";
    descr += "  Note: Many of our videos are NSFW.<\/p>";
    descr += "<hr noshade color='black' width='550' size='5' align='center'>";
    descr += "<p style=\"font-family: Palatino; font-size: 18pt; text-align: center; \">";
    descr += "  <span style=\"color:#003399;\"><strong>Rules&nbsp;<\/strong><\/span><\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  1. No RWJ, Ponies, or Stale Videos. &nbsp;Insta-skip<\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  2. BEGGING FOR SKIPS IS FOR GAYLORDS<\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  3. &nbsp;NO SEAL JOKES<\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  &nbsp;<\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  If your video gets removed and shouldn't have been, try adding it later.<\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  MODS=GODS<\/p>";
    descr += "<p style=\"font-family: Palatino; font-size: 14pt; text-align: center; \">";
    descr += "  <strong><span style=\"color:#003399; font-family: Palatino; font-size: 18pt; \">Rules for the Reading Impaired<\/span><\/strong><\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  <a href=\"http:\/\/dl.dropbox.com\/u\/63790091\/BabbyRulesEnglish.mp3\"><img src=\"http:\/\/i.imgur.com\/LIXqI5Q.png?1\" \/><\/a><a href=\"http:\/\/dl.dropbox.com\/u\/63790091\/BabbyRulesDutch.mp3\"><img src=\"http:\/\/i.imgur.com\/giykE7C.jpg?1\" \/><\/a><a href=\"http:\/\/dl.dropbox.com\/u\/63790091\/BabbyRulesFrench.mp3\"><img src=\"http:\/\/i.imgur.com\/BucOmRs.png?1\" \/><\/a><a href=\"http:\/\/dl.dropbox.com\/u\/63790091\/BabbyRulesGerman.mp3\"><img src=\"http:\/\/i.imgur.com\/bTwmX9v.png?1\" \/><\/a><a href=\"http:\/\/dl.dropbox.com\/u\/63790091\/BabbyRulesSpanish.mp3\"><img src=\"http:\/\/i.imgur.com\/aZvktnt.png?1\" \/><\/a><\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  &nbsp;<\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  &nbsp;<\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  &nbsp;<\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  <strong><span style=\"color:#003399;\"><span style=\" font-family: Palatino; font-size: 18pt; \">Connect with Bibbytube in other ways!<\/span><\/span><\/strong><\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  &nbsp;<\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  <a href=\"http:\/\/steamcommunity.com\/groups\/Babbytube\"><img src=\"http:\/\/i.imgur.com\/AZHszva.png?1\" \/><\/a><\/p>";
    descr += "<p style=\"text-align: center; \">";
    descr += "  <a href=\"http:\/\/facebook.com\/babbytube\"><img src=\"http:\/\/i.imgur.com\/NuT2Bti.png?4\" \/><\/a><a href=\"http:\/\/twitter.com\/bibbytube_\/\"><img src=\"http:\/\/i.imgur.com\/T6oWmfB.png?4\" \/><\/a><\/p>";
    descr += "<script type=\"text\/javascript\" src=\"http:\/\/script.footprintlive.com\/?site=www.synchtube.com\"><\/script><noscript><a href=\"http:\/\/www.footprintlive.com\" target=\"_blank\"><img src=\"http:\/\/img.footprintlive.com\/?cmd=nojs&site=www.synchtube.com\" alt=\"user analytics\" border=\"0\"><\/a><\/noscript>";
    $("div.roomFooter ").html(descr);
}
 
 
beforeConnectFunctions.push(loadDescription);
/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

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


function loadGeneralStuff(){
    //get Username
    thisUsername = $.cookie('username');
}
function getActiveVideoIndex(){
    return $('.active').index();
}

function isUserMod(){
    return window.isMod;
}

function isBibbyRoom(){
    return ROOMNAME.match(/bibby/i)?true:false;
}
function getIndexOfUser(id){
    for (var i = 0; i < users.length; i++){
        if (id === users[i].id){
            return i;
        }
    }
    return -1
}
var thisUsername;

/*
** Returns the caret (cursor) position of the specified text field.
** Return value range is 0-oField.value.length.
** http://flightschool.acylt.com/devnotes/caret-position-woes/
*/
function doGetCaretPosition(oField) {

  // Initialize
  var iCaretPos = 0;

  // IE Support
  if (document.selection) {

    // Set focus on the element
    oField.focus ();

    // To get cursor position, get empty selection range
    var oSel = document.selection.createRange ();

    // Move selection start to 0 position
    oSel.moveStart ('character', -oField.value.length);

    // The caret position is selection length
    iCaretPos = oSel.text.length;
  }

  // Firefox support
  else if (oField.selectionStart || oField.selectionStart == '0')
    iCaretPos = oField.selectionStart;

  // Return results
  return (iCaretPos);
}

function doSetCaretPosition(oField, position) {
    //IE
    if (document.selection) {
        oField.focus ();
        var oSel = document.selection.createRange ();
        oSel.moveStart('character', position);
        oSel.moveEnd('character', position);
    }

    // Firefox support
    else if (oField.selectionStart || oField.selectionStart == '0'){
        oField.selectionStart = position;
        oField.selectionEnd = position;
    }
}
function pasteTextAtCaret(text) {
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            var textNode = document.createTextNode(text);
            range.insertNode(textNode);

            // Preserve the selection
            range = range.cloneRange();
            range.setStartAfter(textNode);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().text = text;
    }
}

beforeConnectFunctions.splice(0,0,loadGeneralStuff);
/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

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

function loadPurgeTooLongCommand(){
    commands.set('modCommands',"purgeTooLong ",purgeTooLong);
}

function purgeTooLong(params){
    var maxTimeLimit = params[1]?parseInt(params[1])*60:60*60,
        videos = [];

    //get all Videos longer than maxTimeLimit
    for (var i = 0; i < playlist.length; i++) {
        if(playlist[i].duration >= maxTimeLimit){
            videos.push({info:playlist[i].info, duration:playlist[i].duration});
        }
    }  

    function compareVideos(a,b){
        return b.duration - a.duration;
    };
    videos.sort(compareVideos);

    for (var i = 0; i < videos.length; i++) {
        sendcmd('remove', {info: videos[i].info});
    }
}

beforeConnectFunctions.push(loadPurgeTooLongCommand);
/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

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


function loadRemoveLast(){
    commands.set('modCommands',"removeLast ",removeLast);
}


// Remove the last video from the user 
function removeLast(params){
    if(!params[1]){
        addMessage('','No user specified: \'removeLast [user]','','hashtext');
        return;
    }
	var user = params[1],
		removeIndex = -1,
    	i;

	// Look for the user last added video
    for (i = playlist.length - 1; i >= 0; i--) {
        if(playlist[i].addedby.toLowerCase() === user.toLowerCase()){
            removeIndex = i;
            break;
        }
    }
	
	if (removeIndex === -1){
		addMessage('',"The user didn't add any video",'','hashtext');
	}else{
		sendcmd('remove', {info: playlist[removeIndex].info});
	}
		
}
		
beforeConnectFunctions.push(loadRemoveLast);
/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

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

function loadSettingsLoader(){
    var cookieName = 'InstaSynch Addons Settings',
        expire = { expires: 10*365 }; //settings expire in 10 years
    //slightly changed version of this: http://stackoverflow.com/a/1960049, so it saves a hashmap rather than just a array
    settings = new function() {
        var cookie = $.cookie(cookieName),
            array = cookie ? cookie.split(/,/):[],
            items = {},
            i;
    
        for(i = 0; i<array.length;i+=2){
            items[array[i]] = array[i+1];
        }
    
        return {
            "set": function(key, val) {
                if(!items.hasOwnProperty(key)){
                    array.push(key);
                    array.push(val);
                }else{
                    i = array.indexOf(key);
                    array[i+1] = val; 
                }
                items[key] = val;
                addMessage('', "["+key+": "+val+"] ", '', 'hashtext');
                $.cookie(cookieName, array.join(','),expire);
            },
            "remove": function (key) { 
    
                i = array.indexOf(key); 
                if(i!=-1) array.splice(i, 2); 
    
                delete items[key];
                $.cookie(cookieName, array.join(','),expire);        
            },
            "clear": function() {
                array = [];
                items = {};
                //clear the cookie.
                $.cookie(cookieName, null);
            },
            "get": function(key) {
                //Get all the array.
                return items[key];
            },
            "getAll": function() {
                return items;
            }
        }
    };
}
var settings;

function loadSettingsLoaderCommand(){
    commands.set('regularCommands',"printAddOnSettings",printAddonSettings);
}

function printAddonSettings(){
    var output ="";
    for(var key in settings.getAll()){
        output += "["+key+": "+settings.get(key)+"] ";
    }
    addMessage('', output, '', 'hashtext');
}
//settings need to be loaded first
beforeConnectFunctions.splice(0,0,loadSettingsLoader);
beforeConnectFunctions.push(loadSettingsLoaderCommand);
/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

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

function loadSkipCommand(){
    commands.set('regularCommands',"skip ",skip);
}

function skip(){	
	sendcmd("skip", null);
}

beforeConnectFunctions.push(loadSkipCommand);
/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

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

function loadTrimWallCommand(){
    commands.set('modCommands',"trimWall ",trimWall);
}

function trimWall(params){
    if(!params[1]){
        addMessage('','No user specified: \'trimWall [user] [maxMinutes]','','hashtext');
        return;
    }
    resetWallCounter();
    var user = params[1],
        maxTimeLimit = params[2]?parseInt(params[2])*60:60*60,
        currentTime = wallCounter[user],
        videos = [];

    if(currentTime < maxTimeLimit){
        addMessage('','The wall is smaller than the timelimit','','hashtext');
        return;
    }
    //get all Videos for the user
    for (var i = 0; i < playlist.length; i++) {
        if(playlist[i].addedby.toLowerCase() === user.toLowerCase()){
            videos.push({info:playlist[i].info, duration:playlist[i].duration});
        }
    }  

    function compareVideos(a,b){
        return b.duration - a.duration;
    };
    // function rmVideo(index, vidinfo){
    //     setTimeout(
    //         function(){
    //             sendcmd('remove', {info: vidinfo});
    //         }, 
    //         (index+1) * 750);
    // }
    //sort the array so we will get the longest first
    videos.sort(compareVideos);

    for (var i = 0; i < videos.length && currentTime > maxTimeLimit; i++) {
        currentTime-= videos[i].duration;
        // rmVideo(i,videos[i].info);
        //delay via commandFloodProtect.js
        sendcmd('remove', {info: videos[i].info});
    }
}

beforeConnectFunctions.push(loadTrimWallCommand);
/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

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

function loadVotePurgeCommand(){
    commands.set('modCommands',"votepurge ",votePurge);
}

function votePurge(params)
{
	var user = params[1],
		poll = new Object(),
		option;
				
	if (!user){
        addMessage('','No user specified: \'votePurge [user]','','hashtext');
		return;
	}
	
	poll.title = "Should we purge " + user + " ? /babyseal";
	poll.options = new Array();
	option = "Yes !";
	poll.options.push(option);
	option = "No !";
	poll.options.push(option);
	
	sendcmd("poll-create", poll);
}

beforeConnectFunctions.push(loadVotePurgeCommand);
var indexOfSearch;
var entries;

// Search results container
var divresults = document.createElement("div");
divresults.id = "searchResults";
applyStyle(divresults);

// Close button container
var divremove = document.createElement("div");
divremove.id = "divclosesearch";
applyStyle(divremove);

// "Moar" link container
var divmore = document.createElement("div");
divmore.id = "divmore";

// Getting poll container's parent to insert search result container
var divpolls = document.getElementsByClassName("poll-container")[0];
var divpollparent = divpolls.parentNode;
divpollparent.insertBefore(divresults,divpolls);


// Setting event "TAB" on the URL input
$("#URLinput").bind("keydown", function(event) {
 //    if (event.keyCode === $.ui.keyCode.TAB){    
 //     event.preventDefault();  // prevents lost of focus
 //     closeResults();
 //        search();
 //    }
 //    if(event.keyCode === $.ui.keyCode.LEFT){
 //    	   getMoreResults('last');
 //    	   return;
 //    }else if(event.keyCode === $.ui.keyCode.RIGHT){
 //    	   getMoreResults('next');
 //    	   return;
 //    }
    if(event.keyCode === $.ui.keyCode.ESCAPE){
        closeResults();
    }else{
        if(searchTimeout){
            clearInterval(searchTimeout);
        }
        searchTimeout = setTimeout(startSearch,500);  
    }
});
var searchTimeout;
function startSearch(){
    searchTimeout = null;
    closeResults();
    search();
}
// Retrieve data from the search query
function search(){
    var query,
        url;
    
    query = document.getElementById('URLinput').value;
    if(!query || parseUrl(query)){
    	return;
    }

    url = "https://gdata.youtube.com/feeds/api/videos?v=2&alt=json&format=5&max-results=45&q=" + query;
    indexOfSearch = 0;
    $.getJSON(url, function(data){showResults(data)});
}

// Parse data and display it
function showResults(data) {
  var feed = data.feed;
  entries = feed.entry || [];
  var html = new Array();
  
  for (var i = 0; i < 9; i++) {
    var entry = entries[i];
    var thumbnailUrl = entries[i].media$group.media$thumbnail[0].url;
    var thumbnail = "<img onmouseover='showTitle(this)' onmouseout='hideTitle(this)' src='" + thumbnailUrl + "'>";
    var title = entry.title.$t;
    var idtag = new Array();
    idtag = entry.id.$t.split(':');
    var id = idtag[3];
    var link = "http://www.youtube.com/watch?v=" + id;
    
    html.push("<div style='overflow:hidden;position:relative;float:left;height:90px;width:120px;margin:1px'  onClick='addLinkToPl(this)'>" + thumbnail + "<p  style='position:absolute;top:10px;visibility:hidden'><span style='background:rgba(0, 0, 0, 0.7);color:white'>" + title +  "</span></p><p style='display:none'>" + link + "</p> </div>");
  }
  $(html.join('')).appendTo("#searchResults");
  
  applyStyle(divmore);
  divresults.insertBefore(divremove,divresults.firstChild); // Somehow adding it before won't work
  divresults.appendChild(divmore);
  divresults.style.display = "block";
  divremove.style.display = "block";
} 

function getMoreResults(param){
    if (param === "last"){
        indexOfSearch = indexOfSearch - 9;
    }
    else{
        indexOfSearch = indexOfSearch + 9;
    }
    $("#searchResults").empty();
    var max = Math.min(indexOfSearch+9 , entries.length);
    var html = new Array();
    for (var i = indexOfSearch; i < max; i++) {
        var entry = entries[i];
        var thumbnailUrl = entries[i].media$group.media$thumbnail[0].url;
        var thumbnail = "<img onmouseover='showTitle(this)' onmouseout='hideTitle(this)' src='" + thumbnailUrl + "'>";
        var title = entry.title.$t;
        var idtag = new Array();
        idtag = entry.id.$t.split(':');
        var id = idtag[3];
        var link = "http://www.youtube.com/watch?v=" + id;
        
        html.push("<div style='overflow:hidden;position:relative;float:left;height:90px;width:120px;margin:1px'  onClick='addLinkToPl(this)'>" + thumbnail + "<p  style='position:absolute;top:10px;visibility:hidden'><span style='background:rgba(0, 0, 0, 0.7);color:white'>" + title +  "</span></p><p style='display:none'>" + link + "</p> </div>");
  }
  $(html.join('')).appendTo("#searchResults");
  applyStyle(divmore);
  divresults.insertBefore(divremove,divresults.firstChild); // Somehow adding it before won't work
  divresults.appendChild(divmore);
  divresults.style.display = "block";
  divremove.style.display = "block";
    
}
// shows the video title on hover
function showTitle(e){
    var titleToShow = e.parentNode.childNodes[1];
    titleToShow.style.visibility='visible';
}

// hide the video title on mouse out
function hideTitle(e){
    var titleToHide = e.parentNode.childNodes[1];
    titleToHide.style.visibility='hidden';
}
    
// Paste the title clicked in the add bar
function addLinkToPl(e) {
    var linkToPaste = e.childNodes[2].innerHTML;
    
    var addbox = document.getElementById("URLinput");
    addbox.value = linkToPaste;
}

// closes the results and empties it
function closeResults()
{
    $("#searchResults").empty();
    divresults.style.display = "none";
    divremove.style.display = "none";
}

// css thingies
function applyStyle(e)
{
    if (e.id === "searchResults")
    {
        divresults.style.cssFloat = "right"; // All but IE
        divresults.style.styleFloat = "right"; //IE
        divresults.style.width = "380px"; 
        divresults.style.marginTop = "10px";
        divresults.style.backgroundColor = "#DFDFDF";
        divresults.style.opacity = "0.9";
        divresults.style.padding = "5px";
        divresults.style.display = "none";
        divresults.style.position = "relative";
    }
    if (e.id === "divclosesearch")
    {
        divremove.innerHTML = "<img onClick=closeResults() src='http://www.instasynch.com/images/close.png'>";
        divremove.style.cssFloat = "right"; // All but IE
        divremove.style.styleFloat = "right"; //IE
        divremove.style.cursor = "pointer";
        divremove.style.display = "none";
        divremove.style.position = "absolute";
        divremove.style.left = "375px";
        divremove.style.top = "0px";    
    }
    if (e.id === "divmore")
    {
        if (indexOfSearch === 0)
        {
            divmore.innerHTML = "<a onClick=getMoreResults('next')> Next &gt&gt </a>";
        }
        else 
        {
            if (indexOfSearch >= 36)
            {
                divmore.innerHTML = "<a onClick=getMoreResults('last')>  &lt&lt Last </a> ";
            }
            else
            {
                divmore.innerHTML = "<a onClick=getMoreResults('last')> &lt&lt Last </a> <a onClick=getMoreResults('next')> Next &gt&gt </a>";
            }
        }
        divmore.style.textAlign="center";
        divmore.style.cursor="pointer";
    }
}
        
    
/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

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


function loadMirrorPlayer(){
    //load settings
    var setting = settings.get('automaticMirror');
    if(setting){
        automaticMirror = setting ==='false'?false:true;
    }else{
        settings.set('automaticMirror',true);
    }
    //add the command
    commands.set('addOnSettings',"AutomaticPlayerMirror",toggleAutomaticMirrorPlayer);
    commands.set('regularCommands',"mirrorPlayer",toggleMirrorPlayer);

    //appening the class until we got our css files
    //http://stackoverflow.com/a/3434665
    var mirrorClass =".mirror { -moz-transform: scaleX(-1); /* Gecko */ -o-transform: scaleX(-1); /* Operah */ -webkit-transform: scaleX(-1); /* webkit */ transform: scaleX(-1); /* standard */ filter: FlipH; /* IE 6/7/8 */}",
        oldPlayVideo = playVideo,
        indexOfVid,
        title;
    $('<style>'+mirrorClass+'</style>').appendTo('body');


    playVideo = function playVideo(vidinfo, time, playing) {
        indexOfVid = getVideoIndex(vidinfo);
        title = playlist[indexOfVid].title;
        if(containsMirrored(title)){
            if(!isPlayerMirrored){
                toggleMirrorPlayer();
            }
        }else if(isPlayerMirrored){
            toggleMirrorPlayer();
        }
        oldPlayVideo(vidinfo, time, playing);
    };

    //checking the current video after loading the first time
    if(playlist.length != 0){
        setTimeout(function(){
            if(containsMirrored(playlist[getActiveVideoIndex()].title)){
                toggleMirrorPlayer();
            }
        },1000);
    }
}
function containsMirrored(title){
    if(!automaticMirror){
        return false;
    }
    var found = false,
        words = [
            'mirrored',
            'mirror'
        ],
        i;
    for(i = 0; i< words.length;i++){
        if(title.toLowerCase().indexOf(words[i]) !== -1){
            found =true;
            break;
        }
    }

    return found;
}

var automaticMirror = true,
    isPlayerMirrored = false;
function toggleAutomaticMirrorPlayer(){
    automaticMirror = !automaticMirror; 
    settings.set('automaticMirror',automaticMirror);
}

function toggleMirrorPlayer(){
    $('#media').toggleClass('mirror');
    isPlayerMirrored = !isPlayerMirrored;
}

afterConnectFunctions.push(loadMirrorPlayer);
/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

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

function loadMouseWheelVolumecontrol(){

    //TODO: find firefox fix, mousescroll event doesnt fire while over youtube player
    
    //prevent the site from scrolling while over the player
    function preventScroll(event)
    {
        if(mouserOverPlayer){
            event.preventDefault();
            event.returnValue=!mouserOverPlayer;
            if(event.wheelDeltaY < 0){
                globalVolume-=2;
            }else if(event.wheelDeltaY > 0){
                globalVolume+=2;
            }
            globalVolume = (globalVolume<0)?0:(globalVolume>100)?100:globalVolume;
            setVol();
        }
    }
    window.onmousewheel=document.onmousewheel=preventScroll;
    if(window.addEventListener){
        window.addEventListener('DOMMouseScroll',preventScroll,false);
    }
    //add hover event to the player
    $('#media').hover(
        function() {
            mouserOverPlayer = true;
        },
        function() {
            mouserOverPlayer = false;
        }
    );

    var oldLoadYoutubePlayer = loadYoutubePlayer,
        oldLoadVimeoVideo = loadVimeoVideo;
        
     //overwrite InstaSynch's loadYoutubePlayer
    loadYoutubePlayer = function loadYoutubePlayer(id, time, playing) {
        oldLoadYoutubePlayer(id, time, playing);
        //set the globalVolume to the player after it has been loaded
        var oldAfterReady = $.tubeplayer.defaults.afterReady;
        $.tubeplayer.defaults.afterReady = function afterReady(k3) {
            initGlobalVolume();
            oldAfterReady(k3);
        };
    };    


    //overwrite InstaSynch's loadVimeoPlayer
    loadVimeoVideo = function loadVimeoPlayer(id, time, playing) {
        oldLoadVimeoVideo(id, time, playing);

        //set the globalVolume to the player after it has been loaded
        $f($('#vimeo')[0])['addEvent']('ready',initGlobalVolume);
    };
}

var isReady = false,
    globalVolume = 50,
    mouserOverPlayer = false;

function initGlobalVolume(){
    if(isReady){
        setVol();
    }else{
        if(loadedPlayer === 'youtube'){
            globalVolume = $('#media').tubeplayer('volume');
        }else if(loadedPlayer === 'vimeo'){
            $f($('#vimeo')[0]).api('getVolume',function(vol){globalVolume = vol*100.0;});
        }   
        isReady = true;
    }
}
function setVol(){
    if(loadedPlayer === 'youtube'){
        $('#media').tubeplayer('volume',globalVolume);
    }else if(loadedPlayer === 'vimeo'){
        $f($('#vimeo')[0]).api('setVolume',globalVolume/100.0);
    }
}

beforeConnectFunctions.push(loadMouseWheelVolumecontrol);
/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

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


function loadTogglePlayer(){
    //load settings
    var setting = settings.get('playerActive');
    if(setting){
        playerActive = setting ==='false'?false:true;
    }else{
        settings.set('playerActive',true);
    }
    //add the command
    commands.set('regularCommands',"togglePlayer",togglePlayer);

    //toggle the player once if the stored setting was false
    if(!playerActive){
        playerActive = true;
        //adding a little delay because it won't reload when destroying it immediately
        setTimeout(togglePlayer,1500);
    }

    var oldPlayVideo = playVideo;
    playVideo = function playVideo(vidinfo, time, playing){
        if(playerActive){
            oldPlayVideo(vidinfo, time, playing);
        }else{
            //copied from InstaSynch's playVideo
            var addedby = '',
                title = '',
                indexOfVid = getVideoIndex(vidinfo);
            if (indexOfVid > -1) {
                title = playlist[indexOfVid].title;
                addedby = playlist[indexOfVid].addedby;
                $('.active').removeClass('active');
                $($('#ulPlay').children('li')[indexOfVid]).addClass('active');
                $('#vidTitle').html(title + '<div class=\'via\'> via ' + addedby + '</div>');
            }
        }
    };
}


function togglePlayer(){
    if(playerActive){
        destroyPlayer();
    }else{
        sendcmd('reload', null);
    }
    playerActive = !playerActive;
    settings.set('playerActive',playerActive);
}

var playerActive = true;

afterConnectFunctions.push(loadTogglePlayer);
/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

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

function loadExportPlaylist(){
    commands.set('regularCommands',"exportPlaylist",exportPlaylist);
}


function exportPlaylist(){
    var output='',
        i;

    for (i = 0; i < playlist.length; i++) {
        switch(playlist[i].info.provider){
            case 'youtube': output+='http://youtu.be/';break;
            case 'vimeo':output+='http://vimeo.com/';break;
            default: continue;
        }
        output += playlist[i].info.id+'\n ';
    };
    window.prompt ("Copy to clipboard: Ctrl+C, Enter", output);
}
beforeConnectFunctions.push(loadExportPlaylist);
/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

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


function loadWallCounter(){

    var oldAddVideo = addVideo,
        oldRemoveVideo = removeVideo,
        oldAddMessage = addMessage,
        i,
        video,
        value;

    //add commands
    commands.set('regularCommands',"printWallCounter",printWallCounter);
    commands.set('regularCommands',"printMyWallCounter",printMyWallCounter);


    //overwrite InstaSynch's addVideo
    addVideo = function addVideo(vidinfo) {

        value = wallCounter[vidinfo.addedby];
        value =((value)?value:0) + vidinfo.duration;
        wallCounter[vidinfo.addedby] = value;
        if (isBibbyRoom() && value >= 3600 && vidinfo.addedby === thisUsername){
            var output = "Watch out " + thisUsername + " ! You're being a faggot by adding more than 1 hour of videos !";
            addMessage('',output,'','hashtext');
        }
        oldAddVideo(vidinfo);
    };

    //overwrite InstaSynch's removeVideo
    removeVideo = function removeVideo(vidinfo){
        var indexOfVid = getVideoIndex(vidinfo);
        video = playlist[indexOfVid];
        value = wallCounter[video.addedby];
        value -= video.duration;

        if(value > 0){
            wallCounter[video.addedby] = value;
        }else{
            delete wallCounter[video.addedby];
        }

        oldRemoveVideo(vidinfo);
    };    

    addMessage = function addMessage(username, message, userstyle, textstyle) {
        if(username === '' && message === 'Video added succesfully.'){
            message +='WallCounter: ['+secondsToTime(wallCounter[thisUsername])+']';
        }
        oldAddMessage(username, message, userstyle, textstyle);
    };    

    //init the wallcounnter
    resetWallCounter();
}
var wallCounter = {};

function resetWallCounter(){
    wallCounter = {};
    for(i = 0; i < playlist.length;i++){
        video = playlist[i];
        value = wallCounter[video.addedby];
        value =((value)?value:0) + video.duration;
        wallCounter[video.addedby] = value;
    } 
}

function printWallCounter(){
    var output = "",
        key;
    for(key in wallCounter){
        output += "["+key + ": "+secondsToTime(wallCounter[key])+"] ";
    }
    addMessage('', output, '', 'hashtext');
}

function printMyWallCounter()
{   
    var output = "";
    if(wallCounter[thisUsername]){
        output = "["+ thisUsername +" : "+ secondsToTime(wallCounter[thisUsername])+"]";
    }else{
        output = "["+ thisUsername +" : 00:00]";
    }
    addMessage('', output, '', 'hashtext');
}

afterConnectFunctions.push(loadWallCounter);

/*
    Copyright (C) 2013  faqqq @Bibbytube
    
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


function parseUrl(URL){
	//Parse URLs from  youtube / twitch / vimeo / dailymotion / livestream
 
	var match = URL.match(/(https?:\/\/)?(.*\.)?(\w+)\./i);
	if(match === null){
		/*error*/
		return false;
	}
	var provider = match[3], //the provider e.g. youtube,twitch ...
		mediaType, // stream, video or playlist (this can't be determined for youtube streams, since the url is the same for a video)
		id, //the video-id 
		channel, //for twitch and livestream
		playlistId //youtube playlistId;
	switch(provider){
		case 'youtu':
		case 'youtube':{ 
			provider = 'youtube'; //so that we don't have youtu or youtube later on

			//match for http://www.youtube.com/watch?v=12345678901
			if((match=URL.match(/v=([\w-]{11})/i))){
				id = match[1];
			}//match for http://www.youtube.com/v/12345678901 and http://www.youtu.be/12345678901
			else if((match=URL.match(/(v|be)\/([\w-]{11})/i))){
				id = match[2];
			}
            if((match=URL.match(/list=([\w-]+)/i))){
				playlistId = match[1];
			}
			if(!id && !playlistId){
				return false;
			}
			//Try to match the different youtube urls, if successful the last (=correct) id will be saved in the array
			//Read above for RegExp explanation
            if(playlistId){                
			    mediaType = 'playlist';
            }else{
			    mediaType = 'video';
            }
		}break;
		case 'twitch':{
			//match for http://www.twitch.tv/ <channel> /c/ <video id>
			if((match = URL.match(/twitch\.tv\/(.*?)\/.\/(\d+)?/i))){
			}//match for http://www.twitch.tv/* channel=<channel> *
			else if((match = URL.match(/channel=([A-Za-z0-9_]+)/i))){
			}//match for http://www.twitch.tv/ <channel>
			else if((match = URL.match(/twitch\.tv\/([A-Za-z0-9_]+)/i))){
			}else{
				/*error*/
				return false;
			}
			mediaType = 'stream';
			if(match.length == 3){
				//get the video id 
				id = match[2];
				//also it's a video then
				mediaType = 'video';
			}
			//get the channel name
			channel = match[1];
		}break;
		case 'vimeo':{

			//match for http://vimeo.com/channels/<channel>/<video id>
			if(match = URL.match(/\/channels\/[\w0-9]+\/(\d+)/i)){
			}//match for http://vimeo.com/album/<album id>/video/<video id>
			else if(match = URL.match(/\/album\/\d+\/video\/(\d+)/i)){
			}//match for http://player.vimeo.com/video/<video id>
			else if(match = URL.match(/\/video\/(\d+)/i)){
			}//match for http://vimeo.com/<video id>
			else if(match = URL.match(/\/(\d+)/i)){
			}else{
				/*error*/
				return false;
			}
			//get the video id
			id = match[1];
			mediaType = 'video';
		} break;
		case 'dai':
		case 'dailymotion':{
			provider = 'dailymotion'; //same as youtube / youtu
			//match for http://www.dailymotion.com/video/ <video id> _ <video title>
			if((match=URL.match(/\/video\/([^_]+)/i))){
			}//match for http://dai.ly/ <video id>
			else if((match=URL.match(/ly\/([^_]+)/i))){	
			}//or find the #video= tag in http://www.dailymotion.com/en/relevance/search/ <search phrase> /1#video= <video id>
			else if((match=URL.match(/#video=([^_]+)/i))){	
			}else{
				/*error*/
				return false;
			}
			//get the video id
			id= match[1];
			mediaType = 'video';

		}break;
		case 'livestream':{
			//match for http://www.livestream.com/ <channel>
			//not sure about new.livestream.com links tho
			if((match = URL.match(/livestream\.com\/(\w+)/i))){	
			}else{
				/*error*/
				return false;
			}
			//get the channel name
			channel = match[1];
			mediaType = 'stream';
		}break;
		//different provider -> error
		default: /*error*/ return false;
	}

	//return the data
	return {
		'provider': provider,
		'mediaType':mediaType,
		'id':id,
		'playlistId':playlistId,
		'channel':channel
	};
}
beforeConnect();
afterConnect();