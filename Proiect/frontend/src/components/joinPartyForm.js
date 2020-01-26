let joinPartyForm = {
    render: async () => {
        return `
        <div class="form-popup" id="myForm">
            <div class="form-container">
                <h1>Alatura-te unei petreceri:</h1>
                <label for="partyCode" class="labelWhite">Codul petrecerii:</label>
                <input class="input" type="text" placeholder="ex:1234" name="partyCode" id="partyCode" required>
                <button type="submit" class="btn" id="submitCreatePartyForm">Creeaza petrecerea!</button>
                <button type="button" class="btn cancel" id="closeForm">Close</button>
            </div>
        </div>
        `
    }
}
export default joinPartyForm