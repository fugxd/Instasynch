// ==UserScript==
// @name        Autocomplete
// @namespace   Bibby
// @description autocompletes emotes and or commands
// @include     http://*.instasynch.com/rooms/*
// @include     http://instasynch.com/rooms/*
// @version     1
// @grant       none
// ==/UserScript==

with(unsafeWindow) {
   	$.getScript('https://github.com/Bibbytube/Instasynch/tree/master/Chat%20Additions/Autocomplete/autocomplete.js')
   	$.getScript('https://github.com/Bibbytube/Instasynch/tree/master/Chat%20Additions/Messagefilter/Messagefilter.js')
}