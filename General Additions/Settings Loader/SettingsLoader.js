

function loadSettingsLoader(){
    var cookieName = 'InstaSynch Addons Settings',
        expire = { expires: 10*365 }; //settings expire in 10 years
    //slightly changed version of this: http://stackoverflow.com/a/1960049, so it saves a hashmap rather than just a array
    settings = new function() {
        var cookie = $.cookie(cookieName),
            array = cookie ? cookie.split(/,/):[],
            items = {},
            i;
    
        for(i = 0; i<array.length;i+=2){
            items[array[i]] = array[i+1];
        }
    
        return {
            "set": function(key, val) {
                if(!items.hasOwnProperty(key)){
                    array.push(key);
                    array.push(val);
                }else{
                    i = array.indexOf(key);
                    array[i+1] = val; 
                }
                items[key] = val;
                addMessage('', "["+key+": "+val+"] ", '', 'hashtext');
                $.cookie(cookieName, array.join(','),expire);
            },
            "remove": function (key) { 
    
                i = array.indexOf(key); 
                if(i!=-1) array.splice(i, 2); 
    
                delete items[key];
                $.cookie(cookieName, array.join(','),expire);        
            },
            "clear": function() {
                array = [];
                items = {};
                //clear the cookie.
                $.cookie(cookieName, null);
            },
            "get": function(key) {
                //Get all the array.
                return items[key];
            },
            "getAll": function() {
                return items;
            }
        }
    };
}
var settings;

function printAddonSettings(){
    var output ="";
    for(var key in settings.getAll()){
        output += "["+key+": "+settings.get(key)+"] ";
    }
    addMessage('', output, '', 'hashtext');
}
//settings need to be loaded first
beforeConnectFunctions.splice(0,0,loadSettingsLoader);