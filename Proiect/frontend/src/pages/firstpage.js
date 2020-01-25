const onSubmit = async (values) => {
    console.log(values)
}
let FirstPage = {
    render: async () => {
        return `
        <div class="page-wrapper">
            <div class="home-page">
                <div class="login-logo">
                    <h1 class="welcome">Bine ai venit!</h1>
                </div>
                <div class="container">
                    <div class="logo">
                    </div>
                    <div class="block-user-actions">
                        <div class="button-div">
                            <a href="/login">Autentificare</a>
                        </div>
                        <div class="button-div">
                            <a href="/signup">Inregistrare</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
    },
    after_render: async () => {
    }
}

export default FirstPage