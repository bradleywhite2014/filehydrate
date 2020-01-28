require('dotenv').config();
const express = require('express')
const app = express()
const port = 8080
const pg = require('pg')
const aws = require('aws-sdk');
const connectionString = process.env.CONNECTION_STRING
const clientId = process.env.CLIENT_ID
const issuer = process.env.ISSUER

const OktaJwtVerifier = require('@okta/jwt-verifier');

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(function(req,res,next) {
    res.header("Access-Control-Allow-Origin", "http://documerge.me");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
})

const oktaJwtVerifier = new OktaJwtVerifier({
    issuer: issuer,
    clientId: clientId,
    assertClaims: { aud: 'documerge' }
});

const client = new pg.Client({
    connectionString: connectionString,
})


client.connect()


function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }
}


// hello route
app.get('/api/hello', function (req, res) {

    res.sendStatus(200);

})

// current round
// app.get('/api/currentRound', verifyToken, function (req, res) {

//     oktaJwtVerifier.verifyAccessToken(req.token)
//         .then(jwt => {
//             client.query('SELECT * from rounds where active=true', (err, resp) => {
//                 res.send(resp.rows[0].round)
//             })
//         })
//         .catch(err => {
//             res.sendStatus(401);
//         });

// })

app.listen(port, () => console.log(`documerge backend listening on port ${port}!`))
