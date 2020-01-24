const onSubmit =  async (values) => {
    console.log(values)
}
let Signup = {
    render: async() => {
        return `
            <div class="page-wrapper">
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
                            <input class="input" id="nume_signup" type="password" placeholder="Nume">
                        </div>
                        <div class="field">
                            <label class="label" for="prenume_signup">Prenume:</label>
                            <input class="input" id="prenume_signup" type="password" placeholder="Prenume">
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
                            <select class="select">
                                <option value="petrecaret">Petrecaret</option>
                                <option value="organizator">Organizator de petrecere</option>
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
            console.log('aici')
            let formValues={}
            let email = document.getElementById('email_login')
            let password = document.getElementById('password_login')
            formValues = {
                email:email.value,
                password:password.value
            }
            await onSubmit(formValues)
        })
    }
}

export default Signup