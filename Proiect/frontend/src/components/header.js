let Header = {
    render: async() => {
        return `
            <img src="../assets/images/logo.png" width="100px" height="100px">
            <div class="pages">
                <a href="/home" class="home">Acasa</a>
                <a href="/statistics">Statistici</a>
                <a href="/myaccount">Contul meu</a>
                <a id='logOut'>Log out</a>
            </div>
        `
    },
    after_render: async() => {
        document.getElementById('logOut').addEventListener('click', async (e) => {
            localStorage.removeItem('auth-token');
            window.location.pathname='/';
        })
    }
}
export default Header