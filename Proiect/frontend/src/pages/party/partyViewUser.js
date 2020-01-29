let PartyViewUser = {
    render: async (partyDetails, nowPlaying) => {
        return `
        <div class="wrapper">
        <div class="page-flex" id="page">
            <div class="card">
                <div class="card-title">
                    ${partyDetails.name}
                </div>
                <div class="card-infos">
                    <div class="card-info">Status:</div>
                    <div class="card-details">${partyDetails.status}</div>
                </div>
                <div class="card-infos">
                    <div class="card-info">Codul petrecerii:</div>
                    <div class="card-details">${partyDetails.partyCode}</div>
                </div>
                <div class="card-infos">
                    <div class="card-info">Durata petrecerii:</div>
                    <div class="card-details">${partyDetails.duration} minute</div>
                </div>
            </div>
            ${
            partyDetails.status === 'live' &&
            `
                    <div class="card">
                        <div class="card-title">Melodia redata acum</div>
                        <div class="card-info">${nowPlaying.nowPlaying === 'none' ? 'Inca nu este redata nicio melodie' : nowPlaying.nowPlaying}</div>
                    </div>
                `
            }
            <div class="card">
                <div class="card-title">Detalii miscare</div>
                <div class="card-info" id="locationInfo">
                    <div class="x">1</div>
                </div>
            </div>
        </div>
    </div>
        `
    },
    after_render: async (detectMotion) => {
        document.getElementsByClassName('x')[0].innerHTML = `2`
        console.log('poate vrea a mearga')
        let gyroscope = new Gyroscope({ frequency: 1 })
        let motionArray = []
        
        let count = 0
            let timer = setInterval( () => {
                console.log('jjjjj',count)
                if(count<3) {
                    count ++
                    gyroscope.addEventListener('reading', async (e) => {
                        console.log('snu a intrat si aici')
            
                        console.log("Angular velocity along the X-axis " + gyroscope.x.toFixed(3));
                        console.log("Angular velocity along the Y-axis " + gyroscope.y);
                        console.log("Angular velocity along the Z-axis " + gyroscope.z);
                        document.getElementById('locationInfo').innerHTML = `
                            <div>${gyroscope.x.toFixed(3)}</div>
                            <div>${gyroscope.y.toFixed(3)}</div>
                            <div>${gyroscope.z.toFixed(3)}</div>
                            `
                        // const timer = setInterval( () => motionArray.push({x:gyroscope.x.toFixed(3), y:gyroscope.y.toFixed(3), z:gyroscope.z.toFixed(3)}), 20000 )
                        // setTimeout( () => clearInterval(timer),60000)
                        // let timerId = setInterval(() =>  motionArray.push({x:gyroscope.x.toFixed(3), y:gyroscope.y.toFixed(3), z:gyroscope.z.toFixed(3)}),20000)
                        // setTimeout(()=> {
                        //     clearInterval(timerId)
                        // }, 60000)
            
                    });
                    motionArray.push({x:gyroscope.x.toFixed(3), y:gyroscope.y.toFixed(3), z:gyroscope.z.toFixed(3)})
                    console.log('ancd',motionArray)
                }
                else {
                    clearInterval(timer)
                    count=0
                    detectMotion(motionArray)
                }
            }, 20000)
        gyroscope.start();
        console.log('a intrat in after render', gyroscope)

    }
}
export default PartyViewUser