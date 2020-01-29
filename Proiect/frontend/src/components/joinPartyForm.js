let joinPartyForm = {
    render: async () => {
        return `
        <div class="form-popup" id="myForm">
            <div class="form-container">
                <h1 class="form-popup-title">Alatura-te unei petreceri:</h1>

                <label for="partyCode" class="labelWhite">Codul petrecerii:</label>
                <input class="input" type="text" placeholder="ex:1234" name="partyCode" id="partyCode" required>
                
                <label for="favArtist" class="labelWhite">Artistul preferat:</label>
                <input class="input" type="text" placeholder="ex:George Michael" name="favArtist" id="favArtist" required>
                
                <label for="favSong" class="labelWhite">Melodia preferata:</label>
                <input class="input" type="text" placeholder="ex:Careless Whisper" name="favSong" id="favSong" required>
                
                <label for="favGenre" class="labelWhite">Genul muzical preferat:</label>
                <input class="input" type="text" placeholder="ex:Pop" name="favGenre" id="favGenre" required>
                
                <button type="submit" class="btn" id="submitJoinPartyForm">Alatura-te petrecerii!</button>
                <button type="button" class="btn cancel" id="closeForm">Close</button>
            </div>
        </div>
        `
    }
}
export default joinPartyForm