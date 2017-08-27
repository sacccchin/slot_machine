//step 1) require the modules we need
var
http = require('http'),
path = require('path'),
fs = require('fs'),
//these are the only file types we will support for now
extensions = {
    ".html" : "text/html",
    ".css" : "text/css",
    ".js" : "application/javascript",
    ".png" : "image/png"
};

//helper function handles file verification
function getFile(filePath,res,page404,mimeType){
    //does the requested file exist?
    fs.exists(filePath,function(exists){
        //if it does...
        if(exists){
            //read the fiule, run the anonymous function
            fs.readFile(filePath,function(err,contents){
                if(!err){
                    //if there was no error
                    //send the contents with the default 200/ok header
                    res.writeHead(200,{
                        "Content-type" : mimeType,
                        "Content-Length" : contents.length
                    });
                    res.end(contents);
                } else {
                    //for our own troubleshooting
                    console.dir(err);
                };
            });
        } else {
            //if the requested file was not found
            //serve-up our custom 404 page
            fs.readFile(page404,function(err,contents){
                //if there was no error
                if(!err){
                    //send the contents with a 404/not found header 
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end(contents);
                } else {
                    //for our own troubleshooting
                    console.dir(err);
                };
            });
        };
    });
};

//a helper function to handle HTTP requests
function requestHandler(req, res) {
    var
    fileName = path.basename(req.url) || 'index.html',
    ext = path.extname(fileName),
    localFolder = __dirname + '/public/',
    page404 = localFolder + '404.html';
    
    //call our helper function
    //pass in the path to the file we want,
    //the response object, and the 404 page path
    //in case the requestd file is not found
    if( req.method == 'GET' && req.url == '/spin' ) {
        
        var rn = checkWinningScenario();
        
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(rn));
        
    } else if(!extensions[ext]){
        //do we support the requested file type?
        //for now just send a 404 and a short message
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end("&lt;html&gt;&lt;head&gt;&lt;/head&gt;&lt;body&gt;The requested file type is not supported&lt;/body&gt;&lt;/html&gt;");
    }
    
    if(extensions[ext]){
        getFile((localFolder + fileName),res,page404,extensions[ext]);
    }
    
};

//step 2) create the server
http.createServer(requestHandler)

//step 3) listen for an HTTP request on port 3000
.listen(8888);

console.log('Node server is running on http://localhost:8888');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkWinningScenario() {
    var n = { a : getRandomInt(0,5), b: getRandomInt(0,5), c: getRandomInt(0,5) };
    n.is_bonus = false;
    n.outcome = 'no win';
    if( n.a === 0 && n.b === 0 && n.c === 0 ) {
        n.is_bonus = true;
    } 
    if( n.a === n.b && n.b === n.c ) {
        n.outcome = 'Big Win';
    } else if( n.a === n.b || n.b === n.c || n.a === n.c ) {
        n.outcome = 'Small Win';
    }
    
    return n;
}
