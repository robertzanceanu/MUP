import {API_URL} from '../constants'
import showError from '../shared/card_error'

const onSubmit =  async (values) => {
    try {
        const response = await fetch(`${API_URL}/user/register`, {
            method:'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(values)
        })
        const json = await response.json()
        return json
    }
    catch(err) {
        console.log(err)
    }
}
let Signup = {
    render: async() => {
        return `
            <div class="page-wrapper" id='page'>
                <div class="login-page">
                    <div class="login-logo">
                        <h1 class="welcome">Bine ai venit!</h1>
                    </div>
                    <div class="form-wrapper">
                        <div class="field">
                            <div class="form-title">Inregistrare</div>
                        </div>
                        <div class="field">
                            <label class="label" for="email_signup">Adresa  de e-mail:</label>
                            <input class="input" id="email_signup" type="email" placeholder="Adresa de email">
                        </div>
                        <div class="field">
                            <label class="label" for="nume_signup">Nume:</label>
                            <input class="input" id="nume_signup" type="text" placeholder="Nume">
                        </div>
                        <div class="field">
                            <label class="label" for="prenume_signup">Prenume:</label>
                            <input class="input" id="prenume_signup" type="text" placeholder="Prenume">
                        </div>
                        <div class="field">
                            <label class="label" for="password_signup">Parola:</label>
                            <input class="input" id="password_signup" type="password" placeholder="Parola">
                        </div>
                        <div class="field">
                            <label class="label" for="confirm_password_signup">Confirmati parola:</label>
                            <input class="input" id="confirm_password_signup" type="password" placeholder="Confirmare parola">
                        </div>
                        <div class="field">
                            <label class="label" for="select_role_signup">Selectati rolul dumneavoastra:</label>
                            <select class="select" id="role_signup">
                                <option value="partyOrganizer">Organizator de petrecere</option>
                                <option value="user">Petrecaret</option>
                            </select>
                        </div>
                        <div class="field">
                            <button class="submit-button" id="submit-button" type="submit">
                                Creeaza contul!
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
        `
    },
    after_render: async () => {
        document.getElementById('submit-button').addEventListener('click', async () => {
            let formValues={}
            let email = document.getElementById('email_signup')
            let password = document.getElementById('password_signup')
            let confirm_password= document.getElementById('confirm_password_signup')
            let lastname= document.getElementById('nume_signup')
            let firstname= document.getElementById('prenume_signup')
            let role=document.getElementById('role_signup')
            formValues = {
                email:email.value,
                password:password.value,
                confirm_password:confirm_password.value,
                lastName:lastname.value,
                firstName:firstname.value,
                role:role.value
            }
            let response = await onSubmit(formValues)
            if(response.error) {
                let node = document.createElement('div')
                node.innerHTML = showError(response.error.status, response.error.message)
                document.getElementById('page').appendChild(node)
                setTimeout(function(){document.getElementById('page').removeChild(node)}, 3000);
            }
            else {
                window.location.pathname='/login'
            }


        })
    }
}

export default Signup