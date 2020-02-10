import { API_URL } from '../constants'
import { USER_DETAILS } from '../shared/user'
import Unauthorized from './unauthorized401'
import addPartyForm from '../components/addPartyForm'
import joinPartyForm from '../components/joinPartyForm'

const io=require("socket.io-client")
const ioClient=io.connect("http://localhost:8000");



// ioClient.emit("semnal",'semnal');
// console.info("am trimis semnalul");

//var timer=setInterval(sendSignal,1000);

// function sendSignal(){
//     ioClient.emit("semnal",'semnal')
// }


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
const joinParty = async (partyId, data) => {
    console.log('sunt aici')
    try {
        const response = await fetch(`${API_URL}/parties/joinParty/${partyId}`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'auth-token': `${localStorage.getItem('auth-token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const json = await response.json()
        ioClient.emit("semnal",'semnal');
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
const loginSpotify = async () => {
    try {
        const response = await fetch(`${API_URL}/spotify/login`, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                // 'auth-token': `${localStorage.getItem('auth-token')}`,
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json()
        return json
    } catch (err) {
        console.log(err)
    }
}
const callbackSpotify = async () => {
    try {
        const response = await fetch(`${API_URL}/spotify/callback`, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                // 'auth-token': `${localStorage.getItem('auth-token')}`,
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
        await loginSpotify()
        await callbackSpotify()
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
                            <a ${user.role === 'partyOrganizer' ? 
                                `href="/party/${party._id}"` 
                                :
                                party.inParty ?
                                    `href="/party/${party._id}" data-party-index=${index}`
                                    : 
                                    `id="openPopupFromCard" data-party-index=${index}`}>
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
                                ${
                                    user.role === 'partyOrganizer' ?
                                    `
                                    <div class="partyFlex">
                                        <div class="partyLabel">Codul petrecerii:</div>
                                        <div class="partyCode">${party.partyCode}</div>
                                    </div>
                                    `
                                    : ''
                                }
                                
                            </div>
                            </a>`
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
        const user = {...USER_DETAILS}
        let response = await getParties()
        document.getElementById('openForm').addEventListener('click', () => {
            document.getElementById("myForm").style.display = "block";
            document.getElementById("blurForm").style.display = "block";
        })
        document.getElementById('closeForm').addEventListener('click', () => {
            document.getElementById("myForm").style.display = "none";
            if (document.getElementById("myForm").getAttribute('data-index')) {
                document.getElementById("myForm").removeAttribute('data-index')
                document.getElementById('myForm').getElementsByClassName('form-popup-title')[0].innerHTML="Alatura-te unei petreceri:"
            }
            document.getElementById("blurForm").style.display = "none";
        })
        let partiesHTML = document.querySelectorAll('[data-party-index]')
        console.log(partiesHTML)
        partiesHTML.forEach((party,index) => {
            console.log(index,party.href)
            if(!party.href) {
                party.addEventListener('click', async() => {
                    document.getElementById("myForm").style.display = "block";
                    document.getElementById("myForm").setAttribute('data-index',`${index}`);
                    document.getElementById('myForm').getElementsByClassName('form-popup-title')[0].innerHTML=`Alatura-te petrecerii ${response.parties[index].name}`
                    document.getElementById("blurForm").style.display = "block";
                })
            }
            
        })
        if(user.role === 'partyOrganizer') {
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
        } else {
            document.getElementById('submitJoinPartyForm').addEventListener('click', async(e) => {
                e.preventDefault()
                let partyIndex = document.getElementById('myForm').getAttribute('data-index')
                let partyId = response.parties[partyIndex]._id
                console.log('aici merge?')
                let partyCode = document.getElementById('partyCode')
                let favArtist = document.getElementById('favArtist')
                let favSong = document.getElementById('favSong')
                let favGenre = document.getElementById('favGenre')
                console.log('aici merge1?')
                let formValues = {
                    partyCode: partyCode.value,
                    favArtist: favArtist.value,
                    favSong: favSong.value,
                    favGenre: favGenre.value,
                    userId: user.id
                }
                console.log('aaaa',partyId, formValues)
                let fetchRresponse = await joinParty(partyId,formValues)

                if(fetchRresponse.error) {
                    let node = document.createElement('div')
                    node.innerHTML = showError(fetchRresponse.error.status, fetchRresponse.error.message)
                    document.getElementById('page').appendChild(node)
                    setTimeout(function(){document.getElementById('page').removeChild(node)}, 3000);
                }
                else {
                    document.getElementById("blurForm").style.display = "none";
                    document.getElementById("myForm").style.display = "none";
                    if (document.getElementById("myForm").getAttribute('data-index')) {
                        document.getElementById("myForm").removeAttribute('data-index')
                        document.getElementById('myForm').getElementsByClassName('form-popup-title')[0].innerHTML="Alatura-te unei petreceri:"
                    }
                    window.location.reload(true)
                }
            })
        }
        
    }
}

export default Home