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
const getParties = async () => {
    let user = { ...USER_DETAILS }
    try {
        const response = await fetch(`${API_URL}/stats/getParties/${user.id}`, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'auth-token': `${localStorage.getItem('auth-token')}`,
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
        if(userDetails.role === 'partyOrganizer') {
            partygenres = await getTopGenres()
            console.info(partygenres);
        }

        let partiesstats=await getParties()

        return `
        <div class="wrapper">
            <div class="page-flex" id="page">
                <div class="card">
                    <div class="card-title">
                        Topul genurilor preferate
                    </div>
                    <div class="card-infos">
                        <div class="card-info">Numarul 1:</div>
                        <div class="card-details">${partygenres.fav1}</div>
                    </div>
                    <div class="card-infos">
                        <div class="card-info">Numarul 2:</div>
                        <div class="card-details">${partygenres.fav2}</div>
                    </div>
                    <div class="card-infos">
                        <div class="card-info">Numarul 3:</div>
                        <div class="card-details">${partygenres.fav3}</div>
                    </div>
                </div>
                ${partiesstats.parties.map((party,index)=>{
                    return `
                    <div class="card">
                        <div class="card-infos">
                            <div class="card-info">${party.name}: </div>
                            <div class="card-details">${party.nrPeople}</div>
                        </div>
                    </div>
                    `
                }
                )}

            </div>
        </div>
                
        `
    },
    after_render: async () => {
    }
}

export default Statistics