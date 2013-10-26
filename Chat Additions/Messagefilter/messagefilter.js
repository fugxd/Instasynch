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
    if (messages < 3) {
        setTimeout(function () {loadWordfilter();}, 100);
        return;
    }


    var emoteFound = false;
    var oldLinkify = linkify;
    var oldAddMessage = addMessage;

    //overwrite InstaSynch's addMessage function
    addMessage = function addMessage(username, message, userstyle, textstyle) {
        emoteFound = false;
        var match;

        //if the text matches [tag]/emote[/tag] or /emote
        if ((match = message.match(/^((\[.*?\])*)\/([^\[ ]+)((\[.*?\])*)/i))) {
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
        //filter words
        for (var word in filteredwords) {
            message = message.replace(new RegExp(word, 'gi'), filteredwords[word]);
        }
        //filter tags
        for (var word in tags) {
            message = message.replace(new RegExp(word, 'gi'), tags[word]);
        }
        //remove unnused tags [asd]
        if(emoteFound){
            message = message.replace(/\[.*?\]/, '');
        }
        
        //continue with Mewtes addMessage function
        oldAddMessage(username, message, userstyle, textstyle);
    }

    //overwrite linkify so it won't try to add a link when a emote has been added
    linkify = function linkify(str, buildHashtagUrl, includeW3, target) {
        if (!emoteFound) {
            return oldLinkify(str, buildHashtagUrl, includeW3, target);
        } else {
            emoteFound = false;
            return str;
        }
    }
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


loadWordfilter();

