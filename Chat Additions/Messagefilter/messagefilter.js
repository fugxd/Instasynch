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

    //overwrite linkify so it won't try to linkify an emote
    linkify = function linkify(str, buildHashtagUrl, includeW3, target) {
        var emotes =[],
            index = 0;
        str = str.replace(/src=\"(.*?)\"/gi,function(match){emotes.push(match); return 'src=\"\"';});
        str = oldLinkify(str, buildHashtagUrl, includeW3, target);
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
    var about = $('#roomFooter .roomFooter').children('p')[0];
    about = linkify(parseMessage(about.textContent,false), false, true);
    $('#roomFooter .roomFooter').children('p').html(about);
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
    var possibleEmotes = [];
    var exactMatches = [];
    var emoteStart = -1;
    var emote = '';
    var end = false;
    
    while(!end){
        emoteStart = message.indexOf('/',emoteStart+1);
        if(emoteStart == -1){
            end = true
        }else{
            possibleEmotes = Object.keys($codes);
            exactMatches = [];
            emote = '';
            var i;
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

//filteredwords
var filteredwords = {
    "skip": "UPVOTE",
    "club": "PARTY" //Etc ...
};

//tags
var tags = {
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