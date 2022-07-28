var WebSocket = require('websocket').w3cwebsocket;
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  //console.log('ws://'+process.argv[2]+'/')
var client = new WebSocket('ws://'+process.argv[2]+'/')
client.onmessage = function(e) {
    if (typeof e.data === 'string') {
        console.log( e.data );
        readline.question(`user@remote:>`, prompt => {
            client.send(`exec ${prompt}`);
            
            
        })
    }
};
client.onopen = function() {
    //console.log('WebSocket Client Connected');
  
        client.send('client')
        readline.question(`user@remote:>`, prompt => {
            client.send(`exec ${prompt}`);
            
           
      });
       
   
}