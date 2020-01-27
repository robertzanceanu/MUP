import { API_URL } from '../constants'
import { USER_DETAILS } from '../shared/user'
import Unauthorized from './unauthorized401'
import addPartyForm from '../components/addPartyForm'
import joinPartyForm from '../components/joinPartyForm'

const submitCreateParty = async (data) => {
    try {
        const response = await fetch(`${API_URL}/parties/addParty`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'auth-token': `${localStorage.getItem('auth-token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const json = await response.json()
        return json
    } catch(err) {
        console.log(err)
    }
}
const getParties = async () => {
    let user = { ...USER_DETAILS }
    try {
        const response = await fetch(`${API_URL}/parties/getParties/${user.id}`, {
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
let Home = {
    render: async () => {
        let response = await getParties()
        let user = { ...USER_DETAILS }
        if (response.error) {
            if (response.error.status === 401) {
                return `${await Unauthorized.render()}`
            }
        }
        return `
            <div class="page-wrapper" id="page">
                <div class="wrap">
                    <button type="button" class="open-button" id="openForm">
                        ${user.role === 'partyOrganizer' ? 
                            'Creeaza o noua petrecere' 
                            : 
                            'Intra la petrecere'
                        }
                    </button>
                </div>
                <div class="block-party">
                        ${response.parties.map((party,index) => {
                            return `
                            <a href="/party/${party._id}">
                            <div class="party">
                                <h1 class="partyName">${party.name}</h1>
                                <div class="partyFlex">
                                    <div class="partyLabel">Status:</div>
                                    ${
                                        party.status === 'live' ?
                                        `<div class="partyLive">Live</div>`
                                        :
                                            party.status === 'open' ?
                                            `<div class="partyOpen">In asteptare</div>`
                                            : 
                                            `<div class="partyLive">In asteptare</div>`
                                    }
                                </div>
                                <div class="partyFlex">
                                    <div class="partyLabel">Codul petrecerii:</div>
                                    <div class="partyCode">${party.partyCode}</div>
                                </div>
                            </div>
                            </a>
                            
                            `
                        }
                        )}
                </div>
            </div>
            <div class='container-opp' id='blurForm'>
                ${
                    user.role === 'partyOrganizer' ?
                    await addPartyForm.render()
                    :
                    await joinPartyForm.render()
                }
            </div> 
            `
    },
    after_render: async () => {
        document.getElementById('openForm').addEventListener('click', () => {
            document.getElementById("myForm").style.display = "block";
        })
        document.getElementById('closeForm').addEventListener('click', () => {
            document.getElementById("myForm").style.display = "none";
        })
        document.getElementById('openForm').addEventListener('click', () => {
            document.getElementById("blurForm").style.display = "block";
        })
        document.getElementById('closeForm').addEventListener('click', () => {
            document.getElementById("blurForm").style.display = "none";
        })
        document.getElementById('submitCreatePartyForm').addEventListener('click', async(e) => {
            e.preventDefault()
            let user = { ...USER_DETAILS }
            let name = document.getElementById('partyName')
            let duration = document.getElementById('partyDuration') 
            let formValues = {
                name: name.value,
                duration: duration.value,
                creatorId: user.id
            }
            const response = await submitCreateParty(formValues)
            if(response.error) {
                let node = document.createElement('div')
                node.innerHTML = showError(response.error.status, response.error.message)
                document.getElementById('page').appendChild(node)
                setTimeout(function(){document.getElementById('page').removeChild(node)}, 3000);
            }
            else {
                document.getElementById("myForm").style.display = "none";
                document.getElementById("blurForm").style.display = "none";
                window.location.reload(true)
            }
        })
    }
}

export default Home