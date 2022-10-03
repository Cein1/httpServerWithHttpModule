const http = require('http'); // (1)
const server = http.createServer();

const users = [ // (2)
  {
    id: 1,
    name: "Rebekah Johnson",
    email: "Glover12345@gmail.com",
    password: "123qwe",
  },
  {
    id: 2,
    name: "Fabian Predovic",
    email: "Connell29@gmail.com",
    password: "password",
  },
];

const posts = [
  {
    id: 1,
    title: "간단한 HTTP API 개발 시작!",
    content: "Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현.",
    userId: 1,
  },
  {
    id: 2,
    title: "HTTP의 특성",
    content: "Request/Response와 Stateless!!",
    userId: 1,
  },
];

const httpRequestListener = function (request, response) {
  const { url, method } = request;
  
  if (method === 'GET') {
    if (url === '/ping') {
      response.writeHead(200, {'Content-Type' : 'application/json'});
      response.end(JSON.stringify({message : 'pong'}));
    };
  };

  if (method === 'POST') { // (3)
    if (url === '/users/signup') { //과제 1번
      let body = ''; // (4)
      request.on('data', (data) => {body += data}); // (5)
      
      // stream을 전부 받아온 이후에 실행
      request.on('end', () => {  // (6)
        const user = JSON.parse(body); //(7) 

        users.push({ // (8)
          id : user.id,
          name : user.name,
          email: user.email,
          password : user.password
        });

        response.writeHead(201, {'Content-Type' : 'application/json'});
        response.end(JSON.stringify({"message" : "userCreated"}));

      });
    } else if (url === '/posts') { //과제 2번 완료
    let body = '';
    request.on('data', (data) => {body += data});

    request.on('end', () => {
      const post = JSON.parse(body);

      posts.push({
        id: post.id,
        title: post.title,
        content: post.content,
        userId: post.userId
      });

      response.writeHead(201, {'Content-Type' : 'application/json'});
      response.end(JSON.stringify({"message" : "postCreated"}));
    });
  }
}
};

server.on("request", httpRequestListener);

server.listen(8000, '127.0.0.1', function() { 
    console.log('Listening to requests on port 8000');
});

/* 서버를 껐다 켜게 되면, users 변수는 메모리에 값을 저장하기 때문에 저장했던 모든 값이 다시 초기화가 됩니다. 그래서 데이터를 영구적으로 저장할 수 있는 데이터베이스 시스템이 필요합니다.*/