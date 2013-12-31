var preConnectFunctions = [],
    postConnectFunctions = [],
    scriptErrors = [];
function executeFunctions(funcArray){
    var i;
    for(i = 0; i< funcArray.length;i++){
        try{
            funcArray[i]();
        }catch(err){
            scriptErrors.push(err);
            console.log("Error in " + funcArray[i].name + ". See scriptErrors["+(scriptErrors.length-1)+"].stack for details");
        }
    }
}
function postConnect(){
    var oldAddMessage = addMessage;
    addMessage = function addMessage(username, message, userstyle, textstyle) {
        if(message === 'Connection Successful!'){
            addMessage = oldAddMessage;
            executeFunctions(postConnectFunctions);
            console.log("Connection Successful!");
        }
        oldAddMessage(username, message, userstyle, textstyle);
    };
}
function preConnect(){
    executeFunctions(preConnectFunctions);
}


//--scripts

preConnect();
postConnect();