/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Faqqq- Modified InstaSynch client code>
    Copyright (C) 2013  Rollermiam

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

function loadModSpy(){
	//load settings
	var setting = settings.get('modSpy');
	if(setting){
		modSpy = setting ==='false'?false:true;
	}else{
		settings.set('modSpy',false);
	}
	
	// Overwriting console.log
	var oldLog = console.log, 
		oldMoveVideo = moveVideo;

	console.log = function (message) {
		// We don't want the cleaning messages in the chat (Ok in the console) .
		if (!message.match(/cleaned the playlist/g) && modSpy)
		{
			if (message.match(/moved a video/g) && bumpCheck)
			{
				message = message.replace("moved","bumped");
				bumpCheck = false;
			}
			addMessage('', message, '','hashtext');   
		}
		oldLog.apply(console,arguments);
	};

	// Overwriting moveVideo to differentiate bump and move
	moveVideo = function(vidinfo, position) {
		oldMoveVideo(vidinfo,position);
		
		if ( Math.abs(getActiveVideoIndex()-position) <= 10){ // "It's a bump ! " - Amiral Ackbar
			bumpCheck = true;
		}
	}

}	

var modSpy = false,
	bumpCheck = false;

beforeConnectFunctions.push(loadModSpy);