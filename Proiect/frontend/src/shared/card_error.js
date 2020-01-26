function showError(code, err) {
    console.log(code)
    return `
    <div class="errorCard" id='errorCard'>
        <img src='./src/assets/error.png' width=18px height=18px>
        <span >${err}</span>
    </div>
   `
}


export default showError