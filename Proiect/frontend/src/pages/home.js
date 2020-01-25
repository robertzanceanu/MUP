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
        <img src="./assets/images/logo.png" width="100px" height="100px">
        <p class="text"> Pagini</p>
    </header>

    <div class="line"></div>
    <div class="wrap">
        <button type="button" class="open-button" onclick='openForm()'>Creeaza o noua petrecere/ Intra la
            petrecere</button>
    </div>
    <div class="block-party">
        <div class="party">1</div>
        <div class="party">2</div>
        <div class="party">3</div>
        <div class="party">4</div>
    </div>

    <div class="form-popup" id="myForm">
        <form action="/action_page.php" class="form-container">
            <h1>Login</h1>

            <label for="email"><b>Email</b></label>
            <input type="text" placeholder="Enter Email" name="email" required>

            <label for="psw"><b>Password</b></label>
            <input type="password" placeholder="Enter Password" name="psw" required>

            <button type="submit" class="btn">Login</button>
            <button type="button" class="btn cancel" onclick="closeForm()">Close</button>
        </form>
    </div>
            
        `
    },
    after_render: async () => {

        function openForm() {
            document.getElementById("myForm").style.display = "block";
        }
        function closeForm() {
            document.getElementById("myForm").style.display = "none";
        }
    }
}

export default Home