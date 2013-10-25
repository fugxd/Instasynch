

function parseUrl(URL){
	//Parse URLs from  youtube/twitch/vimeo/dailymotion/livestream

	//If you add brackets in your RegExp like (www\.)? the result will be saved in an array
	//example: [1] = http, [2] = www, [3] = undefined,  [4] = youtube
	//for http://www.youtube.com
	//this also can be accessed with RegExp.$1, .$2 etc.
	var provider = URL.match(/(https?:\/\/)?(www\.)?(new\.)?(\w+)/i)[4];
    var mediaType; // stream or video (this can't be determined for youtube streams, since the url is the same for a video)
    var id; //the video-id
    var channel; //only for twitch
    switch(provider){
    	case 'youtu':
    	case 'youtube':{ 
    		provider = 'youtube'; //so that we don't have youtu or youtube later on

    		//match for http://www.youtube.com/v=12345678901
    		if(URL.match(/youtube\.com\/.*?v=([\w-_]{11})/i)){
			}//match for http://www.youtube.com/v/12345678901
			else if(URL.match(/youtube\.com\/v\/([\w-_]{11})/i)){
			}//match for http://www.youtu.be/12345678901
			else if(URL.match(/youtu\.be\/([\w-_]{11})/i)){
			}//else error
			else{
				/*error*/
			}
			//Try to match the different youtube urls, if successful the last (=correct) id will be saved in the array
			//Read above for RegExp explanation
			id = RegExp.$1;
			mediaType = 'video';
    	}break;
    	case 'twitch':{
    		//match for http://www.twitch.tv/ <channel> /c/ <video id>
    		URL.match(/twitch\.tv\/(.*?)\/.\/(\d+)/i);
    		//get the channel name
    		channel = RegExp.$1;
    		if(channel == 'undefined'){
    			/*error*/
    		}

    		//get the video code 
    		id = RegExp.$2;

    		//if there is no video code it's a stream url
    		if(id == 'undefined'){
    			mediaType = 'stream';
    		}else{
    			mediaType = 'video';
    		}

    	}break;
    	case 'vimeo':{
    		//match for http://vimeo.com/channels/ <channel> / <video id>
    		//and http://vimeo.com/ <video id>
    		URL.match(/vimeo\.com\/(channels\/[\w0-9]+\/)?(\d+)/i);
    		//get the video code
    		id = RegExp.$2;
    		mediaType = 'video';
    		if(id == 'undefined'){
    			/*error*/
    		}
    	} break;
    	case 'dailymotion':{
    		//match for http://www.dailymotion.com/video/ <video id> _ <video title>
    		if(URL.match(/dailymotion.com\/video\/([\w0-9]+)/i)){
    		}//or find the #video= tag in http://www.dailymotion.com/en/relevance/search/ <search phrase> /1#video= <video id>
    		else if(URL.match(/#video=([\w0-9]+)/i)){	
    		}//else error
			else{
				/*error*/
			}
			id= RegExp.$1;
    		mediaType = 'video';

    	}break;
    	case 'livestream': {

    	}break;
    	default: /*error*/;
    }
    return {
    	'provider': provider,
    	'id':id,
    	'mediaType':mediaType,
    	'channel':channel
    };
}