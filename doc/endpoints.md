# Public service endpoints

The responses from the backend are either raw images or JSON loosely based on the [JSON-API](http://jsonapi.org/) specification, see [schemas used when testing](../src/fixtures/schemas/).

To only expose non-destructive endpoint to the public (ie. those needed by the [frontend](../src/client/)), the [backend](../src/server) sets an internal HTTP server up on an a non-public port in addtion to the port used for public access.

The internal endpoints are described in [internal-endpoints.md](internal-endpoints.md). This document describes the public endpoint.

## Books

### `GET /v1/book/`_pid_

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

### `GET /v1/books?pids=`_pid_,...,_pid_

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

### `GET /v1/image/`_pid_

The path must one that has been returned by a `/v1/book` or `/v1/books` request.

The result is an image file.

## Tags

### `GET /v1/tags/`_pid_

Returns a list of tag for a specific PID, like

    { "data":
      { "pid": '870970-basis:53187404'
      , "tags": [49, 55, 56, 90, 221, 223, 224, 230, 234, 281, 302, 313]
      }
    , "links":
      { "self": "/v1/tags/870970-basis:53187404"
      }
    }

### `GET /v1/tags/suggest/?q=...`

Returns a list of tags that contains q

    [
        {
            "id": 568,
            "title": "heste",
            "sort": 0,
            "parents": [
                "handling",
                "Handler om"
            ]
        }
    ]

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

### `GET /v1/taxonomy/`_tag_

Returns the second-level taxonomy under _tag_, like

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

Or returns the third-level taxonomy under _tag_, like

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
      { "openplatformId": "nCZVkYu9aYSg6Mlduhv4g7OaN0wnt8+f"
      , "openplatformToken": "d659925b4ae29696d7c395faef9d1d850c66519f"
      , "name": "Jens Godfredsen"
      , "roles": ["editor"]
      , "shortlist":
        [ { "pid": "870970-basis-22629344"
          , "origin": "en-let-læst-bog"
          }
        ]
      , "lists":
        [ { "data":
            { "type": "SYSTEM_LIST"
            , "created_epoch": 1515409049,
            , "modified_epoch": 1515409049,
            , "public": false,
            , "owner": "nCZVkYu9aYSg6Mlduhv4g7OaN0wnt8+f"
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
      , "image": "http://via.placeholder.com/256"
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

### `GET /v1/user/`_id_

Returns [public user information](../src/fixtures/schemas/public-user-data-out.json) for a user with the given ([UrlEncoded](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)) Openplatform ID, like

    { "data":
      { "openplatformId": "nCZVkYu9aYSg6Mlduhv4g7OaN0wnt8+f"
      , "name": "Jens Godfredsen"
      , "roles": ["editor"]
      , "lists":
        [ { "data":
            { "type": "SYSTEM_LIST"
            , "public": true
            , "created_epoch": 1515409049,
            , "modified_epoch": 1515409049,
            , "owner": "nCZVkYu9aYSg6Mlduhv4g7OaN0wnt8+f"
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
      }
    , "links":
      { "self": "/v1/user/nCZVkYu9aYSg6Mlduhv4g7OaN0wnt8%2Bf"
      , "image": "http://via.placeholder.com/256"
      }
    }

### `GET /v1/login`

If the user is already logged in (ie. a valid cookie is present in the request), the result is the same as for `GET /v1/user/`.

If there is no cookie or the cookie is invalid, then the web service will redirect to Adgangsplatform (Hejmdal) login page. On successful login, the service will redirect to endpoint defined by the [server constant `start`](../src/server/constants.js), which can then use `GET /v1/login` or `GET /v1/user`. On remote subsystem failure, the service will redirect to endpoint defined by the [server constant `generalError`](../src/server/constants.js).

### `POST /v1/logout`

Makes sure the current login cookie is invalidated. The result is a redirection to the logout endpoint in Adgangsplatform (Hejmdal). When the client redirects to Hejmdal, Hejmdal will remove its own tokens, and finally redirect back to the (client) endpoint defined by the [server constant `loggedOut`](../src/server/constants.js).

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

Updates the currently logged-in user's profiles. The [input](../src/server/schemas/profiles-in.json) is like

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

Updates the currently logged-in user's [shortlist](../src/server/schemas/shortlist-in.json). The input is like

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
          , "created_epoch": 1515409049,
          , "modified_epoch": 1515409049,
          , "public": true,
          , "owner": "nCZVkYu9aYSg6Mlduhv4g7OaN0wnt8+f"
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

### `GET /v1/lists/`_uuid_

Returns a specific [simple list](../src/fixtures/schemas/list-data-out.json) for the logged-in user, like

    { "data":
      { "type": "CUSTOM_LIST"
      , "created_epoch": 1515409049,
      , "modified_epoch": 1515409049,
      , "public": false
      , "owner": "nCZVkYu9aYSg6Mlduhv4g7OaN0wnt8+f"
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

Reserves an address for a new list for the currently logged-in user. Returns the location like:

    { "data": "/v1/lists/8f27e592174546518a6cc2449e126eff"
    , "links":
      { "self": "/v1/lists/8f27e592174546518a6cc2449e126eff"
      }
    }

If the user is not logged-in, the result is 403.

### `PUT /v1/lists/`_uuid_

Updates a specific list for the currently logged-in user. The [input](../src/server/schemas/list-in.json) is like

    { "type": "CUSTOM_LIST"
    , "created_epoch": 1515409049,
    , "modified_epoch": 1515409049,
    , "public": true,
    , "owner": "nCZVkYu9aYSg6Mlduhv4g7OaN0wnt8+f"
    , "title": "Must read"
    , "description": "Interesting books"
    , "list":
    [ { "pid": "870970-basis-51752341"
      , "description": "Exciting!"
      }
    ]

If the user is not logged-in, the result is 403.

### `DELETE /v1/lists/`_uuid_

Deletes a specific list for the currently logged-in user.

If the user is not logged-in, the result is 403.

### `GET /v1/public-lists?limit=`_number_`&offset=`_number_

Get the most recent public [lists](../src/fixtures/schemas/lists-data-out.json) from the community, like

    { "data":
      [ { "data":
          { "type": "SYSTEM_LIST"
          , "created_epoch": 1515409049,
          , "modified_epoch": 1515409049,
          , "public": true,
          , "owner": "nCZVkYu9aYSg6Mlduhv4g7OaN0wnt8+f"
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
      , { "data":
          { "type": "CUSTOM_LIST"
          , "created_epoch": 1515409049,
          , "modified_epoch": 1515409049,
          , "public": true
          , "owner": "nCZVkYu9aYSg6Mlduhv4g7OaN0wnt8+f"
          , "title": "Gamle Perler"
          , "description": "Bøger man simpelthen må læse",
          , "list":
            [ { "pid": "870970-basis-47573974"
              , "description": "Russisk forvekslingskomedie"
              }
            ]
          }
        , "links":
          { "self": "/v1/lists/fa4f3a3de3a34a188234ed298ecbe810"
          }
        }
      ]
    , "links":
      { "self": "/v1/lists/public-lists?limit=2&offset=0"
      , "next": "/v1/lists/public-lists?limit=2&offset=2"
      }
    }

If _offset_ is not present in the query, it defaults to 0. If _limit_ is not present in the query, it defaults to 10.

## Misc

### `GET /hejmdal/?token=`_token_`&id=`_id_

Redirection point for Hejmdal to call after successful user login. The result is a cookie that tells the service that which user is logged in, and a rediction to `/`

## Generic Objects

The generic object endpoint was added to facilitate

- writeable lists where everyone can add an element
- comments

but implemented in such a fashion that it can be used for adding other functionality later on.

----

It is essentially endpoints where you can push/retrieve arbitrary objects. Objects pushed to the endpoint can have certain special properties (partially inspired by couchdb):

- `_id` is the id of the object, which can be used to fetch/update the object. This is autogenerated by the endpoint, first time an object is stored.
- `_rev` is the revision / version of the object. This is updated everytime the object is updated. Useful for avoiding race condition through [compare and swap](https://en.wikipedia.org/wiki/Compare-and-swap). NB: the underlying community-service seems not to support atomic updates, so the race condition is still present, just reduced.
- `_type` the type of object needed when searching for objects
- `_owner` is openplatform-id of the creator of the object, - only the owner can update an object.
- `_key` is used for indexing/finding objects
- `_public` determines whether the object can be found / read by others than the owner.

Notice that the objects are schema-less, so the frontend consuming the objects, should be robust for incoming data.

----

Comment objects could be implemented by, giving them a comment `_type`, and having the `_key` equal to the id of the list, that the comments are about. Then comments to a certain list can be found through the `/find` endpoint.

Similarly entries for public writable lists can be implemented by having a list-entry `_type`, and the `_key` equal to the `_id` for the list, - and then the list entries can also be found using the `/find` endpoint. If the owner of the list wants to reorder, the list should contain an array of object-ids, that represents the ordering. Similarly if the owner wants to be able to delete elements from the list, this can be done with a blacklist of entries, which the find result can be filtered by.

The [integration test](../src/integration/v1-object_test.js) includes a sample usage flow, where you can see how the endpoint can be called.

### `POST /object` or `PUT /object/$id`

Stores an object in the community service. 

If no id is supplied, it creates a new object. If an id is supplied, it must exists, and the user must have write-permission to it.

If the supplied object has a `_rev` property, it will abort with a conflict, if it does not match the current revision of the document.

When creating a new object, the logged in user will become the owner of the object. Only owners, and admins can write to the objects.

Sample result:

```
{data: {"ok": true, "id": "8d7eee0d-1e9d-4f03-a2a8-2900fe9d252b", "rev": "79dc11d5-b61d4b43"}}
{data: {"error":"conflict"}, errors: [...]}
{data: {"error":"not found"}, errors: [...]}
{data: {"error":"forbidden"}, errors: [...]}

```

### `GET /object/$id`

Retrieves an object
Only readable by owner and admin unless the object has the property `{"_public": true}`.

The following properties is added to the object:

- `_id` object id
- `_rev` current revision
- `_owner` id of the object owner.
- `_created` time when created
- `_modified` time when most recently modified

### `GET /object/find?type=`_type_\[`&key=`_key_\]\[`&owner=`_owner_\]\[`&limit=`_limit_\]\[`&offset=`_offset_\]

Generic search. 
If no owner is specified, it only returns publicly readable objects.
If owner is specified, it shows private objects, if user is owner or admin. 

So for example, if we have a comment object:

```
{
    content: 'some text',
    about: '123',
    _type: 'comment',
    _key: '123',
    _public: true
}
```

It would be found by `GET /object/find?type=comment&key=123`.

### Performance notes

To make queries perform, there should be added an indices in the community service on

- `attributes.id`
- (`attributes.type`, `attributes.public`, `modified_epoch`)
- (`attributes.type`, `attributes.owner`)
- (`attributes.type`, `attributes.key`, `attributes.public`, `modified_epoch`)
