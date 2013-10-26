// ==UserScript==
// @name        test
// @namespace   Bibby
// @description autocompletes emotes and or commands
// @include     http://*.instasynch.com/rooms/*
// @include     http://instasynch.com/rooms/*
// @version     1
// @grant       none
// ==/UserScript==


function loadMouseroverVolumecontrol(){

    $('#player1').hover(
        function() {
            console.log('hover');
        },
        function() {
          console.log('hover out');
        }
    );

}

loadMouseroverVolumecontrol();