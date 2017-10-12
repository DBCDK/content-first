# Authentication

## Smaug (OpenPlatform)

```
request.post(`${smaug_url}/oauth/token`)
  .type('form')
  .send({
    grant_type: 'password',
    username: '@',
    password: '@'
  })
  .auth(clientID, clientSecret)
  .then(response => {
    const token = response.body;
    if (token.error) {
      console.log(`Error while retrieving token from Smaug: ${token}`);
    }
    else {
      console.log(token);
    }
  })
  .catch(error => {
    console.log(`ERROR: ${error}`);
  })
  ;
```

Response: 

```
{ "token_type": "bearer"
, "access_token": "141432e6cd4988cf2933f2868450a0b2ec218f5c"
, "expires_in": 2592000
}
```

or

```
{ "code": 400
, "error": "invalid_client"
, "error_description": "Client credentials are invalid"
}
```

### Staging

- https://auth-stg.dbc.dk
 
### Production

- https://auth.dbc.dk

## Hejmdal

See https://stg.login.bib.dk

```
request.get(`${hejmdal_url}/login?token=${smaug_token}`);
```

Successful user login redirects to `https://`*redirect_url*`?token=`*token*`&id=`*id*

Failure returns a 403.

Then,

```
request.get(`${hejmdal_url}/getTicket/${token}/${id}`);
```

which can only be done once.

Response:

```
{ "id":1573
, "token":"09fe4dd4ad924ec4ad9735d3daaef50b0dcce24c60d298257281dd07f08ec18e"
, "attributes":
  { "cpr":"2508710000"
  , "gender":"m"
  , "userId":"2508710000"
  , "wayfId":null
  , "agencies": []
  , "birthDate": "2508"
  , "birthYear": "1971"
  , "uniloginId": null
  , "municipality": null
  }
}
```

or if already used:

```
{attributes: null}
```

or if wrong:

```
{attributes: false}
```

### Staging

- https://stg.login.bib.dk/

Caveat: Access tokens form Smaug staging does *not* work with Hejmdal staging.  THe only token that works is a fixed one, ask someone who knows what it is.

### Production

- https://login.bib.dk/

Caveat: All access tokens from Smaug work with Hejmdal production.  Go figure.
