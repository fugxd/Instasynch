
var afterConnectFunctions = [];

//messagefilter
$.getScript('https://dl.dropboxusercontent.com/1/view/en9aeqotf2nuex2/github/instasynch/chat%20additions/Messagefilter/messagefilter.js');

//autocomplete
$.getScript('https://dl.dropboxusercontent.com/1/view/8jd9x58xfd811w8/github/instasynch/chat%20additions/Autocomplete/autocomplete.js');

//inputhistory
$.getScript('https://dl.dropboxusercontent.com/1/view/wd0a3j5pyseyptl/github/instasynch/chat%20additions/Input%20History/inputhistory.js');

//name autocomplete
$.getScript('https://dl.dropboxusercontent.com/1/view/g0zqbai0sr9646b/github/instasynch/chat%20additions/Name%20Autocomplete/nameautocomplete.js');

//wallcounter
$.getScript('https://dl.dropboxusercontent.com/1/view/qfil2a2jpkk7raq/github/instasynch/playlist%20additions/Wallcounter/wallcounter.js');

//Mousewheel Volumecontrol
$.getScript('https://dl.dropboxusercontent.com/1/view/swh5m00f4z6zwg9/github/instasynch/player%20additions/Mousewheel%20Volumecontrol/mousewheelvolumecontrol.js');

function afterConnect(){
	if (messages < 3) {
	    setTimeout(function () {afterConnect();}, 100);
	    return;
	}

	for(var func in afterConnectFunctions){
		func();
	}
}
afterConnect();