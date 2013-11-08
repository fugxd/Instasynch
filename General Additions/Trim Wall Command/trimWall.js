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

function loadTrimWallCommand(){
    commands.set('modCommands',"'trimWall ",trimWall);
}

function trimWall(params){
    var user = params[1],
        maxTimeLimit = parseInt(params[2]),
        currentTime = wallCounter[user],
        videos = [];

    if(currentTime < maxTimeLimit){
        addMessage('',"The wall was smaller than the timelimit",'','hashtext');
        return;
    }
    for (var i = 0; i < playlist.length; i++) {
        if(playlist[i].addedby.toLowerCase() === user.toLowerCase()){
            videos.push({info:playlist[i].info, duration:playlist[i].duration});
        }
    }  

    function compareVideos(a,b){
        return b.duration - a.duration;
    };

    videos.sort(compareVideos);

    for (var i = 0; i < videos.length && currentTime > maxTimeLimit; i++) {
        currentTime-= videos[i].duration;
        setTimeout(
            function(){
                sendcmd('remove', {info: videos[i].info});
            }, (i+1) * 750);
    }
}

//beforeConnectFunctions.push(loadTrimWallCommand);