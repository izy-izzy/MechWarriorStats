var http = require('http');
var url = require('url');
var fs = require('fs');
var baseDirectory = "./../public" ;
var PORT = 8080;

var correctFileTypes = ['html','htm','js','jpg','jpeg','png','css','map','svg','gif', 'eot', 'ttf', 'woff', 'woff2', 'json'];
var correctFileTypesHeaders = ["text/html","text/html", "text/javascript","image/jpg","image/jpeg", "image/png", "text/css", "application/octet-stream", 'application/octet-stream', "image/gif", 'application/octet-stream', 'application/octet-stream', 'application/octet-stream', 'application/octet-stream','application/octet-stream'];

console.log("SERVER runs on port:",PORT);

    var loadpage = function(response){
		 fs.readFile('./../public/index.html', function(error, data){
            if (error){
                response.writeHead(404);
                response.write("opps this doesn't exist - 404");
                response.end();
            }
            else{
                response.writeHead(200, {"Content-Type": "text/html",  'Cache-Control': 'no-cache'});
                response.write(data, "utf8");
                response.end();
            }
        });
    };

http.createServer(function (request, response) {
   	var requestUrl = url.parse(request.url);
   	var path = requestUrl.pathname;
   	var fsPath = baseDirectory+requestUrl.pathname;
   	console.log("requested filepath:",fsPath);

	console.log('path',path);

  
	var regProjects = /project\/[a-z|A-Z|0-9]/;
	var regProjectsPicture = /project\/[a-z|A-Z|0-9]\/image\/[0-9]/;

	var kokot = regProjects.test("/project/lol");
	console.log(kokot);

	var found = regProjects.test(path) 
				|| regProjectsPicture.test(path) 
				|| path == '/' 
				|| path == '/projects' 
				|| path == '/bio' 
				|| path == '/intro' 
				|| path == '/error404'
				|| path == '/admin';

     	switch(found){
	        case true:
	           loadpage(response);
	           break;
	        default:
	        	var splicedpath = path.split(".");
	        	var filetype = splicedpath[splicedpath.length -1];
	        	var indexOfFileType = correctFileTypes.indexOf(filetype);
	        	if (indexOfFileType != -1) {
	      		    fs.readFile(fsPath, function(error, data){
	                if (error){
	                    response.writeHead(404);
	                    response.write("opps this doesn't exist - 404");
	                    response.end();
	                }
	                else{
	                    response.writeHead(200, {"Content-Type": correctFileTypesHeaders[indexOfFileType],  'Cache-Control': 'no-cache'});
	                    response.write(data, "utf8");
	                    response.end();
	                }
	            });
	            break;
	        	}
	            response.writeHead(404);
	            response.write("opps this doesn't exist - 404");
	            response.end();
	            break;
        }
   
}).listen(PORT);