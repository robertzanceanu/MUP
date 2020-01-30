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
const getPartyStatistics = async() => {
    let partyId = location.pathname.split('/')[2]
    try {
        const response = await fetch(`${API_URL}/parties/getLiveParty/statistics/${partyId}`, {
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
const getNowPlaying = async() => {
    let partyId = location.pathname.split('/')[2]
    try {
        const response = await fetch(`${API_URL}/parties/getLiveParty/nowPlaying/${partyId}`, {
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
const detectMotion = async(motionArray) => {
    let user = {...USER_DETAILS}
    let isDancing = false
    console.log('ancd1', motionArray)
    let numberOfMotions = 0
    motionArray.map((motion,index) => {
        if(parseFloat(motion.x) > 0.1 || parseFloat(motion.y) > 0.1 || parseFloat(motion.z)) {
            numberOfMotions++
        }
    })
    if(numberOfMotions > motionArray.length/2) {
        isDancing = true
    }
    console.log('ancd2',isDancing)
    let data ={
        userId:user.id,
        isDancing:isDancing
    }
    let partyId = location.pathname.split('/')[2]
    try {
        const response = await fetch(`${API_URL}/parties/openParty/modifyDancing/${partyId}`, {
            method: 'put',
            headers: {
                'Accept': 'aplication/json',
                'auth-token': `${AUTH_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const json = await response.json()
        await getNextSong()
        window.location.reload(true)
        return json
    } catch (err) {
        console.log(err)
    }
}
const getFirstSong = async() => {
    console.log('intra in first song')
    let partyId = location.pathname.split('/')[2]
    try {
        const response = await fetch(`${API_URL}/parties/playFirstSong/${partyId}`, {
            method: 'get',
            headers: {
                'Accept': 'aplication/json',
                'auth-token': `${AUTH_TOKEN}`,
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json()
        // window.location.reload(true)
        return json
    } catch (err) {
        console.log(err)
    }
}
const getNextSong = async() => {
    let partyId = location.pathname.split('/')[2]
    try {
        const response = await fetch(`${API_URL}/parties/getNextSong/${partyId}`, {
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
let PartyView = {
    render: async () => {
        let userDetails = { ...USER_DETAILS }
        const partyDetails = await getParty()
        console.log('a intrat')
        let statistics = {}
        if(userDetails.role === 'partyOrganizer' && (partyDetails.status === 'live' || partyDetails.status === 'closed')) {
            console.log('a intrat in if')
            statistics = await getPartyStatistics()
        }
        let nowPlaying = {}
        if(partyDetails.status === 'live') {
            nowPlaying = await getNowPlaying()
        }
        return `
            <div class="page-wrapper">
                ${userDetails.role === 'partyOrganizer' ?
                await PartyViewOrganizer.render(userDetails, partyDetails, statistics, nowPlaying)
                :
                await PartyViewUser.render(partyDetails,nowPlaying)
            }       
            </div>
        `
    },
    after_render: async () => {
        let userDetails = { ...USER_DETAILS }
        console.log('a pornit')
        if (userDetails.role === 'partyOrganizer'){
            await PartyViewOrganizer.after_render(startParty, getParty,getFirstSong)
        }
        else {
            await PartyViewUser.after_render(detectMotion)
            console.log('aaa')

        }
    }
}

export default PartyView