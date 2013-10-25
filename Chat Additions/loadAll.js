// ==UserScript==
// @name        Instasynch Addons
// @namespace   Bibby
// @description autocompletes emotes and or commands
// @include     http://*.instasynch.com/rooms/*
// @include     http://instasynch.com/rooms/*
// @version     1
// @grant       none
// ==/UserScript==


(function(){
    var jA = document.createElement('script');
    jA.setAttribute('type', 'text/javascript');
    jA.setAttribute('src', 'https://raw.github.com/Bibbytube/Instasynch/master/Chat%20Additions/deploy.js');
    document.body.appendChild(jA);
})();