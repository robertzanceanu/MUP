import Login from './pages/login'
import Home from './pages/home'
import Signup from './pages/signup'

import ParseRequestUrl from './shared-functions/utils'

const routes = {
    '/login':Login,
    '/signup':Signup,
    '/':Home,
}

const router = async () => {
    let request = ParseRequestUrl()
    let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/' + request.verb : '')

    let page = routes[parsedURL] ? routes[parsedURL] : 'error'
    
    const content = null || document.getElementById('main')
    content.innerHTML = await page.render()
    console.log('aici2')
    await page.after_render()
}

window.addEventListener('hashchange', router)

window.addEventListener('load', router)