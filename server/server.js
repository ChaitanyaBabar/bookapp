const http = require('http');
const app = require("./backend/app");

// Set up the middle-ware
const port = process.env.PORT || 3001;

app.set('port',port)




// Start Server
const server = http.createServer(app);
server.listen(port);
console.log("\n Stared Listening to port : "+ port);