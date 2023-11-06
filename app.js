const express = require("express");

const db = require("./models/index.js");
const todosRouter = require("./routes/todos.router.js");
const cookieParser = require('cookie-parser');

const app = express();

app.use("/api", express.json(), todosRouter);
app.use(express.static("./assets"));
app.use(cookieParser());

/* <쿠키 할당 API>
 * 서버가 클라이언트의 request를 수신할 때, 서버가 response와 함께 Set-Cookie라는 헤더 함께 전송.
 * 이후 response와 함께 Cookie HTTP 헤더에 포함되어 전달.
 */
app.get("/set-cookie", (req, res) => {
    let expire = new Date();
    expire.setMinutes(expire.getMinutes() + 60); // 만료시간을 60분으로 설정합니다.

    // res.writeHead(200, {
    //     'Set-Cookie' : `name=sparta; Expires=${expire.toGMTString()}; HttpOnly; Path=/`,
    // });

    res.cookie('name', 'sparta', {
        expires: expire
    });

    return res.status(200).end();
});

// /* <req 이용하여 쿠키 접근>
//  * /get-cookie에 접근했을 때, 클라이언트가 전달한 모든 쿠키를 출력하는 API
//  * req.headers에 전달된 쿠키 출력
//  */
// app.get("/get-cookie", (req, res) => {
//     const cookie = req.headers.cookie; // 클라이언트가 요청한 request의 헤더(req.headers)에 쿠키 들어있다.
//     console.log(cookie); // name=sparta
//     return res.status(200).json({ cookie });
// });

app.get("/get-cookie", (req, res) => {
    const cookie = req.cookies;
    console.log(cookie); // { name: 'sparta' } ~ cookie의 형식이 객체형식
    return res.status(200).json({ cookie });
});


/**
 * 서버에 해당 유저의 정보를 저장하기 위한 세션 객체 만들기
 */
let session = {};
app.get('/set-session', function (req, res, next) {
    const name = 'sparta';
    const uniqueInt = Date.now();
    session[uniqueInt] = { name };

    res.cookie('sessionKey', uniqueInt);
    return res.status(200).end();
});

/**
 * 쿠키에 저장된 sessionKey를 이용하여 session에 저장된 데이터르르 불러옵니다.
 */
app.get('/get-session', function (req, res, next) {
    const { sessionKey } = req.cookies;
    const name = session[sessionKey];
    return res.status(200).json({ name });
});


app.listen(8080, () => {
    console.log("서버가 켜졌어요!");
});