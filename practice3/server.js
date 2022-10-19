const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('qs');

const server = http.createServer((req, res) => {
    let urlParse = url.parse(req.url, true);//phân tích cú pháp trả về đối tượng
    let pathName = urlParse.pathname; //
    let arrPath = pathName.split('/');
    let trimPath = arrPath[1];

    let chosenHandler;
    if (typeof router[trimPath] === "undefined") {
        chosenHandler = handlers.notFound
    } else {
        chosenHandler = router[trimPath];
    }
    chosenHandler(req, res, arrPath[2]);
})

let handlers = {};


handlers.home = (req, res) => {
    let usersHtml = '';
    fs.readFile('./data/users.json', 'utf-8', (err, users) => {
        users = JSON.parse(users);
        users.forEach((item, index) => {
            usersHtml += ` STT: ${index + 1} TÊN:  ${item.name} MẬT KHẨU: ${item.password}| <a href = "edit/${index}">Sửa</a> | <a href="delete/${index}">Xóa</a><br>`
        });
        fs.readFile('./views/index.html', 'utf-8', (err, indexHtml) => {
            res.writeHead(200, "text/html");
            indexHtml = indexHtml.replace('{users}', usersHtml);
            res.write(indexHtml);
            res.end();
        })
    })
}


handlers.notFound = (req, res) => {
    fs.readFile('./views/notFound.html', 'utf-8', (err, data) => {
        res.writeHead(200, 'text/html');
        res.write(data);
        res.end();
    })
}

handlers.login = function (req, res) {
    if (req.method === "GET") {
        fs.readFile('./views/login.html', 'utf-8', (err, data) => {
            res.writeHead(200, 'text/html');
            res.write(data);
            res.end();
        });
    } else {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            let usersLogin = [];
            const userInfo = qs.parse(data);
            fs.readFile('./data/users.json', 'utf-8', (err, usersJson) => {
                usersLogin = JSON.parse(usersJson);
                for (let i = 0; i < usersLogin.length; i++) {
                    if (usersLogin[i].name == userInfo.name && usersLogin[i].password == userInfo.password) {
                        console.log("đăng nhập thành công");
                        fs.readFile('./views/index.html', 'utf-8', (err, indexHtml) => {
                            res.writeHead(200, "text/html");
                            indexHtml = indexHtml.replace('{users}', userInfo.name);
                            res.write(indexHtml);
                            res.end();
                        })
                    }else {
                        console.log("tài khoản không tồn tại")
                        fs.readFile('./views/index.html', 'utf-8', (err, indexHtml) => {
                            res.writeHead(200, "text/html");
                            res.write(indexHtml);
                            res.end();
                        })
                    }
                }
            })
        })
    }
}

handlers.register = function (req, res) {
    if (req.method === "GET") {
        fs.readFile('./views/register.html', 'utf-8', (err, data) => {
            res.writeHead(200, 'text/html');
            res.write(data);
            res.end();
        });
    } else {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            let users = [];
            const userInfo = qs.parse(data);
            fs.readFile('./data/users.json', 'utf-8', (err, usersJson) => {
                users = JSON.parse(usersJson);
                users.push(userInfo);
                users = JSON.stringify(users);
                fs.writeFile('./data/users.json', users, err => {
                    console.log(err);
                })
            })
        })
        res.writeHead(301, {'location': '/home'});
        res.end();
    }
}

handlers.edit = function (req, res, index) {
    if (req.method === "GET") {
        fs.readFile('./views/edit.html', 'utf-8', (err, data) => {
            res.writeHead(200, "text/html");
            res.write(data);
            res.end();
        })
    } else {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            let users = [];
            const userInfo = qs.parse(data);
            fs.readFile('./data/users.json', 'utf-8', (err, usersJson) => {
                users = JSON.parse(usersJson);
                for (let i = 0; i < users.length; i++) {
                    if (i === +index) {
                        users[i] = userInfo;
                    }
                }
                users = JSON.stringify(users);
                fs.writeFile('./data/users.json', users, err => {
                    console.log(err);
                })
            })
        })
        res.writeHead(301, {'location': '/home'});
        res.end();
    }
}

handlers.delete = function (req, res, index) {
    let users = [];
    fs.readFile('./data/users.json', 'utf-8', (err, usersJson) => {
        users = JSON.parse(usersJson);
        for (let i = 0; i < users.length; i++) {
            if (i === +index) {
                users.splice(i, 1);
                console.log("xóa thành công")
            }
        }
        users = JSON.stringify(users)
        console.log(users)
        fs.writeFile('./data/users.json', users, err => {
            res.writeHead(301, {'location': '/home'});
            res.end();
        })
    })
}
let router = {
    'login': handlers.login,
    'home': handlers.home,
    'register': handlers.register,
    'edit': handlers.edit,
    'delete': handlers.delete
}

server.listen(3000, function () {
    console.log('server running!')
})