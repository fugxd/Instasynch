// ==UserScript==
// @name        Chat Addons
// @namespace   Bibby
// @description adds the old tags and wordfilter
// @include     http://instasynch.com/rooms/*
// @include     http://*.instasynch.com/rooms/*
// @version     1
// @grant       none
// ==/UserScript==


loadWordfilter();

function loadWordfilter() {

    //wait until we got a connection to the server
    //needs to be replaced with something better
    if (messages < 3) {
        setTimeout(function () {
            loadWordfilter();
        }, 100);
        return;
    }


    var emoteFound = false;
    var oldLinkify = linkify;
    var oldAddMessage = addMessage;

    //overwrite Mewtes addMessage function
    addMessage = function addMessage(username, message, userstyle, textstyle) {
        emoteFound = false;
        var match;

        //if the text matches [tag]/emote[/tag] or /emote
        if ((match = message.match(/^((\[.*?\])*)\/([^\[ ]+)((\[.*?\])*)/))) {
            emoteFound = true;
            var emote = (match[3] in $codes)?$codes[match[3]]: "/"+match[3];
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
        message = message.replace(/\[.*?\]/, '');
        
        //continue with Mewtes addMessage function
        oldAddMessage(username, message, userstyle, textstyle);
    }

    //overwrite linkify so it won't try to add a link when a emote has been added
    linkify = function linkify(str, buildHashtagUrl, includeW3, target) {
        if (!emoteFound) {
            return oldLinkify(str, buildHashtagUrl, includeW3, target);
        } else {
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

    '\\[i\\]': '<span style="font-style:italic">',
    '\\[/i\\]': '</span>',
    '\\[italic\\]': '<span style="font-style:italic">',
    '\\[/italic\\]': '</span>',
    '\\[strike\\]': '<strike>',
    '\\[/strike\\]': '</strike>',
    '\\[strong\\]': '<strong>',
    '\\[/strong\\]': '</strong>'
};