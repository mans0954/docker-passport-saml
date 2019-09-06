const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express()
const port = 3000

var privateKey = fs.readFileSync(process.env["PASSPORT_SAML_PRIVATE_KEY"], 'utf-8');

var idpCert = fs.readFileSync(process.env["PASSPORT_SAML_IDP_CERT"], 'utf-8');

var SamlStrategy = require('passport-saml').Strategy;

var ServiceFQDN = process.env["PASSPORT_SERVICE_FQDN"]

app.use(passport.initialize());

passport.use(new SamlStrategy(
  {
    path: '/login/callback',
    entryPoint: 'https://writelatex-idp.stag-overleaf.com/idp/profile/SAML2/Redirect/SSO',
    issuer: `https://${ServiceFQDN}/passport-saml`,
    callbackUrl: `https://${ServiceFQDN}/login/callback`,
    privateCert: privateKey,
    decryptionPvk: privateKey,
    cert: idpCert,
    identifierFormat: null
  },
  function(profile, done) {
    console.log("Profile Object:");
    console.log(profile);
    const user1 = {};
    user1.username = "user1";
    user1.issuer = profile.issuer;
    user1.sessionIndex = profile.sessionIndex;
    console.log("User Object:");
    console.log(user1);
    done(null, user1);
  })
);

passport.serializeUser(function(user, done) {
  console.log("serializeUser");
  console.log(user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log("deserializeUser");
  console.log(user);
  done(null, user);
});

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/login',
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function(req, res) {
    res.redirect('/');
  }
);

app.post('/login/callback',
  bodyParser.urlencoded({ extended: false }),
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/Metadata',(req, res) => {
  const samlStrategy = req._passport.instance._strategy('saml')
  var signingCert=fs.readFileSync(process.env["PASSPORT_SAML_CERT"], 'utf-8');
  var metadata = samlStrategy.generateServiceProviderMetadata(signingCert,signingCert)
  res.type('application/xml;charset=UTF-8').send(metadata)
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


