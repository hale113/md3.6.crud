let http = require('http');
let url = require('url');
let fs = require('fs');
let qs = require('qs');

let server = http.createServer(function (req, res) {
    let urlParse = url.parse(res.url, true)
    //url.parse:  nhận url, phân tích cú pháp trả về đối tượng
    let pathName= urlParse.pathname;
    let arrPath = pathName.split('/');
    let trimPath = arrPath[1];

    let chosenHandler;
    if (typeof router[trimPath] === 'undefined'){
        chosenHandler = handlers.notFound
    }else {
        chosenHandler = router[trimPath]
    }
    chosenHandler(req,res);
})

let  handlers = {}

handlers.notFound =  (req,res) => {
    fs.readFile('./views/notFound.html',"utf-8",(err,data)=>{
        res.writeHead(200,'text.html');
        res.write(data);
        res.end();
    })
}
handlers.home = (req,res)=>{
    fs.readFile('./views/home.html',"utf-8", (err,data)=>{
        res.writeHead(200,{'Content-Type':'text/html'});
        res.write(data);
        return  res.end();
    })
}
handlers.login = (req,res)=>{
    fs.readFile('./views/login.html', "utf-8",(err,data)=>{
        res.writeHead(200,{'Content-Type':'text/html'})
        res.write(data);
        return res.end();
    })
}

handlers.profile = (req,res)=>{
    let data = '';
    req.on('data',chunk=>{
        data += chunk;
    })

}

let router={
    'home': handlers.home,
    'login': handlers.login,
    'profile': handlers.profile
}

server.listen(8080,function (){
    console.log("the server is listening ")
})