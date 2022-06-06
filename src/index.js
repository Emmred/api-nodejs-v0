const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const path = require('path');

app.set('port',3000);
app.use(bodyParser.urlencoded({extende:false}))
app.use(bodyParser.json())



app.use(require('./routes/index'));


app.listen(app.get('port'),()=>{
    console.log('server on port',app.get('port'));
});

//Esto lo dejo para recordar construir una api mas adelante
//app.get('/api/algo',(req,res)=>{
//    res.send('hola mundo');
//});
//Esto lo dejo para recordar construir una api mas adelante