import { API_URL } from '../constants'
import { USER_DETAILS } from '../shared/user'
import Unauthorized from './unauthorized401'
const getPost = async () => {
    try {
        const response = await fetch(`${API_URL}/posts`, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'auth-token': `${localStorage.getItem('auth-token')}`,
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json()
        return json
    } catch (err) {
        console.log(err)
    }
}
let Home = {
    render: async () => {
        let response = await getPost()
        let user = { ...USER_DETAILS }

        console.log(response)
        if (response.error) {
            if (response.error.status === 401) {
                return `${await Unauthorized.render()}`
            }
        }
        return `
            <header class="header">
                <img src="./assets/images/logo.png" width="100px" height="100px">
                <p class="text"> Pagini</p>
            </header>
            <div class="page-wrapper">
                <div class="wrap">
                    <button type="button" class="open-button" id="openForm">${user.role === 'partyOrganizer' ? 
                        'Creeaza o noua petrecere' 
                        : 
                    'Intra la petrecere'}
                    </button>
                </div>
                <div class="block-party">
                    <div class="party">1</div>
                    <div class="party">2</div>
                    <div class="party">3</div>
                    <div class="party">4</div>
                </div>
            </div>
            <div class='container-opp' id='blurForm'>
                <div class="form-popup" id="myForm">
                    <form class="form-container">
                        <h1>Creeaza o petrecere:</h1>
    
                        <label for="name" class="labelWhite">Numele petrecerii:</label>
                        <input class="input" type="text" placeholder="Introduceti numele petrecerii" name="name" required>
    
                        <label for="startdate" class="labelWhite"><b>Durata petrecerii:</b></label>
                        <input class="input" type="number" step="0.1" placeholder="Durata" name="duration" id="duration" required>
                
                        <button type="submit" class="btn">Creeaza petrecerea!</button>
                        <button type="button" class="btn cancel" id="closeForm">Close</button>
                    </form>
                </div>
            </div> 
            `
    },
    after_render: async () => {

        // function openForm() {
        //     document.getElementById("myForm").style.display = "block";
        // }
        // function closeForm() {
        //     document.getElementById("myForm").style.display = "none";
        // }
        document.getElementById('openForm').addEventListener('click', () => {
            document.getElementById("myForm").style.display = "block";
        })
        document.getElementById('closeForm').addEventListener('click', () => {
            document.getElementById("myForm").style.display = "none";
        })
        document.getElementById('openForm').addEventListener('click', () => {
            document.getElementById("blurForm").style.display = "block";
        })
        document.getElementById('closeForm').addEventListener('click', () => {
            document.getElementById("blurForm").style.display = "none";
        })

    }
}

export default Home