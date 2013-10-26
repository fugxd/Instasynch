// ==UserScript==
// @name        test
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
    loadMouseroverVolumecontrol();
};


function loadMouseroverVolumecontrol(){

    if(window.addEventListener){
        window.addEventListener('DOMMouseScroll',preventScroll,false);
    }
    //prevent the site from scrolling while over the player
    function preventScroll(event)
    {
        event.preventDefault();
        event.returnValue=!mouserOverPlayer;
        if(mouserOverPlayer){
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

    //add hover event to the player
    $('#media').hover(
        function() {
            mouserOverPlayer = true;
        },
        function() {
            mouserOverPlayer = false;
        }
    );


    var oldLoadYoutubePlayer = loadYoutubePlayer;
     //overwrite InstaSynch's loadYoutubePlayer
    loadYoutubePlayer = function loadYoutubePlayer(id, time, playing) {
        oldLoadYoutubePlayer(id, time, playing);
        //set the globalVolume to the player after it has been loaded
        //TODO: rewrite properly
        setTimeout(function () {setVol();}, 2000);
    };    

    var oldLoadVimeoVideo = loadVimeoVideo;
    //overwrite InstaSynch's loadVimeoPlayer
    loadVimeoVideo = function loadVimeoPlayer(id, time, playing) {
        oldLoadVimeoVideo(id, time, playing);
        //set the globalVolume to the player after it has been loaded
        //TODO: rewrite properly
        setTimeout(function () {setVol();}, 2000);
    };
}


var globalVolume = 50;
var mouserOverPlayer = false;


function setVol(){
    if(loadedPlayer === 'youtube'){
        $('#media').tubeplayer('volume',globalVolume);
    }else if(loadedPlayer === 'vimeo'){
        $f($('#vimeo')[0]).api('setVolume',globalVolume/100.0);
    }
}

