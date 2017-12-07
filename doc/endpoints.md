# Service endpoints

The responses from the backend are either raw images or JSON loosely based on the [JSON-API](http://jsonapi.org/) specification, see [schemas used when testing](../src/integration/schemas/).

To only expose non-destructive endpoint to the public (ie. those needed by the [frontend](../src/client/)), the [backend](../src/server) sets an internal HTTP server up on an a non-public port in addtion to the port used for public access.

## Books

### `GET /v1/book/`*pid*

Returns a [book structure](../src/integration/schemas/book-data-out.json), like

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

Results in a [list of books](../src/integration/schemas/books-data-out.json), each of the format as `GET /v1/book`, like

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

### `PUT /v1/book/`*pid*

The data must be [valid book input](../src/server/schemas/book-in.json), like

    { "pid": "870970-basis-53188931"
    , "unitId": "unit:22125672"
    , "workId": "work:20137979"
    , "bibliographicRecordId": "53188931"
    , "subject": "billedværker, humor, fotografier"
    , "genre": "humor"
    , "taxonomy_description": "Fotografier af havelåger sat sammen med korte tekster, der fantaserer over, hvem der mon bor inde bag lågerne"
    , "description": "Noget med låger"
    , "creator": "Jens Blendstrup"
    , "title": "Havelågebogen"
    , "titleFull": "Havelågebogen : trælåger, gitterlåger, fyldningslåger, jern- og smedejernslåger"
    , "dateFirstEdition": "2017"
    , "literaryForm": "digte, fiktion"
    , "type": "Bog"
    , "workType": "book"
    , "language": "Dansk"
    , "items": 196
    , "libraries": 80
    , "pages": 645
    , "image_detail": "https://moreinfo.addi.dk/2.9/more_info_get.php?lokalid=53188931&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=d2cc02a57d78c7015725"
    , "loans": 1020
    }

### `PUT /v1/books`

Replace all books.  The data must be a list of [valid book input](../src/server/schemas/book-in.json).  On success, the result is the total number of books in the list, like

    { "data": "216 books created"
    , "links": { "self": "/v1/books" }
    }

If unsuccessful, the previous books in the database are untouched.

## Images

### `GET /v1/image/`*pid*

The path must one that has been returned by a `/v1/book` or `/v1/books` request.

The result is an image file.

### `PUT /v1/image/`*pid*

The content-type must be `image/jpeg` or `image/png`.

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

### `PUT /v1/tags/`*pid*

Creates or overwrites tags for a PID.  The input is like

    {
      "pid": "870970-basis:52947804",
      "selected": ["44", "46", "49"]
    }

The result is like that of `GET /v1/tags/`*pid*.

### `POST /v1/tags`

Add tags for a PID.  The input is like

    { "pid": "870970-basis:52947804"
    , "selected": ["44", "46", "49"]
    }

The result is like that of `GET /v1/tags/`*pid*.

### `DELETE /v1/tags/`*pid*

Removes all tags for a specific PID.

### `PUT /v1/tags`

Replace all tags.  The data must be a list of [valid tag input](../src/server/schemas/tag-in.json).  On success, the result is the total number of books in the list, like

    { "data": "106 tas created"
    , "links": { "self": "/v1/tas" }
    }

If unsuccessful, the previous tags in the database are untouched.

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


### `PUT /v1/taxonomy`

The data must be [valid taxonomy](../src/server/schemas/taxonomy-in.json), like

    [ { "id": "0"
      , "title": "Stemning"
      , items:
        [ { "id": "1",
          , "title": "Optimistisk"
          , "items": [ { "id": "2", title: "Entusiastisk" } ]
          }
        ]
      }
    ]

Note that the ids are quoted.

## Users

### `GET /v1/user`

Returns [user information](../src/integration/schemas/user-data-out.json) for a logged-in user, like

    { "data":
      { "name": "Jens Godfredsen"
      , "shortlist":
        [ { "pid": "870970-basis-22629344"
          , "origin": "en-let-læst-bog"
          }
        ]
      , "lists":
        [ { "id": "98c5ff8c6e8f49978c857c23925dbe41"
          , "title": "My List"
          , "description": "A brand new list"
          , "list":
          [ { "pid": "870970-basis-22629344"
            , "description": "Magic to the people"
            }
          ] 
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
    , "lists":
      [ { "id": "98c5ff8c6e8f49978c857c23925dbe41"
        , "title": "My List"
        , "description": "A brand new list"
        , "list":
        [ { "pid": "870970-basis-22629344"
          , "description": "Magic to the people"
          }
        ] 
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

If there is no cookie or the cookie is invalid, then the web service will redirect to the Adgangsplatform (Hejmdal) login page.  On successful login, the service will redirect to `/`, which can then use `GET /v1/login` or `GET /v1/user`.  On remote subsystem failure, the service will refirect to `/general-error`.

### `POST /v1/logout`

Makes sure the current login cookie is invalidated.  The result is a redirection to the logout endpoint in Adgangsplatform (Hejmdal).  When the client redirects to Hejmdal, Hejmdal will remove its own tokens, and finally redirect back to the (client) endpoint defined by the [server constant `loggedOut`](../src/server/constants.js).

### `GET /v1/profiles`

Returns the currently logged-in user's [profiles](../src/integration/schemas/profiles-data-out.json), like

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

Returns the logged-in user's [shortlist](../src/integration/schemas/shortlist-data-out.json), like

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

Returns the logged-in user's [simple list](../src/integration/schemas/lists-data-out.json), like

    { "data":
      [ { "title": "My List"
        , "description": "A brand new list"
        , "list":
        [ { "pid": "870970-basis-22629344"
          , "description": "Magic to the people"
          }
        ] 
      ]
    , "links": 
      { "self": "/v1/lists"
      }
    }

If the user is not logged-in, the result is 403.

### `PUT /v1/lists`

Updates the currently logged-in user's shortlist.  The [input](../src/server/schemas/lists-in.json) is like

    [ { "title": "Must read"
      , "description": "Interesting books"
      , "list":
      [ { "pid": "870970-basis-51752341"
        , "description": "Exciting!"
        }
      ] 
    ]

If the user is not logged-in, the result is 403.

## Misc

### `GET /hejmdal/?token=`*token*`&id=`*id*

Redirection point for Hejmdal to call after successful user login.  The result is a cookie that tells the service that which user is logged in, and a rediction to `/`

# Command-line interaction

To upload a book:

    curl -X PUT -H "Content-Type: application/json" --data "@src/fixtures/min-oste-bog.json" http://localhost:3002/v1/book/12345-ost:98765

To upload a cover image:

    curl -X PUT -H "Content-Type: image/jpeg" --data-binary "@src/fixtures/12345-ost:98765.jpg" http://localhost:3002/v1/image/12345-ost:98765

### `GET /v1/stats`

Cleans up the database and returns statistics, like

    { "data":
      { "users":
        { "total": 225
        , "loged-in": 43
        }
      , "books":
        { "total": 345
        }
      , "tags":
        { "total": 52
        , "pids": 2
        , "min": 22
        , "max":30
        }
      }
    , "links":
      { "self": "/v1/stats"
      }
    }

