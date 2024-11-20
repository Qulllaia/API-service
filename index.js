const { default: axios } = require("axios");
require('dotenv').config()
const fs = require('fs');

const getServerToken = async () => {
    const token = await axios({
        method:"post",
        url:process.env.LOGIN_API,
        data:{
            "username":"qulllaia"
        }
    })
    return token.data.token
}

const getClients = async (token) => { 
    const clients = await axios({
        headers:{
            Authorization:token
        },
        url:process.env.CLIENTS_API
    })
    return clients.data
}

const getClientsStatus = async (token) => {
    let userIds = []
    let clientsData = await getClients(token)

    clientsData.forEach(element => {
        userIds.push(element.id)
    });

    const clientsStatus = await axios({
        headers:{
            Authorization:token
        },
        method:'post',
        url:process.env.CLIENTS_API,
        data:{
            "userIds": userIds
        }
    })

    for(let i = 0; i < clientsData.length; i++){
        clientsData[i].status = clientsStatus.data[i].status
    }

    return clientsData
}

async function Result() {
    const token = await getServerToken()
    let result = await getClientsStatus(token)
    result.forEach((element)=>{
        fs.appendFileSync('result.txt', `${element.id}\t${element.firstName}\t${element.lastName}\t${element.gender}\t${element.address}\t${element.city}\t${element.phone}\t${element.email}\t${element.status}\n`)    
    })
}

Result();