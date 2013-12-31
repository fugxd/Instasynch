/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
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

function loadMouseWheelVolumecontrol(){

    autocompleteBotCommands = settings.get('mouseWheelVolumecontrol','true');
    commands.set('addOnSettings',"MouseWheelVolumecontrol",toggleMouseWheelVolumecontrol);
    //TODO: find firefox fix, mousescroll event doesnt fire while over youtube player
    
    //prevent the site from scrolling while over the player
    function preventScroll(event)
    {
        if(mouseWheelVolumecontrol&&mouserOverPlayer){
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

    // var oldLoadYoutubePlayer = loadYoutubePlayer,
    //     oldLoadVimeoVideo = loadVimeoVideo;
    
    //  //overwrite InstaSynch's loadYoutubePlayer
    // loadYoutubePlayer = function loadYoutubePlayer(id, time, playing) {
    //     oldLoadYoutubePlayer(id, time, playing);
    //     //set the globalVolume to the player after it has been loaded
 
    // };    


    // //overwrite InstaSynch's loadVimeoPlayer
    // loadVimeoVideo = function loadVimeoPlayer(id, time, playing) {
    //     oldLoadVimeoVideo(id, time, playing);

    //     //set the globalVolume to the player after it has been loaded
    // };

    var oldPlayVideo = playVideo,
        newPlayer = false;

    playVideo = function playVideo(vidinfo, time, playing){
        oldPlayVideo(vidinfo,time,playing);
        if(oldProvider !== vidinfo.provider){
            newPlayer = true;
            oldProvider = vidinfo.provider;
        }
        if(newPlayer){
            newPlayer = false;
            switch(oldProvider){
                case 'youtube': {
                    var oldAfterReady = $.tubeplayer.defaults.afterReady;
                    $.tubeplayer.defaults.afterReady = function afterReady(k3) {
                    initGlobalVolume();
                    oldAfterReady(k3);
                    };
                }break;
                case 'vimeo':{
                    $f($('#vimeo')[0])['addEvent']('ready',initGlobalVolume);
                }break;
            }
        }
    };
}

var isPlayerRead = false,
    globalVolume = 50,
    mouserOverPlayer = false,
    oldProvider = 'youtube',
    mouseWheelVolumecontrol = true;

function toggleMouseWheelVolumecontrol(){
    mouseWheelVolumecontrol = !mouseWheelVolumecontrol; 
    settings.set('mouseWheelVolumecontrol',mouseWheelVolumecontrol);
}
function initGlobalVolume(){
    if(isPlayerRead){
        setVol();
    }else{
        if(oldProvider === 'youtube'){
            globalVolume = $('#media').tubeplayer('volume');
        }else if(oldProvider === 'vimeo'){
            $f($('#vimeo')[0]).api('getVolume',function(vol){globalVolume = vol*100.0;});
        }   
        isPlayerRead = true;
    }
}
function setVol(){
    if(oldProvider === 'youtube'){
        $('#media').tubeplayer('volume',globalVolume);
    }else if(oldProvider === 'vimeo'){
        $f($('#vimeo')[0]).api('setVolume',globalVolume/100.0);
    }
}

preConnectFunctions.push(loadMouseWheelVolumecontrol);