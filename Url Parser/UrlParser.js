function parseUrl(URL){
	//Parse URLs from  youtube / twitch / vimeo / dailymotion / livestream

	//If you add brackets in your RegExp like (www\.)? the result will be saved in an array
	//example: [1] = http, [2] = www, [3] = undefined,  [4] = youtube
	//for http://www.youtube.com
	//this also can be accessed with RegExp.$1, .$2 etc.
	var match = URL.match(/(https?:\/\/)?(.*\.)?(\w+)\./i);
	if(match === null){
		/*error*/
		return false;
	}
	var provider = match[3]; //the provider e.g. youtube,twitch ...
	var mediaType; // stream or video (this can't be determined for youtube streams, since the url is the same for a video)
	var id; //the video-id 
	var channel; //for twitch and livestream
	switch(provider){
		case 'youtu':
		case 'youtube':{ 
			provider = 'youtube'; //so that we don't have youtu or youtube later on

			//if((match = URL.match(...))) is short for

			//match = URL.match(...)
			//if(match !== null)

			//match for http://www.youtube.com/watch?v=12345678901
			if((match=URL.match(/v=([\w-_]{11})/i))){
			}//match for http://www.youtube.com/v/12345678901 and http://www.youtu.be/12345678901
			else if((match=URL.match(/\/([\w-_]{11})/i))){
			}else{
				/*error*/
				return false;
			}
			//Try to match the different youtube urls, if successful the last (=correct) id will be saved in the array
			//Read above for RegExp explanation
			id = match[1];
			mediaType = 'video';
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
	//printFunction for jsfiddle
	//logIt("["+provider + "] [" +mediaType + "] [" + id + "] [" + channel + "]");

	//return the data
	return {
		'provider': provider,
		'mediaType':mediaType,
		'id':id,
		'channel':channel
	};
}