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


let json_order = {'book':'btc_mxn','side':'sell','type':'market','minor':'10'}
API_BITSO("LIJSjkHasb","cc8f767c1d3f53c22c98069d7717a4d6",'GET','balance',json_order,(data)=>{
    //console.log(data);
    
    let symbol = 'btc_mxn'.split('_')[0];
    data['payload']['balances'].every(element => {
        if(element['currency']==symbol){
            console.log(element['total']);
            return false;
        }
        //console.log(element['currency']);
        return true;
    });
    
})