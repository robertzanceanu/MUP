let addPartyForm = {
    render: async () => {
        return `
        <div class="form-popup" id="myForm">
            <div class="form-container">
                <h1>Creeaza o petrecere:</h1>
                <label for="name" class="labelWhite">Numele petrecerii:</label>
                <input class="input" type="text" placeholder="Introduceti numele petrecerii" name="partyName" id="partyName" required>
                <label for="startdate" class="labelWhite"><b>Durata petrecerii:</b></label>
                <input class="input" type="number" step="0.1" placeholder="Durata" name="partyDuration" id="partyDuration" required>
                <button type="submit" class="btn" id="submitCreatePartyForm">Creeaza petrecerea!</button>
                <button type="button" class="btn cancel" id="closeForm">Close</button>
            </div>
        </div>
        `
    }
}
export default addPartyForm