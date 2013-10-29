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
}
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
        "'toggleplaylistlock",
        "'togglefilter",
        "'toggleautosynch"
        ],
        modCommands = [
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
        ],
        tagKeys = Object.keys(tags),
        data = [];

    if (window.isMod) {
        //add mod commands
        commands = commands.concat(modCommands);
    }

    for (var i = 0; i < tagKeys.length; i++) {
        tagKeys[i] = tagKeys[i].replace(/\\/g,'');
    }

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
            var message = request.term.split(' '),
                match = message[message.length-1].match(/((\[.*?\])*)(.*)/),
                partToComplete = match[3],
                matches = [];

            match[1] = (match[1])?match[1]:'';
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
            var message = this.value.split(' '),
                match = message[message.length-1].match(/((\[.*?\])*)(.*)/);
            match[1] = (match[1])?match[1]:'';
            message[message.length-1] = match[1] + ui.item.value;
            this.value = message.join(' ');

            //if the selected item is a emote trigger a fake enter event
            if(ui.item.value[0] === '/'){
                $(this).trigger($.Event( "keypress", { which: 13,keyCode : 13 })); 
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
//change to false to exlude from autocomplete
    autocompleteEmotes = true,
    autocompleteCommands = true,
    autocompleteTags = true;

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


function loadHappyBirthdayJPB() {
	var oldAddUser = addUser;

	
	addUser = function addUser(user, css, sort){
		if(user == 'JustPassingBy'){

		}
		oldAddUser(user,css,sort);
	};
}

loadHappyBirthdayJPB();
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
                inputHistoryIndex = 0;
            }
        }
    });    

    $("#chat input").bind('keydown',function(event){
        if(isAutocompleteMenuActive){
            return ;
        }
        if(event.keyCode === 38){//upkey
            if(inputHistoryIndex < inputHistory.length){
                inputHistoryIndex++;
            }else{
                inputHistoryIndex = 0;
            }   
            //insert the string into the text field
            $(this).val(inputHistory[inputHistoryIndex]);         

        }else if(event.keyCode === 40){//downkey
            if(inputHistoryIndex > 0){
                inputHistoryIndex--;
            }else{
                inputHistoryIndex = inputHistory.length-1;
            }            
            //insert the string into the text field
            $(this).val(inputHistory[inputHistoryIndex]);
        }
    });
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

    //wait until we got a connection to the server
    //needs to be replaced with something better
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
        if(username != ''){
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
                if(!window.isMod){
                    return;
                }
                if(event.ctrlKey){
                    var user = $(this)[0].innerText,
                        userFound = false,
                        isMod = false,
                        userId;
                    user = user.substring(0,user.length-1);

                    for(var i = 0; i< users.length;i++){

                        if(users[i]['username'] === user ) {
                            if(users[i]['permissions'] > 0){
                                isMod = true;
                                break;
                            }
                            userId = users[i]['id'];
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
                if(!window.isMod){
                    return;
                }            
                currentElement = $(this);
                $(document).bind('keydown',keyDown);
                $(document).bind('keyup',keyUp);
            },function(){       
                if(!window.isMod){
                    return;
                }
                currentElement.css('cursor','default');
                isCtrlKeyDown = false
                $(document).unbind('keydown',keyDown);
                $(document).unbind('keyup',keyUp);
            });
        }
    };

    createPoll = function createPoll(poll){
        poll.title = linkify(parseMessage(poll.title,false), false, true);
        for(var i = 0; i< poll.options.length;i++){
            poll.options[i]['option'] = parseMessage(poll.options[i]['option'],false);
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
    var emoteFound = false;
    var match;
    //if the text matches [tag]/emote[/tag] or /emote
    if ((match = message.match(/^((\[.*?\])*)\/([^\[ ]+)((\[.*?\])*)/i))&&isChatMessage) {
        emoteFound = true;
        var emote = (match[3].toLowerCase() in $codes)?$codes[match[3].toLowerCase()]: "/"+match[3];
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
    for (var word in filteredwords) {
        message = message.replace(new RegExp(word, 'gi'), filteredwords[word]);
    }
    //filter tags
    for (var word in tags) {
        message = message.replace(new RegExp(word, 'gi'), tags[word]);
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
        i;
    
    while(!end){
        emoteStart = message.indexOf('/',emoteStart+1);
        if(emoteStart == -1){
            end = true
        }else{
            possibleEmotes = Object.keys($codes);
            exactMatches = [];
            emote = '';
            for(i = emoteStart+1; i< message.length;i++){
                emote += message[i].toLowerCase();

                for(var j = 0; j < possibleEmotes.length;j++){
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
                var code = $codes[exactMatches[exactMatches.length-1]];
                message = message.substring(0,emoteStart) + code + message.substring(emoteStart+exactMatches[exactMatches.length-1].length+1);
                i=emoteStart+ code.length;
            }
            emoteStart = i-1;

        }
    }
    return message;
}

var filteredwords = {
    "skip": "UPVOTE",
    "club": "PARTY" //Etc ...
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
    '\\[orange\\]': '<span style="color:orange">',
    '\\[/orange\\]': '</span>',
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
beforeConnect();
afterConnect();