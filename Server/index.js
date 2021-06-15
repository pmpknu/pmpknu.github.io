const http = require("http");
const fs = require('fs').promises;

const host = 'localhost';
const port = 8000;

let messages = [];

const requestListener = function (req, res) {
    console.log(`Request: ${req.method}, ${req.url}`);
    /*
    console.log(
        `Request headers: ${JSON.stringify(req.headers)}`
    );
    */

    let fileName;
    let contentType;

    if (req.url === "/msg" && req.method === "POST") {
        let data = "";
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            messages.push(JSON.parse(data));
            res.end();
        })
        return;
    } else if (req.url === "/msg" && req.method === "GET") {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200);
        res.end(JSON.stringify(messages));
        return;
    }

    if (req.url === "/") {
        fileName = "index.html";
        contentType = "text/html";
    } else if (req.url.endsWith(".css")) {
        fileName = req.url.substr(1);
        contentType = "text/css";
    } else {
        res.writeHead(404);
        res.end("Not found");
        return;
    }

    fs.readFile(`${__dirname}/${fileName}`)
        .then(contents => {
            res.setHeader("Content-Type", contentType);
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            res.writeHead(404);
            res.end(err.message);
            return;
        });
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});