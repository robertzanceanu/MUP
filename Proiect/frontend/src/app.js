import Login from './pages/login'
import Home from './pages/home'
import Signup from './pages/signup'
import FirstPage from './pages/firstpage'
import BadRequest from './pages/badrequest400'
import NotFound from './pages/notfound404'
import Unauthorized from './pages/unauthorized401'
import PartyView from './pages/party/partyView'
import Header from './components/header'
import Account from './pages/myaccount'
import Statistics from './pages/statistics'

import ParseRequestUrl from './shared/utils'

const routes = {
    '/login':Login,
    '/signup':Signup,
    '/':FirstPage,
    // '/':Home,
    '/party/:id': PartyView,
    // '/:id':Party,
    '/home':Home,
    '/myaccount':Account,
    '/statistics':Statistics
}

const router = async () => {
    let request = ParseRequestUrl()
    let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? `/:id` : '') + (request.verb ? '/' + request.verb : '')
    let page = routes[parsedURL] ? routes[parsedURL] : NotFound
    let header = document.getElementById('header')
    if(parsedURL !== '/' && parsedURL !== '/login' && parsedURL !=='/signup') {
        header.innerHTML = await Header.render()
        await Header.after_render()
    }
    const content = document.getElementById('main')
    content.innerHTML = await page.render()
    await page.after_render()
}
window.addEventListener('hashchange', () => {
    router()
})

window.addEventListener('load', () => {
    router()
})


// const io=require("socket.io-client")
// const ioClient=io.connect("http://localhost:8000");


// ioClient.emit("semnal",'semnal');
// console.info("am trimis semnalul");

// //var timer=setInterval(sendSignal,1000);

// function sendSignal(){
//     ioClient.emit("semnal",'semnal')
// }

// const socket=new WebSocket('ws://localhost:8081');

// socket.addEventListener('open',()=>{
//     socket.send('Hello!');
//     console.log('Am trimis spre server');
// })

// socket.addEventListener('message',event=>{
//     console.log(`message from server:${event.data}`);
// })

// window.WebSocket=window.WebSocket;

// var client=new WebSocket("ws://localhost:8081");

// client.onerror=function() {
//     console.log('Connect Error');
// };

// client.onopen = function() {
//     client.send(document.getElementById('partyCode').value);
//     client.close();
// };


