import { API_URL } from '../constants'
import { USER_DETAILS, AUTH_TOKEN } from '../shared/user'

const getTopGenres = async () => {
    try {
        const response = await fetch(`${API_URL}/stats/getPartiesGenres`, {
            method: 'get',
            headers: {
                'Accept': 'aplication/json',
                'auth-token': `${AUTH_TOKEN}`,
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json()
        return json
    } catch (err) {
        console.log(err)
    }
}

let Statistics = {
    render: async () => {
        let userDetails = { ...USER_DETAILS }
        let partygenres = {}
        if(userDetails.role === 'partyOrganizer' && (partyDetails.status === 'live' || partyDetails.status === 'closed')) {
            partygenres = await getTopGenres()
            console.info(partygenres);
        }
        return `
            <div>${partygenres.fav1},${partygenres.fav2},${partygenres.fav3}</div>
                
        
        `
    },
    after_render: async () => {
    }
}

export default Statistics