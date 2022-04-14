const fetch = require('node-fetch');
const readline = require('readline-sync')
var random = require('random-name');
var randomize = require('randomatic');
var fs = require('fs-extra')

const keyOtp = ''

const functionChangeActive = (idOrder, api) => new Promise((resolve, reject) => {
    fetch(`https://${api}/stubs/handler_api.php?api_key=${keyOtp}&action=setStatus&status=1&id=${idOrder}`, { 
        method: 'GET'
    })
    .then(res => res.text())
    .then(result => {
        resolve(result);
    })
    .catch(err => reject(err))
});

const functionChangeConfirm = (idOrder, api) => new Promise((resolve, reject) => {
    fetch(`https://${api}/stubs/handler_api.php?api_key=${keyOtp}&action=setStatus&status=6&id=${idOrder}`, { 
        method: 'GET'
    })
    .then(res => res.text())
    .then(result => {
        resolve(result);
    })
    .catch(err => reject(err))
});

const functionChangeCancel = (idOrder, api) => new Promise((resolve, reject) => {
    fetch(`https://${api}/stubs/handler_api.php?api_key=${keyOtp}&action=setStatus&status=8&id=${idOrder}`, { 
        method: 'GET'
    })
    .then(res => res.text())
    .then(result => {
        resolve(result);
    })
    .catch(err => reject(err))
});

const functionGetNumber = (api) => new Promise((resolve, reject) => {
    fetch(`https://${api}/stubs/handler_api.php?api_key=${keyOtp}&action=getNumber&service=ot&operator=&country=6`, { 
        method: 'GET'
    })
    .then(res => res.text())
    .then(result => {
        resolve(result);
    })
    .catch(err => reject(err))
});

const functionGetOtp = (idOrder, api) => new Promise((resolve, reject) => {
    fetch(`https://${api}/stubs/handler_api.php?api_key=${keyOtp}&action=getStatus&id=${idOrder}`, { 
        method: 'GET'
    })
    .then(res => res.text())
    .then(result => {
        resolve(result);
    })
    .catch(err => reject(err))
});

const functionGetBalance = (api) => new Promise((resolve, reject) => {
    fetch(`https://${api}/stubs/handler_api.php?api_key=${keyOtp}&action=getBalance`, { 
        method: 'GET'
    })
    .then(res => res.text())
    .then(result => {
        resolve(result);
    })
    .catch(err => reject(err))
});

const functionSendOtp = (nomor) => new Promise((resolve, reject) => {
    const bodys = {
        phoneNumber: nomor
    }

    fetch('http://54.179.171.207:8001/sendOtp', { 
        method: 'POST',
        body: JSON.stringify(bodys),
        headers: {
            'content-type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(result => {
        resolve(result);
    })
    .catch(err => reject(err))
});

const functionGetToken = (userId, deviceId, otpLink) => new Promise((resolve, reject) => {
    const bodys = {
        userId: userId,
        deviceId: deviceId,
        otpLink: otpLink
    }

    fetch('http://54.179.171.207:8001/getToken', { 
        method: 'POST',
        body: JSON.stringify(bodys),
        headers: {
            'content-type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(result => {
        resolve(result);
    })
    .catch(err => reject(err))
});

const functionVeryfToken = (userId, deviceId, token) => new Promise((resolve, reject) => {
    const bodys = {
        userId: userId,
        deviceId: deviceId,
        token: token
    }

    fetch('http://54.179.171.207:8001/veryfToken', { 
        method: 'POST',
        body: JSON.stringify(bodys),
        headers: {
            'content-type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(result => {
        resolve(result);
    })
    .catch(err => reject(err))
});

const functionProfile = (userId, deviceId, email) => new Promise((resolve, reject) => {
    const bodys = {
        userId: userId,
        deviceId: deviceId,
        email: email
    }

    fetch('http://54.179.171.207:8001/profile', { 
        method: 'POST',
        body: JSON.stringify(bodys),
        headers: {
            'content-type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(result => {
        resolve(result);
    })
    .catch(err => reject(err))
});

const functionInputReff = (userId, deviceId, reffCode, accessToken) => new Promise((resolve, reject) => {
    const bodys = {
        userId: userId,
        deviceId: deviceId,
        reffCode: reffCode,
        accessToken: accessToken
    }

    fetch('http://54.179.171.207:8001/reff', { 
        method: 'POST',
        body: JSON.stringify(bodys),
        headers: {
            'content-type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(result => {
        resolve(result);
    })
    .catch(err => reject(err))
});

(async () => {

    let jmlReffBerhasil = 0;

    let api = ''
    
    do {
        console.log('Service OTP\n1. SMSHUB\n2. SMS RU')
        var askApi = readline.question('Pilih service: ')

        if(askApi == 1){
            api = 'smshub.org'
        } else if(askApi == 2){
            api = 'api.sms-activate.org'
        } else {
            console.log('Service tidak tersedia\n')
        }

    } while(askApi >= 3 || isNaN(askApi))

    const reffCode = readline.question('Reff code: ')
    const jmlReff = readline.question('Jumlah Reff : ')

    console.log("")

    do {

        try {

            do {
                var getBalance = await functionGetBalance(api)
            } while(!getBalance.includes('ACCESS_BALANCE'))

            const balance = getBalance.split(':')[1]

            if(balance >= 7){
                do{
                    var getNumber = await functionGetNumber(api)
                } while(!getNumber.includes('ACCESS_NUMBER'))

                const idOrder = getNumber.split(':')[1]
                const nomor = getNumber.split(':')[2].slice(2)
                
                const email = `${random.first()}${randomize('0', 5)}@gmail.com`

                console.log(`${email} | ${nomor}`)
    
                const sendOtp = await functionSendOtp(nomor)
                
                if(sendOtp.result.message == 'NewUser'){
                    console.log('OTP berhasil dikirim')
                    const userId = sendOtp.result.userId
                    const deviceId = sendOtp.result.deviceId

                    let countGetOtp = 0;
                    let statusOtp = false;

                    console.log(`Sedang menunggu link verify`)

                    if(api == 'api.sms-activate.org'){
                        await functionChangeActive(idOrder, api)
                    }

                    do{
                        countGetOtp++   
                        var getOtp = await functionGetOtp(idOrder, api)
                        if(getOtp.includes('Hopper')){
                            statusOtp = true;
                        }
                    } while(!getOtp.includes('Hopper') && countGetOtp <= 200)
    
                    if(statusOtp == true){

                        var urlRegex = /(https?:\/\/[^ ]*)/;

                        const otpLink = getOtp.match(urlRegex)[1].split('/')[5]

                        console.log(`Link veryf didapatkan ${otpLink}`)

                        const tokenOtp = await functionGetToken(userId, deviceId, otpLink)
    
                        if(tokenOtp.result.message == 'found'){
        
                            const token = tokenOtp.result.token
        
                            console.log('Mencoba validasi link token')
        
                            const veryfToken = await functionVeryfToken(userId, deviceId, token)
        
                            if(veryfToken.result.message == 'Verified'){
                                console.log('Verifikasi berhasil')
        
                                const profile = await functionProfile(userId, deviceId, email)
                                if(profile.result.message == 'Finalized'){
                                    console.log('Berhasil mengisi profile')
        
                                    const accessToken = profile.result.accessToken
        
                                    const inputReff = await functionInputReff(userId, deviceId, reffCode, accessToken)
        
                                    if(inputReff.result.message == 'Reff success'){
                                        jmlReffBerhasil++
                                        console.log(`Reff berhasil ${jmlReffBerhasil} | Kode reff : ${inputReff.result.reffCode} | Saved on hopperAcc.txt\n`)
                                        await functionChangeConfirm(idOrder, api)
                                        await fs.appendFile('hopperAcc.txt',`${email}|${nomor}|${inputReff.result.reffCode}`+'\r\n', err => {
                                            if (err) throw err;
                                        })
                                    } else {
                                        console.log('Reff gagal\n')
                                        await functionChangeConfirm(idOrder, api)
                                    }
        
                                } else {
                                    console.log('Gagal mengisi profile\n')
                                }
        
                            } else {
                                console.log('Verifikasi gagal\n')
                            }
        
                        } else {
                            console.log('Link token gagal diverifikasi\n')
                            await functionChangeCancel(idOrder, api)
                        }
                    } else {
                        console.log('Link token gagal didapatkan\n')
                        await functionChangeCancel(idOrder, api)
                    }
    
                } else {
                    console.log('Nomor telah digunakan\n')
                }
            }
        } catch(e){ 
            console.log(e)
        }
    } while (jmlReffBerhasil != jmlReff)
})();