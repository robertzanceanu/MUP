document.getElementById('submitJoinPartyForm').onclick=function(){
    const io=require("socket.io-client")
    const ioClient=io.connect("http://localhost:8000");
    
    ioClient.emit("semnal",'semnal');
    console.info("am trimis semnalul");
    ioClient.disconnect();
    }