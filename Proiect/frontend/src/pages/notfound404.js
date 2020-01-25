const onSubmit = async (values) => {
    console.log(values)
}
let NotFound = {
    render: async () => {
        return `
        <div class="page-wrapper">
            <div class="home-page">
                <div class="container">
                    <div class="logo">
                    </div>
                    <div class="welcome">
                        <h1 class="">404-Not found</h1>
                        <p>Pagina pe care o cauti nu exista!</p>
                    </div>
                </div>
            </div>
        </div>
        `
    },
    after_render: async () => {
    }
}

export default NotFound