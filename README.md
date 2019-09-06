# docker-passport-saml

Example use of passport-saml with express.

```
export PASSPORT_SAML_PRIVATE_KEY=sp-signing.key
export PASSPORT_SAML_CERT=sp-signing.crt
export PASSPORT_SAML_IDP_CERT=idp.crt
export PASSPORT_SERVICE_FQDN=passport-saml.example.org
```

Log in at `/login`

Metadata presented at `/Metadata`
