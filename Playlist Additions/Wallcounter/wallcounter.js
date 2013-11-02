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


function loadWallCounter(){

    var oldAddVideo = addVideo,
        oldRemoveVideo = removeVideo,
        i,
        video,
        value;


    for(i = 0; i < playlist.length;i++){
        video = playlist[i];
        value = wallCounter[video.addedby.toLowerCase()];
        value =((value)?value:0) + video.duration;
        wallCounter[video.addedby.toLowerCase()] = value;
    }
    //overwrite InstaSynch's addVideo
    addVideo = function addVideo(vidinfo) {

        value = wallCounter[vidinfo.addedby.toLowerCase()];
        value =((value)?value:0) + vidinfo.duration;
        wallCounter[vidinfo.addedby.toLowerCase()] = value;

        oldAddVideo(vidinfo);
    };

    //overwrite InstaSynch's removeVideo
    removeVideo = function removeVideo(vidinfo){
        var indexOfVid = getVideoIndex(vidinfo);
        video = playlist[indexOfVid];
        value = wallCounter[video.addedby.toLowerCase()];
        value -= video.duration;

        if(value > 0){
            wallCounter[video.addedby] = value;
        }else{
            delete wallCounter[video.addedby];
        }


        oldRemoveVideo(vidinfo);
    };

}
var wallCounter = {};

function printWallCounter(){
    var string = "",
        key;
    for(key in wallCounter){
        string += key + ": "+secondsToTime(wallCounter[key])+", ";
    }
    addMessage('', string, '', 'hashtext');
}

afterConnectFunctions.push(loadWallCounter);
