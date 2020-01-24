const onSubmit =  async (values) => {
    console.log(values)
}
let FirstPage = {
    render: async() => {
        return `
            <div class="page-wrapper">
                <div class="login-page">
                    <div class="login-logo">
                        <h1 class="welcome_firstpage">Bine ai venit!</h1>
                    </div>
                    <div class="logo">
                        <img src="./images/" alt="Smiley face" height="42" width="42">
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

export default FirstPage