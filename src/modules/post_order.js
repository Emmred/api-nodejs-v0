// Define your request
var key = "bZNdttuDAJ";
var secret = "84fd5c2859dfd6ebfbc42cc876670801";
var http_method="POST";  // Change to POST if endpoint requires data
var request_path="/v3/orders/"
var json_payload={'book':'xrp_mxn','side':'sell','type':'limit','major':'2','price':'10'};    // Needed for POST endpoints requiring data

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
var http = require('https');
var req = http.request(options, function(res) {
  console.log(`statusCode: ${res.statusCode}`);
  console.log(`statusMessage: ${res.statusMessage}`);
  res.on('data', function (chunk) {
    console.log(`body: ${chunk}`);
  });
});

req.on('error', (error) => {
  console.error(error)
})
if (http_method == "POST") {
  req.write(payload);
}
req.end();
