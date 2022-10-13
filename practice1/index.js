let http = require('http');
let url = require('url');
let StringDecoder = require('string_decoder').StringDecoder;

let server = http.createServer(function (req, res){
    let decoder = new StringDecoder('utf-8')
    let buffer = '';
    res.on('data',function (data){
       buffer += decoder.write(data)
    });
    res.on('end',function (end){
        buffer += decoder.end()
        res.end('hello');
        console.log(buffer);
    })
})
server.listen(3000,function (){
    console.log("ok ")
})