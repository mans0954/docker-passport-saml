const express = require('express')
const passport = require('passport')
const app = express()
const port = 3000

var SamlStrategy = require('passport-saml').Strategy;

app.use(passport.initialize());

passport.use(new SamlStrategy(
  {
    path: '/login/callback',
    entryPoint: 'https://writelatex-idp.stag-overleaf.com/idp/profile/SAML2/Redirect/SSO',
    issuer: 'passport-saml'
  },
  function(profile, done) {
    findByEmail(profile.email, function(err, user) {
      if (err) {
        return done(err);
      }
      return done(null, user);
    });
  })
);

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/login',
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function(req, res) {
    res.redirect('/');
  }
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


