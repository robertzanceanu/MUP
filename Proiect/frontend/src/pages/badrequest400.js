const onSubmit = async (values) => {
    console.log(values)
}
let BadRequest = {
    render: async () => {
        return `
        <div class="page-wrapper">
            <div class="home-page">
                <div class="container">
                    <div class="logo">
                    </div>
                    <div class="welcome">
                        <h1 class="">400-Bad request</h1>
                        <p>A aparut o eroare. Este posibil ca pagina pe care o cauti sa nu existe sau nu functioneze momentan.</p>
                    </div>
                </div>
            </div>
        </div>
        `
    },
    after_render: async () => {
    }
}

export default BadRequest