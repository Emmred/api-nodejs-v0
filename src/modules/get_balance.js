const API_BITSO=(key,secret,callback)=>{
// Define your request
var key = key;
var secret = secret;
var http_method="GET";  // Change to POST if endpoint requires data
var request_path="/v3/balance/"

// Create the signature
var nonce = new Date().getTime();
var message = nonce+http_method+request_path;
var crypto = require('crypto');
const { type } = require('express/lib/response');
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
    //console.log(`${data["payload"]["balances"][36]['available']}`)
  })
});

req.on('error', (error) => {
  console.error(error)
})
req.end();
}


API_BITSO("bZNdttuDAJ","84fd5c2859dfd6ebfbc42cc876670801",(data)=>{
  console.log(`${data["payload"]["balances"][36]['available']}`);
})