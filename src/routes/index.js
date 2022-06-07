const { Router } = require('express');
const express = require('express');
const { send } = require('process');
const router = express.Router();

let users=[
    {"user":"8680488@gmail.com",
    "status":false,
    "api":"bZNdttuDAJ",
    "key":"84fd5c2859dfd6ebfbc42cc876670801"
    },
    {"user":"abancas@gmail.com",
    "status":true,
    "api":"LIJSjkHasb",
    "key":"cc8f767c1d3f53c22c98069d7717a4d6"
    },
]

const API_BITSO=(key,secret,http_method,request_path,json_payload,callback)=>{
    // Define your request
    var key = key;
    var secret = secret;
    var http_method=http_method;  // Change to POST if endpoint requires data
    var request_path="/v3/"+request_path
    var json_payload=json_payload;    // Needed for POST endpoints requiring data

    // Create the signature
    var nonce = new Date().getTime();
    var message = nonce+http_method+request_path;
    var payload = JSON.stringify(json_payload)
    if (http_method == "POST")
      message += payload;
    var crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secret).update(message).digest('hex');
    
    // Build the auth header
    var auth_header = "Bitso "+key+":" +nonce+":"+signature;
    
    // Send request
    var options = {
      host: 'api.bitso.com',
      path: request_path,
      method: http_method,
      headers: {
        'Authorization': auth_header,
        'Content-Type': 'application/json'
      }
    };
    
    // Send request
    let data = '';
    var http = require('https');
    var req = http.request(options, function(res) {
        res.on('data', function (chunk) {
            data+=chunk;
        });
        res.on('end', () => {
            data = JSON.parse(data);
            callback(data);
        })
    });
    
    req.on('error', (error) => {
        console.error(error)
    })
    if (http_method == "POST") {
        req.write(payload);
    }
    req.end();
}


router.post('/webhook/tradingview',(req,res)=>{
    req.body['test'] == true ? res.send({"Webhook status":"Working...","JSON POST":req.body}):res.send()

    let json_order
    if(req.body['side'] == 'buy'){
        json_order = {'book':req.body['symbol'],'side':req.body['side'],'type':'market','minor':`${req.body['amount']}`}
        users.forEach(element => {
            if(element['status']==true){
                API_BITSO(element['api'],element['key'],'POST','orders',json_order,(data)=>{
                    console.log(data);
                })
            }
        });
           
    }
    else if(req.body['side'] == 'sell'){
        users.forEach(element => {
            if(element['status']==true){
                API_BITSO(element['api'],element['key'],'GET','balance',json_order,(data)=>{
                    data['payload']['balances'].every(element => {
                        if(element['currency']==req.body['symbol'].split('_')[0]){
                            json_order = {'book':req.body['symbol'],'side':req.body['side'],'type':'market','major':`${element['total']}`}
                            users.forEach(element => {
                                API_BITSO(element['api'],element['key'],'POST','orders',json_order,(data)=>{
                                    console.log(data);
                                })
                            });
                            return false;
                        }
                        return true;
                    });
                })

            }
        });


    }
});







module.exports = router;