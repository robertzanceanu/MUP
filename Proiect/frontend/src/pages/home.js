let Home = {
    render: async() => {
        return `
        <header class="header">
        <img src="src/assets/images/logo.png" width="100px" height="100px">
        <p class="text"> Pagini</p>
    </header> 
   
    <div class="line"></div>
    <p class="add-party">Creeaza o noua petrecere/ Intra la petrecere</p>

    <div class="block-party">
        <div class="party">1</div>
        <div class="party">2</div>
        <div class="party">3</div>
        <div class="party">4</div>
    </div>
            
        `
    },
    after_render: async () => {}
}

export default Home