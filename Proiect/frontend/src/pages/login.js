import { API_URL } from '../constants'
import showError from '../shared/card_error'
const onSubmit = async (values) => {
    let data = {
        email: values.email,
        password: values.password
    }
    try {
        const response = await fetch(`${API_URL}/user/login`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const json = await response.json()
        localStorage.setItem('auth-token', json.token)
        localStorage.setItem('id', json.id)
        localStorage.setItem('name', json.name)
        localStorage.setItem('role', json.role)
        return json
    } catch (err) {
        console.log(err)
    }
}

let Login = {
    render: async () => {
        return `
            
            <form class="page-wrapper" id='page'>
                <div class="login-page">
                    <div class="login-logo">
                        <h1 class="welcome">Bine ai venit!</h1>
                    </div>
                    <div class="form-wrapper">
                        <div class="field">
                            <div class="form-title">Autentificare</div>
                        </div>
                        <div class="field">
                            <label class="label" for="email_login">Adresa email:</label>
                            <input class="input" id="email_login" type="email" placeholder="Adresa de email">
                        </div>
                        <div class="field">
                            <label class="label" for="password_login">Parola:</label>
                            <input class="input" id="password_login" type="password" placeholder="Adresa de email">
                        </div>
                        <div class="field">
                            <button class="submit-button" id="submit-button" type="submit">
                                Intra in cont!
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            
        `
    },
    after_render: async () => {
        document.getElementById('submit-button').addEventListener('click', async (e) => {
            e.preventDefault()
            let formValues = {}
            let email = document.getElementById('email_login')
            let password = document.getElementById('password_login')
            formValues = {
                email: email.value,
                password: password.value
            }
            let response = await onSubmit(formValues)
            if(response.error) {
                let node = document.createElement('div')
                node.innerHTML = showError(response.error.status, response.error.message)
                document.getElementById('page').appendChild(node)
                setTimeout(function(){document.getElementById('page').removeChild(node)}, 3000);
            }
            else {
                window.location.pathname='/home'
            }
        })
    }
}

export default Login