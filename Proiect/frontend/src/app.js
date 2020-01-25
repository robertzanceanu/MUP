import Login from './pages/login'
import Home from './pages/home'
import Signup from './pages/signup'
import FirstPage from './pages/firstpage'
import BadRequest from './pages/badrequest400'
import NotFound from './pages/notfound404'
import Unauthorized from './pages/unauthorized401'

import ParseRequestUrl from './shared/utils'

const routes = {
    '/login':Login,
    '/signup':Signup,
    '/firstpage':FirstPage,
    '/badrequest':BadRequest,
    // '/unauthorized':Unauthorized,
    '/':Home,
    // '/':Home,
    '/home':Home

}

const router = async () => {
    let request = ParseRequestUrl()
    let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/' + request.verb : '')

    let page = routes[parsedURL] ? routes[parsedURL] : NotFound
    
    const content = null || document.getElementById('main')
    content.innerHTML = await page.render()
    console.log(content)
    await page.after_render()
}

window.addEventListener('hashchange', router)

window.addEventListener('load', router)