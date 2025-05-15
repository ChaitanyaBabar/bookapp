/**
 * Copyright (c) 2025 Chaitanya Babar
 * Licensed under the MIT License. See LICENSE file in the project root for full license information. 
 */
const http = require("http");
const app = require("./backend/app");;

// Set up the middle-ware
const port = process.env.PORT || 3001;

app.set("port", port);

// Start Server
const server = http.createServer(app);
server.listen(port);
console.log("\n Stared Listening to port : " + port);


// Some unrelated change in server-acl branch :- Change 1