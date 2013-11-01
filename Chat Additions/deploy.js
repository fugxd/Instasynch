
var afterConnectFunctions = [];
var beforeConnectFunctions = [];

function afterConnect(){
    if (messages < 3) {
        setTimeout(function () {afterConnect();}, 100);
        return;
    }

    for(var i = 0; i< afterConnectFunctions.length;i++){
            afterConnectFunctions[i]();
    }
}
function beforeConnect(){
    for(var i = 0; i< beforeConnectFunctions.length;i++){
            beforeConnectFunctions[i]();
    }
}
$.when(
    //messagefilter
    $.getScript('https://dl.dropboxusercontent.com/s/ghtrxs4ok03jyzy/messagefilter.js?dl=1&token_hash=AAGve0NoCbgXkON2gMP9XLNQuDhyDbAsJiVWYeTZJJDhUw'),
    
    //autocomplete
    $.getScript('https://dl.dropboxusercontent.com/s/ohhe6bcza94t3jm/autocomplete.js?dl=1&token_hash=AAFjjSOInN5rBpezaj8Uq5UAJS6VivePCV9x3b7eHm45bw'),
    
    //inputhistory
    $.getScript('https://dl.dropboxusercontent.com/s/t7wqz0ac5s29djw/inputhistory.js?dl=1&token_hash=AAH3uxWXfwyUueU4UKg3ojAylwWAnVudT_l0ZSkFPvahxA'),
    
    //name autocomplete
    $.getScript('https://dl.dropboxusercontent.com/s/psaki7htt4lczej/nameautocomplete.js?dl=1&token_hash=AAGUOfRVohf6qlQwk0worAv1C4XU_A83ny1LvQgPAN7MMw'),
    
    //OnClick kick&ban
    $.getScript('https://dl.dropboxusercontent.com/s/gge2keppi6h1yfp/OnClickKickBan.js?dl=1&token_hash=AAGw-0s6LfVB5gB35Pv1uVgKVeT099hvaGgSOF8NS4b4Cg'),

    //Autscroll Fix
    $.getScript('https://dl.dropboxusercontent.com/s/xnhc00i7liixuq6/AutoscrollFix.js?dl=1&token_hash=AAEhEoNvmD4Ld34waMT5y-iQGVAe8sgZaDaatQGoO_zSHA'),

    //wallcounter
    $.getScript('https://dl.dropboxusercontent.com/s/1is261tpt1de4ws/wallcounter.js?dl=1&token_hash=AAEWtGcm4eYcfAgZ8_6NoO2Sp2U9JzX33Gacv7RHTP1sQA'),
    
    //Mousewheel Volumecontrol
    $.getScript('https://dl.dropboxusercontent.com/s/c1ef48th31cb2do/mousewheelvolumecontrol.js?dl=1&token_hash=AAHHmFBDLEme1D3hs5i2kjWRC0iOkKsTQLacX_nlcx3mIA'),
    
    //Description replacement
    $.getScript('https://dl.dropboxusercontent.com/s/wz7cazphmwztkf4/Description.js?dl=1&token_hash=AAHYIBm9c88xSQ3p2QkDNHgG-24AtgRW1Qu-zJj281X1vw'),

    $.Deferred(function( deferred ){
        $( deferred.resolve );
    })
).done(function(){
        beforeConnect();
        afterConnect();
});
