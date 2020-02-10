import { API_URL } from '../constants'

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

let Statistics = {
    render: async () => {
        return `
        
        `
    },
    after_render: async () => {
    }
}

export default Statistics