
/*
    Copyright (C) 2013  faqqq @Bibbytube
    
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


function parseUrl(URL){
	//Parse URLs from  youtube / twitch / vimeo / dailymotion / livestream
 
	var match = URL.match(/(https?:\/\/)?(.*\.)?(\w+)\./i);
	if(match === null){
		/*error*/
		return false;
	}
	var provider = match[3], //the provider e.g. youtube,twitch ...
		mediaType, // stream, video or playlist (this can't be determined for youtube streams, since the url is the same for a video)
		id, //the video-id 
		channel, //for twitch and livestream
		playlistId //youtube playlistId;
	switch(provider){
		case 'youtu':
		case 'youtube':{ 
			provider = 'youtube'; //so that we don't have youtu or youtube later on

			//match for http://www.youtube.com/watch?v=12345678901
			if((match=URL.match(/v=([\w-]{11})/i))){
				id = match[1];
			}//match for http://www.youtube.com/v/12345678901 and http://www.youtu.be/12345678901
			else if((match=URL.match(/(v|be)\/([\w-]{11})/i))){
				id = match[2];
			}
            if((match=URL.match(/list=([\w-]+)/i))){
				playlistId = match[1];
			}
			if(!id && !playlistId){
				return false;
			}
			//Try to match the different youtube urls, if successful the last (=correct) id will be saved in the array
			//Read above for RegExp explanation
            if(playlistId){                
			    mediaType = 'playlist';
            }else{
			    mediaType = 'video';
            }
		}break;
		case 'twitch':{
			//match for http://www.twitch.tv/ <channel> /c/ <video id>
			if((match = URL.match(/twitch\.tv\/(.*?)\/.\/(\d+)?/i))){
			}//match for http://www.twitch.tv/* channel=<channel> *
			else if((match = URL.match(/channel=([A-Za-z0-9_]+)/i))){
			}//match for http://www.twitch.tv/ <channel>
			else if((match = URL.match(/twitch\.tv\/([A-Za-z0-9_]+)/i))){
			}else{
				/*error*/
				return false;
			}
			mediaType = 'stream';
			if(match.length == 3){
				//get the video id 
				id = match[2];
				//also it's a video then
				mediaType = 'video';
			}
			//get the channel name
			channel = match[1];
		}break;
		case 'vimeo':{

			//match for http://vimeo.com/channels/<channel>/<video id>
			if(match = URL.match(/\/channels\/[\w0-9]+\/(\d+)/i)){
			}//match for http://vimeo.com/album/<album id>/video/<video id>
			else if(match = URL.match(/\/album\/\d+\/video\/(\d+)/i)){
			}//match for http://player.vimeo.com/video/<video id>
			else if(match = URL.match(/\/video\/(\d+)/i)){
			}//match for http://vimeo.com/<video id>
			else if(match = URL.match(/\/(\d+)/i)){
			}else{
				/*error*/
				return false;
			}
			//get the video id
			id = match[1];
			mediaType = 'video';
		} break;
		case 'dai':
		case 'dailymotion':{
			provider = 'dailymotion'; //same as youtube / youtu
			//match for http://www.dailymotion.com/video/ <video id> _ <video title>
			if((match=URL.match(/\/video\/([^_]+)/i))){
			}//match for http://dai.ly/ <video id>
			else if((match=URL.match(/ly\/([^_]+)/i))){	
			}//or find the #video= tag in http://www.dailymotion.com/en/relevance/search/ <search phrase> /1#video= <video id>
			else if((match=URL.match(/#video=([^_]+)/i))){	
			}else{
				/*error*/
				return false;
			}
			//get the video id
			id= match[1];
			mediaType = 'video';

		}break;
		case 'livestream':{
			//match for http://www.livestream.com/ <channel>
			//not sure about new.livestream.com links tho
			if((match = URL.match(/livestream\.com\/(\w+)/i))){	
			}else{
				/*error*/
				return false;
			}
			//get the channel name
			channel = match[1];
			mediaType = 'stream';
		}break;
		//different provider -> error
		default: /*error*/ return false;
	}

   logIt("["+provider + "] [" +mediaType + "] [" + id + "] [" + channel + "] [" + playlistId + "]" );
	//return the data
	return {
		'provider': provider,
		'mediaType':mediaType,
		'id':id,
		'playlistId':playlistId,
		'channel':channel
	};
}
