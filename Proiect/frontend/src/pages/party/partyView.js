import PartyViewOrganizer from './partyViewOrganizer'
import PartyViewUser from './partyViewUser'
import { USER_DETAILS, AUTH_TOKEN } from '../../shared/user'
import { API_URL } from '../../constants'

const getParty = async () => {
    let partyId = location.pathname.split('/')[2]
    try {
        const response = await fetch(`${API_URL}/parties/getParty/${partyId}`, {
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
const startParty = async () => {
    console.log('merge')
    let partyId = location.pathname.split('/')[2]
    try {
        const response = await fetch(`${API_URL}/parties/startParty/${partyId}`, {
            method: 'put',
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
let PartyView = {
    render: async () => {
        let userDetails = { ...USER_DETAILS }
        const partyDetails = await getParty()
        console.log('a intrat')
        return `
            <div class="page-wrapper">
                ${userDetails.role === 'partyOrganizer' ?
                await PartyViewOrganizer.render(userDetails, partyDetails)
                :
                await PartyViewUser.render()
            }       
            </div>
        `
    },
    after_render: async () => {

        let userDetails = { ...USER_DETAILS }
        console.log('a pornit')
        if (userDetails.role === 'partyOrganizer')
            await PartyViewOrganizer.after_render(startParty, getParty)
        else
            await PartyViewUser.after_render()


        window.addEventListener('change', () => {
            console.log('s-a oprit')
            render()
        })
    }
}

export default PartyView