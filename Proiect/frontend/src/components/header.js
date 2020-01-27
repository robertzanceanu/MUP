let Header = {
    render: async() => {
        return `
            <img src="../assets/images/logo.png" width="100px" height="100px">
            <p class="text"> Pagini</p>
        `
    },
    after_render: async() => {
        return`
        `
    }
}
export default Header