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

            //additional commands
            "'togglePlayer",
            "'printWallCounter",
            "'mirrorPlayer",
            "'clearChat",
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
            "'next",

            //additional commands
            "'bump "
        ],
        tagKeys = Object.keys(tags);

    addOnSettings = [
        ":toggleAutocompleteTags",
        ":toggleAutocompleteEmotes",
        ":toggleAutocompleteCommands",
        ":toggleAutocompleteAddOnSettings",
        ":toggleAutomaticPlayerMirror",
        ":toggleTags",
        ":toggleNSFWEmotes",
        ":toggleModSpy"
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
            autocomplete = true;
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


function loadWordfilter() {
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
        //continue with InstaSynch's  addMessage function
        oldAddMessage(username, parseMessage(message,true), userstyle, textstyle);
    };

    createPoll = function createPoll(poll){
        var i;
        poll.title = linkify(parseMessage(poll.title,false), false, true);
        for(i = 0; i< poll.options.length;i++){
            poll.options[i].option = parseMessage(poll.options[i].option,false);
        }
        oldCreatePoll(poll);
    };

    //parse and linkify footer
    /*
    var about = $('#roomFooter .roomFooter').children('p')[0];
    about = linkify(parseMessage(about.textContent,false), false, true);
    $('#roomFooter .roomFooter').children('p').html(about);
    */
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


beforeConnectFunctions.push(loadWordfilter);
/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Faqqq- Modified InstaSynch client code>
    Copyright (C) 2013  Rollermiam

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
    
    // Overwriting console.log
    var oldLog = console.log, 
        oldMoveVideo = moveVideo;

    console.log = function (message) {
        oldLog.apply(console,message);
        // We don't want the cleaning messages in the chat (Ok in the console) .
        if (!message.match(/cleaned the playlist/g) && modSpy)
        {
           if (message.match(/moved a video/g) && bumpCheck)
           {
               message = message.replace("moved","bumped");
               bumpCheck = false;
           }
           addMessage('', message, '','hashtext');   
        }
    };

    // Overwriting moveVideo to differentiate bump and move
    moveVideo = function(vidinfo, position) {
        oldMoveVideo(vidinfo,position);
        
        if ( Math.abs($('.active').index()-position) <= 10){ // "It's a bump ! " - Amiral Ackbar
            bumpCheck = true;
        }
    }

}   

var modSpy = false,
    bumpCheck = false;

beforeConnectFunctions.push(loadModSpy);
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


function loadAutocomplete() {
    $("#chat input").bind('keydown',function(event){
        
        if(event.keyCode == 9){//tab
            //prevent loosing focus from input
            event.preventDefault();
            //split the message
            var message = $(this).val().split(' '),
                //make a regex out of the last part 
                messagetags = message[message.length-1].match(/((\[.*?\])*\[?)(.*)/),
                name,
                data,
                autocomplete = '',
                username,
                i,
                j,
                sub;
            if(!messagetags[1]){
                 messagetags[1] = '';
            }
            if(!messagetags[3]){
                return;
            }   
            
            //make a regex out of the name
            name = new RegExp('^'+messagetags[3],'i');

            //find matching users
            for(i = 0; i< users.length;i++){
                username = users[i].username;
                if(username.match(name)){
                    if(autocomplete == ''){
                        autocomplete = username;
                    }else{
                        //check for partial matches with other found users
                        for(j = autocomplete.length; j>=0 ;j--){
                            sub = autocomplete.substring(0,j);
                            if(username.indexOf(sub) == 0){
                                autocomplete = sub;
                                break;
                            }
                        }
                    }
                }
            }
            if(autocomplete != ''){
                //put messagetags and the autocompleted name back into the message
                message[message.length-1] =messagetags[1] + autocomplete;
                $(this).val(message.join(' '));
            }

        }
    });

}

beforeConnectFunctions.push(loadAutocomplete);
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
function loadOnClickKickBan(){

    var oldAddMessage = addMessage;

    //overwrite InstaSynch's  addMessage function
    addMessage = function addMessage(username, message, userstyle, textstyle) {
        
        oldAddMessage(username, message, userstyle, textstyle);
        //only add the onclick events if the user is a mod and its not a system message
        if(username != '' && window.isMod){
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
function loadAdditionalCommands(){
    $("#chat input").bind("keypress", function(event) {
        if (event.keyCode === $.ui.keyCode.ENTER) {
            var words = $(this).val().toLowerCase().split(' ');
            switch(words[0]){
                case "'toggleplayer":togglePlayer(); settings.set('playerActive',playerActive);break;
                case "'printwallcounter":printWallCounter();break;
                case "'mirrorplayer":toggleMirrorPlayer();break;
                case "'printaddonsettings":printAddonSettings();break;
                case "'clearchat": $('#chat_list').empty();messages = 0;break;
                case "'bump": bump(words[1]);break;
                case ":toggleautocompletetags": autocompleteTags = !autocompleteTags; settings.set('autocompleteTags',autocompleteTags);break;
                case ":toggleautocompleteemotes": autocompleteEmotes = !autocompleteEmotes; settings.set('autocompleteEmotes',autocompleteEmotes);break;
                case ":toggleautocompletecommands": autocompleteCommands = !autocompleteCommands; settings.set('autocompleteCommands',autocompleteCommands);break;
                case ":toggleautocompleteaddonsettings": autocompleteAddonSettings = !autocompleteAddonSettings; settings.set('autocompleteAddonSettings',autocompleteAddonSettings);break;
                case ":toggleautomaticplayermirror": automaticMirror = !automaticMirror; settings.set('automaticMirror',automaticMirror);break;
                case ":toggletags": filterTags = !filterTags; settings.set('filterTags',filterTags);break;
                case ":togglensfwemotes": toggleNSFWEmotes(); settings.set('NSFWEmotes',NSFWEmotes);break;
                case ":togglemodspy": modSpy = !modSpy; settings.set('modSpy',modSpy);break;
                default: break;
            }
            
        }
    });
}

beforeConnectFunctions.push(loadAdditionalCommands);
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

function bump(user){
    if(!user){
        return;
    }
    var activeIndex = $('.active').index()+1,
        bumpIndex = -1,
        i;

    for (i = playlist.length - 1; i >= 0; i--) {
        if(playlist[i].addedby.toLowerCase() === user.toLowerCase()){
            bumpIndex = i;
            break;
        }
    }
    if(bumpIndex !== -1){
        sendcmd('move', {info: playlist[bumpIndex].info, position: activeIndex});
    }
}
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

function printAddonSettings(){
    var output ="";
    for(var key in settings.getAll()){
        output += "["+key+": "+settings.get(key)+"] ";
    }
    addMessage('', output, '', 'hashtext');
}
//settings need to be loaded first
beforeConnectFunctions.splice(0,0,loadSettingsLoader);
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


function loadMirrorPlayer(){
    //load settings
    var setting = settings.get('automaticMirror');
    if(setting){
        automaticMirror = setting ==='false'?false:true;
    }else{
        settings.set('automaticMirror',true);
    }

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
    setTimeout(function(){
        if(containsMirrored(playlist[$('.active').index()].title)){
            toggleMirrorPlayer();
        }
    },1000);
    
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

function toggleMirrorPlayer(){
    $('#media').toggleClass('mirror');
    isPlayerMirrored = !isPlayerMirrored;
}

afterConnectFunctions.push(loadMirrorPlayer);
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


function loadTogglePlayer(){
    //load settings
    var setting = settings.get('playerActive');
    if(setting){
        playerActive = setting ==='false'?false:true;
    }else{
        settings.set('playerActive',true);
    }
    
    //toggle the player once if the stored setting was false
    if(!playerActive){
        playerActive = true;
        //adding a little delay because it won't reload when destroying it immediately
        setTimeout(togglePlayer,1000);
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
}

var playerActive = true;

afterConnectFunctions.push(loadTogglePlayer);
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


function loadWallCounter(){

    var oldAddVideo = addVideo,
        oldRemoveVideo = removeVideo,
        i,
        video,
        value;


    for(i = 0; i < playlist.length;i++){
        video = playlist[i];
        value = wallCounter[video.addedby];
        value =((value)?value:0) + video.duration;
        wallCounter[video.addedby] = value;
    }
    //overwrite InstaSynch's addVideo
    addVideo = function addVideo(vidinfo) {

        value = wallCounter[vidinfo.addedby];
        value =((value)?value:0) + vidinfo.duration;
        wallCounter[vidinfo.addedby] = value;

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

}
var wallCounter = {};

function printWallCounter(){
    var output = "",
        key;
    for(key in wallCounter){
        output += "["+key + ": "+secondsToTime(wallCounter[key])+"] ";
    }
    addMessage('', output, '', 'hashtext');
}

afterConnectFunctions.push(loadWallCounter);
beforeConnect();
afterConnect();