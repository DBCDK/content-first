# Public service endpoints

The responses from the backend are either raw images or JSON loosely based on the [JSON-API](http://jsonapi.org/) specification, see [schemas used when testing](../src/fixtures/schemas/).

To only expose non-destructive endpoint to the public (ie. those needed by the [frontend](../src/client/)), the [backend](../src/server) sets an internal HTTP server up on an a non-public port in addtion to the port used for public access.

The internal endpoints are described in [internal-endpoints.md](internal-endpoints.md).  This document describes the public endpoint.

## Books

### `GET /v1/book/`*pid*

Returns a [book structure](../src/fixtures/schemas/book-data-out.json), like

    { "data":
      { "pid": "870970-basis-53188931"
      , "unit_id": "unit:22125672"
      , "work_id": "work:20137979"
      , "bibliographic_record_id": "53188931"
      , "creator": "Jens Blendstrup"
      , "title": "Havelågebogen"
      , "title_full": "Havelågebogen : trælåger, gitterlåger, fyldningslåger, jern- og smedejernslåger"
      , "taxonomy_description": "Ingen beskrivelse"
      , "description": "Heller ingen beskrivelse"
      , "pages": 645
      , "loans": 1020
      , "type": "Bog"
      , "work_type": "book"
      , "language": "Dansk"
      , "items": 196
      , "libraries": 80
      , first_edition_year: 2017
      , genre: 'humor'
      , subject: 'billedværker, humor, fotografier'
      , literary_form: 'digte, fiktion'
      }
    , "links":
      { "self": "/v1/book/870970-basis-53188931"
      , "cover": "/v1/image/870970-basis-53188931"
      }
    }

### `GET /v1/books?pids=`*pid*,...,*pid*

Results in a [list of books](../src/fixtures/schemas/books-data-out.json), each of the format as `GET /v1/book`, like

    { "data":
      [ { "book":
          { "pid": "870970-basis-53188931"
          , "title": "Havelågebogen"
          , "...": "..."
          }
        , "links":
          { "self": "/v1/book/870970-basis-53188931"
          , "cover": "/v1/image/870970-basis-53188931"
          }
        }
      , { "book":
          { "pid": "870970-basis:22629344"
          , "title": "Harry Potter og De Vises Sten"
          , "...": "..."
          }
        , "links":
          { "self": "/v1/book/870970-basis:22629344"
          , "cover": "/v1/image/870970-basis:22629344"
          }
        }
      ]
    , "links":
      { "self": "/v1/books?pids=870970-basis-53188931,870970-basis:22629344"
      }
    }

## Images

### `GET /v1/image/`*pid*

The path must one that has been returned by a `/v1/book` or `/v1/books` request.

The result is an image file.

## Recommendations

### `GET /v1/recommendations?tag=`*metatag*`&`...`&tag=`*metatag*

Each metatag must be a number defined by [Metakompasset](https://github.com/DBCDK/metakompasset).  The client must provide at least one metatag.

The result is a list of books such that each book include all the specified tags.

## Tags

### `GET /v1/tags/`*pid*

Returns a list of tag for a specific PID, like

    { "data":
      { "pid": '870970-basis:53187404'
      , "tags": [49, 55, 56, 90, 221, 223, 224, 230, 234, 281, 302, 313]
      }
    , "links":
      { "self": "/v1/tags/870970-basis:53187404"
      }
    }

## Taxonomy

### `GET /v1/taxonomy`

Returns the top-level taxonomy, like

    { "data":
      [ { "id": 0
        , "title": "Stemning"
        , "next_level": "/v1/taxonomy/0"
        }
      , { "id": 217
        , "title": "Krav til læseren"
        , "next_level": "/v1/taxonomy/217"
        }
      , { "id": 243
        , "title": "Handling"
        , "next_level": "/v1/taxonomy/243"
        }
      , { "id": 292
        , "title": "Ramme"
        , "next_level": "/v1/taxonomy/292"
        }
      ]
    , "links":
      { "self": "/v1/taxonomy"
      }
    }

### `GET /v1/taxonomy/`*tag*

Returns the second-level taxonomy under *tag*, like

    { "data":
      [ { "id": 293
        , "title": "Handlingens tid"
        , "next_level": "/v1/taxonomy/293"
        }
      , { "id": 307
        , "title": "Geografi"
        , "next_level": "/v1/taxonomy/307"
        }
      , { "id": 323
        , "title": "Miljø"
        , "next_level": "/v1/taxonomy/323"
        }
      ]
    , "links":
      { "self": "/v1/taxonomy/292"
      , "previous_level": "/v1/taxonomy"
      }
    }

Or returns the third-level taxonomy under *tag*, like

    { "data":
      [ { "id": 324
        , "title": "Fængsel"
        , "next_level": "/v1/taxonomy/324"
        }
      , { "id": 325
        , "title": "Kollektiv"
        , "next_level": "/v1/taxonomy/325"
        }
      , { "id": 326
        , "title": "Landsbysamfund"
        , "next_level": "/v1/taxonomy/326"
        }
      ]
    , "links":
      { "self": "/v1/taxonomy/323"
      , "previous_level": "/v1/taxonomy/292"
      }
    }

### `GET /v1/complete-taxonomy`

Returns the complete taxonomy, like

    { "data":
      [ { "id": 0
        , "title": "Stemning"
        , items:
          [ { "id": 1,
            , "title": "Optimistisk"
            , "items": [ { "id": 2, title: "Entusiastisk" } ]
            }
          ]
        }
      ]
    , "links":
      { "self": "/v1/complete-taxonomy"
      }
    }

## Users

### `GET /v1/user`

Returns [user information](../src/fixtures/schemas/user-data-out.json) for a logged-in user, like

    { "data":
      { "name": "Jens Godfredsen"
      , "shortlist":
        [ { "pid": "870970-basis-22629344"
          , "origin": "en-let-læst-bog"
          }
        ]
      , "lists":
        [ { "data": 
            { "type": "SYSTEM_LIST"
            , "public": false,
            , "title": "My List"
            , "description": "A brand new list"
            , "list":
              [ { "pid": "870970-basis-22629344"
                , "description": "Magic to the people"
                }
              ]
            }
          , "links":
            { "self": "/v1/lists/98c5ff8c6e8f49978c857c23925dbe41"
            }
          }
        ]
      , "profiles":
        [ { "name": "Med på den værste"
          , "profile":
            { "moods": ["Åbent fortolkningsrum", "frygtelig", "fantasifuld"]
            , "genres": ["Brevromaner", "Noveller"]
            , "authors": ["Hanne Vibeke Holst", "Anne Lise Marstrand Jørgensen"]
            , "archetypes": ["hestepigen"]
            }
          }
        ]
      }
    , "links": 
      { "self": "/v1/user"
      }
    }

### `PUT /v1/user`

Updates the [user information](../src/server/schemas/user-in.json) like

    { "name": "Ole Henriksen"
    , "shortlist":
      [ { "pid": "870970-basis-53188931"
        , "origin": "en-let-læst-bog"
        }
      , { "pid": "870970-basis-51752341"
        , "origin": "bibliotikarens-ugentlige-anbefaling"
        }
      ]
    , "profiles":
      [ { "name": "En tynd en"
        , "profile":
          { "moods": [ "frygtelig" ]
          , "authors": [ "Carsten Jensen" ]
          , "genres": [ "Skæbnefortællinger" ]
          , "archetypes": [ "Goth" ]
          }
        }
      , { "name": "Ny profile"
        , "profile":
          { "moods": [ "dramatisk" ]
          , "authors": [ "Helge Sander" ]
          , "genres": [ "Skæbnefortællinger" ]
          , "archetypes": [ "Goth" ]
          }
        }
      ]
    }

The user info is updated selectively, that is, you can leave out some of the fields to not change their value.

### `GET /v1/login`

If the user is already logged in (ie. a valid cookie is present in the request), the result is the same as for `GET /v1/user/`.

If there is no cookie or the cookie is invalid, then the web service will redirect to Adgangsplatform (Hejmdal) login page.  On successful login, the service will redirect to endpoint defined by the [server constant `start`](../src/server/constants.js), which can then use `GET /v1/login` or `GET /v1/user`.  On remote subsystem failure, the service will redirect to endpoint defined by the [server constant `generalError`](../src/server/constants.js).

### `POST /v1/logout`

Makes sure the current login cookie is invalidated.  The result is a redirection to the logout endpoint in Adgangsplatform (Hejmdal).  When the client redirects to Hejmdal, Hejmdal will remove its own tokens, and finally redirect back to the (client) endpoint defined by the [server constant `loggedOut`](../src/server/constants.js).

### `GET /v1/profiles`

Returns the currently logged-in user's [profiles](../src/fixtures/schemas/profiles-data-out.json), like

    { "data":
      [ { "name": "Med på den værste"
        , "profile":
          { "moods":
            [ "Åbent fortolkningsrum"
            , "frygtelig"
            , "fantasifuld"
            ]
          , "authors":
            [ "Hanne Vibeke Holst"
            , "Anne Lise Marstrand Jørgensen"
            ]
          , "genres":
            [ "Brevromaner"
            , "Noveller"
            ]
          , "archetypes":
            [ "hestepigen"
            ]
          }
        }
      ]
    , "links"
      { "self": "/v1/profiles"
      }
    }

If the user is not logged-in, the result is 403.

### `PUT /v1/profiles`

Updates the currently logged-in user's profiles.  The [input](../src/server/schemas/profiles-in.json) is like

    [ { "name": "En tynd en"
      , "profile":
        { "moods": [ "frygtelig" ]
        , "authors": [ "Carsten Jensen" ]
        , "genres": [ "Skæbnefortællinger" ]
        , "archetypes": [ "Goth" ]
        }
      }
    , { "name": "Ny profile"
      , "profile":
        { "moods": [ "dramatisk" ]
        , "authors": [ "Helge Sander" ]
        , "genres": [ "Skæbnefortællinger" ]
        , "archetypes": [ "Goth" ]
        }
      }
    ]

If the user is not logged-in, the result is 403.

### `GET /v1/shortlist`

Returns the logged-in user's [shortlist](../src/fixtures/schemas/shortlist-data-out.json), like

    { "data": 
      [ { "pid": "870970-basis-53188931"
        , "origin": "en-let-læst-bog"
        }
      , { "pid": "870970-basis-51752341"
        , "origin": "bibliotikarens-ugentlige-anbefaling"
        }
      ]
    , "links"
      { "self": "/v1/shortlist"
      }
    }

If the user is not logged-in, the result is 403.

### `PUT /v1/shortlist`

Updates the currently logged-in user's [shortlist](../src/server/schemas/shortlist-in.json).  The input is like

    [ { "pid": "870970-basis-53188931"
      , "origin": "en-let-læst-bog"
      }
    , { "pid": "870970-basis-51752341"
      , "origin": "bibliotikarens-ugentlige-anbefaling"
      }
    ]
  
If the user is not logged-in, the result is 403.

### `GET /v1/lists`

Returns the logged-in user's [simple list](../src/fixtures/schemas/lists-data-out.json), like

    { "data":
      [ { "data": 
          { "type": "SYSTEM_LIST"
          , "public": true,
          , "title": "My List"
          , "description": "A brand new list"
          , "list":
            [ { "pid": "870970-basis-22629344"
              , "description": "Magic to the people"
              }
            ]
          }
        , "links":
          { "self": "/v1/lists/98c5ff8c6e8f49978c857c23925dbe41"
          }
        }
      ]
    , "links": 
      { "self": "/v1/lists"
      }
    }

If the user is not logged-in, the result is 403.

### `GET /v1/lists/`*uuid*

Returns a specific [simple list](../src/fixtures/schemas/list-data-out.json) for the logged-in user, like

    { "data":
      { "type": "CUSTOM_LIST"
      , "public": false
      , "title": "My List"
      , "description": "A brand new list"
      , "list":
        [ { "pid": "870970-basis-22629344"
          , "description": "Magic to the people"
          }
        ]
      }
    , "links": 
      { "self": "/v1/lists/98c5ff8c6e8f49978c857c23925dbe41"
      }
    }

If the user is not logged-in, the result is 403.
### `POST /v1/lists`

Reserves an address for a new list for the currently logged-in user.  Returns the location like:

    { "data": "/v1/lists/8f27e592174546518a6cc2449e126eff"
    , "links":
      { "self": "/v1/lists/8f27e592174546518a6cc2449e126eff"
      }
    }

If the user is not logged-in, the result is 403.

### `PUT /v1/lists/`*uuid*

Updates a specific list for the currently logged-in user.  The [input](../src/server/schemas/list-in.json) is like

    { "type": "CUSTOM_LIST"
    , "public": true,
    , "title": "Must read"
    , "description": "Interesting books"
    , "list":
    [ { "pid": "870970-basis-51752341"
      , "description": "Exciting!"
      }
    ] 

If the user is not logged-in, the result is 403.

### `DELETE /v1/lists/`*uuid*

Deletes a specific list for the currently logged-in user.

If the user is not logged-in, the result is 403.

## Misc

### `GET /hejmdal/?token=`*token*`&id=`*id*

Redirection point for Hejmdal to call after successful user login.  The result is a cookie that tells the service that which user is logged in, and a rediction to `/`
