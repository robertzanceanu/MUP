import Login from './pages/login'
import Home from './pages/home'
import Signup from './pages/signup'
import FirstPage from './pages/firstpage'
import BadRequest from './pages/badrequest400'
import NotFound from './pages/notfound404'
import Unauthorized from './pages/unauthorized401'
import PartyView from './pages/party/partyView'
import Header from './components/header'

import ParseRequestUrl from './shared/utils'

const routes = {
    '/login':Login,
    '/signup':Signup,
    '/':FirstPage,
    // '/':Home,
    '/party/:id': PartyView,
    // '/:id':Party,
    '/home':Home,
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