let Unauthorized = {
    render: async () => {
        return `
        <div class="page-wrapper">
            <div class="home-page">
                <div class="container">
                    <div class="logo">
                    </div>
                    <div class="welcome">
                        <h1 class="">401-Unauthorized</h1>
                        <p>Accesul la aceasta pagina nu este autorizat!</p>
                    </div>
                </div>
            </div>
        </div>
        `
    },
    after_render: async () => {
    }
}

export default Unauthorized