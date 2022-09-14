const { Socket } = require("dgram");
const net = require("net");
const storage = new Map();

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server = net.createServer((connection) => {
  // Handle connection

  connection.on("data", data => {
    const input = data.toString()
   
    const array = input.split('\r\n')
  
    const command = array[2]
   

    const key = array[4];
    const value = array[6];
    const ttl = parseInt(array[10])
    const timestamp = ttl !== undefined ? (new Date().getTime() + ttl) : null


    switch (command) {
      case 'ping':
        connection.write("+PONG\r\n");
        break;
      case 'echo':
        connection.write(`+${array[4]}\r\n`)
        break;
      case 'set':
        storage.set(key, {value : value, timestamp : timestamp});
        connection.write(`+OK\r\n`)
        break;
      case 'get':
        const answer = storage.get(key);
        const currentTime = new Date().getTime();
        const expiredTime = answer.timestamp;

        if(answer.timestamp) {
          if(currentTime < expiredTime){
            connection.write(`+${answer.value}\r\n`);
          }
          else {
            connection.write(`$-1\r\n`);
          }
        }
        
        else {
          connection.write(`+${answer.value}\r\n`)
        }
        
        break;

    }
    
  });
  
});





server.listen(6379, "127.0.0.1");
