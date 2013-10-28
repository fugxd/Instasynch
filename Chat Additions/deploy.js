
var afterConnectFunctions = [];

//messagefilter
$.getScript('https://dl.dropboxusercontent.com/s/ghtrxs4ok03jyzy/messagefilter.js?dl=1&token_hash=AAGve0NoCbgXkON2gMP9XLNQuDhyDbAsJiVWYeTZJJDhUw');

//autocomplete
$.getScript('https://dl.dropboxusercontent.com/s/ohhe6bcza94t3jm/autocomplete.js?dl=1&token_hash=AAFjjSOInN5rBpezaj8Uq5UAJS6VivePCV9x3b7eHm45bw');

//inputhistory
$.getScript('https://dl.dropboxusercontent.com/s/t7wqz0ac5s29djw/inputhistory.js?dl=1&token_hash=AAH3uxWXfwyUueU4UKg3ojAylwWAnVudT_l0ZSkFPvahxA');

//name autocomplete
$.getScript('https://dl.dropboxusercontent.com/s/psaki7htt4lczej/nameautocomplete.js?dl=1&token_hash=AAGUOfRVohf6qlQwk0worAv1C4XU_A83ny1LvQgPAN7MMw');

//wallcounter
$.getScript('https://dl.dropboxusercontent.com/s/1is261tpt1de4ws/wallcounter.js?dl=1&token_hash=AAEWtGcm4eYcfAgZ8_6NoO2Sp2U9JzX33Gacv7RHTP1sQA');

//Mousewheel Volumecontrol
$.getScript('https://dl.dropboxusercontent.com/s/c1ef48th31cb2do/mousewheelvolumecontrol.js?dl=1&token_hash=AAHHmFBDLEme1D3hs5i2kjWRC0iOkKsTQLacX_nlcx3mIA');

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