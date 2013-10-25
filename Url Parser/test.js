
//html
/*<div id="logs"></div>*/

var logs=document.getElementById('logs');
function logIt(msg){
    var e=document.createElement('div');
    e.innerHTML=msg;
    logs.insertBefore(e,logs.firstChild);
}

function parseUrl(URL){
	//Parse URLs from  youtube/twitch/vimeo/dailymotion/livestream
	var provider = URL.match(/(https?:\/\/)?(www\.)?(new\.)?(\w+)/i)[4];
    return provider;
}

logIt(parseUrl('http://www.youtube.com/v=12345678901'));
logIt(parseUrl('http://www.youtube.com/v/12345678901'));
logIt(parseUrl('http://www.youtu.be/12345678901'));
logIt(parseUrl('http://vimeo.com/8191217'));
logIt(parseUrl('http://www.twitch.tv/tsm_xpecial/c/2013340'));
logIt(parseUrl('http://www.twitch.tv/dreamhacklol'));
logIt(parseUrl('http://new.livestream.com/92Y/CoryBooker'));
logIt(parseUrl('http://www.dailymotion.com/video/x10mis4_turkei-polizeigewalt-und-festnahmen-wegen-twitter_news'));