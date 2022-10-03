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
    } else if (url === '/posts/list') { // 과제 3번 완료

    let body = '';
    request.on('data', (data) => {body += data}); //필요한 부분인지 다시보자
    request.on('end', () => {

      const dataAllPosts = [];

      for (let i=0; i<posts.length; i++) {
        const findPostOwner = users.findIndex((element) => element.id === posts[i].userId);
        const formatData = {
          'userID': users[findPostOwner].id,
          'userName' : users[findPostOwner].name,
          "postingId" : posts[i].id,
          "postingName" : posts[i].title,
          "postingContent" : posts[i].content
        };
        dataAllPosts.push(formatData);
      };
      response.writeHead(200, {'Content-Type' : 'application/json'});
      response.end(JSON.stringify({ "data" : dataAllPosts }));
    });
  }
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
if (method === 'PATCH') { // 과제 4번
  if (url === '/posts/update') {
      let body = ''; // (4)
      request.on('data', (data) => {body += data}); // (5)
      
      // stream을 전부 받아온 이후에 실행
      request.on('end', () => {  // (6)
          const post = JSON.parse(body); //(7)

          // posts에 새로운 포스팅내역 업데이트
          // posts 중 value가 업데이트된 객체의 index를 알아야 한다. // 포스팅 Title, Content가 변경될 경우
          const index1 = posts.findIndex((element) => (element.title !== post.title || element.content !== post.content));
          const thePostObj = posts[index1];

          const postsI = posts[index1];

          if(postsI.title !== post.title) {
            thePostObj["title"] = post.title;
          } else if(postsI.content !== post.content) {
            
            thePostObj["content"] = post.content;
          }; // element.title만 적정한 것으로 바꾸면 된다.

          const newObj = {// 하나의 포스트만 업데이트 했을 때를 가정함
            "userId": post.userId,
            "userName": '',
            "postingId":post.id,
            "postingTitle":post.title,
            "postingContent":post.content
          };

          const index2 = users.findIndex((element) => (element.id === newObj.userId)); // users의 요소들 중, 프로퍼티 value가 id === post.userId인 요소의 index를 알고 싶다 // users라는 배열을 순회하면서, ith 요소.userId

          const userObj = users[index2]; // userObj는 포스트유저 아이디와 동일한 유저아이디를 가지고 있는 유저 객체를 말한다.
    
          if(newObj.userId === userObj['id']) { //  users의 요소들 중, 프로퍼티 value가 id === post.userId인 요소를 찾아라, 그리고 해당 user 객체의 프로퍼티 중 'name' key의 value를 뱉어라
            newObj["userName"] = userObj['name'];
          }

          response.writeHead(201, {'Content-Type' : 'application/json'});
          response.end(JSON.stringify({"data" : newObj}));

      });
  };

};
};

server.on("request", httpRequestListener);

server.listen(8000, '127.0.0.1', function() { 
    console.log('Listening to requests on port 8000');
});

/* 서버를 껐다 켜게 되면, users 변수는 메모리에 값을 저장하기 때문에 저장했던 모든 값이 다시 초기화가 됩니다. 그래서 데이터를 영구적으로 저장할 수 있는 데이터베이스 시스템이 필요합니다.*/