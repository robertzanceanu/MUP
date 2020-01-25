import {API_URL} from '../constants'

const getPost = async () => {
    try {
        const response = await fetch(`${API_URL}/posts`, {
            method:'get',
            headers: {
                'Accept': 'application/json',
                'auth-token':`${localStorage.getItem('auth-token')}`,
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json()
        return json
    } catch(err) {
        console.log(err)
    }
} 
let Home = {
    render: async() => {
        getPost()
        return `
        <header class="header">
        <img src="src/assets/images/logo.png" width="100px" height="100px">
        <p class="text"> Pagini</p>
    </header> 
   
    <div class="line"></div>
    <p class="add-party">Creeaza o noua petrecere/ Intra la petrecere</p>

    <div class="block-party">
        <div class="party">1</div>
        <div class="party">2</div>
        <div class="party">3</div>
        <div class="party">4</div>
    </div>
            
        `
    },
    after_render: async () => {}
}

export default Home