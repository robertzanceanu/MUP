let Header = {
    render: async() => {
        return `
            <img src="../assets/images/logo.png" width="100px" height="100px">
            <div class="pages">
                <a href="/home" class="home">Acasa</a>
                <a href="/statistics">Statistici</a>
                <a href="/myaccount">Contul meu</a>
            </div>
        `
    },
    after_render: async() => {
        return`
        `
    }
}
export default Header