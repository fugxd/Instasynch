
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
    $.getScript('https://raw.github.com/Bibbytube/Instasynch/master/Chat%20Additions/Messagefilter/messagefilter.js'),
    
    //autocomplete
    $.getScript('https://raw.github.com/Bibbytube/Instasynch/master/Chat%20Additions/Autocomplete/autocomplete.js'),
    
    //inputhistory
    $.getScript('https://raw.github.com/Bibbytube/Instasynch/master/Chat%20Additions/Input%20History/inputhistory.js'),
    
    //name autocomplete
    $.getScript('https://raw.github.com/Bibbytube/Instasynch/master/Chat%20Additions/Name%20Autocomplete/nameautocomplete.js'),
    
    //OnClick kick&ban
    $.getScript('https://raw.github.com/Bibbytube/Instasynch/master/Chat%20Additions/OnClickKickBan/OnClickKickBan.js'),

    //wallcounter
    $.getScript('https://raw.github.com/Bibbytube/Instasynch/master/Playlist%20Additions/Wallcounter/wallcounter.js'),
    
    //Mousewheel Volumecontrol
    $.getScript('https://raw.github.com/Bibbytube/Instasynch/master/Player%20Additions/Mousewheel%20Volumecontrol/mousewheelvolumecontrol.js'),
    
    //Description replacement
    $.getScript('https://raw.github.com/Bibbytube/Instasynch/master/General%20Additions/Description.js'),

    $.Deferred(function( deferred ){
        $( deferred.resolve );
    })
).done(function(){
        beforeConnect();
        afterConnect();
});
