// ==UserScript==
// @name        Instasynch Addons
// @namespace   Bibby
// @description autocompletes emotes and or commands
// @include     http://*.instasynch.com/rooms/*
// @include     http://instasynch.com/rooms/*
// @version     1
// @grant       none
// ==/UserScript==

var oldOnload = window.onload;
window.onload=function onload(){
    if(oldOnload){
	   oldOnload();
    }
    $.getScript('https://raw.github.com/Bibbytube/Instasynch/master/deploy.js');
};
