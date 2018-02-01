# Internal service endpoints

The responses from the backend are either raw images or JSON loosely based on the [JSON-API](http://jsonapi.org/) specification, see [schemas used when testing](../src/fixtures/schemas/).

This document describes the internal endpoint.  The public endpoints are described in [endpoints.md](endpoints.md).

## Books

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

### `PUT /v1/image/`*pid*

The content-type must be `image/jpeg` or `image/png`.

## Tags

### `PUT /v1/tags/`*pid*

Creates or overwrites tags for a PID.  The input is like

    { "pid": "870970-basis:52947804",
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
    , "links": { "self": "/v1/tags" }
    }

If unsuccessful, the previous tags in the database are untouched.

## Taxonomy

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

### `POST /v1/role-add`

Add a role to the existing set of user roles.  The data must be [valid role data](../src/server/schemas/role-in.json), like

    { "openplatformId": "nCZVkYu9aYSg6Mlduhv4g7OaN0wnt8+f"
    , "role": "editor"
    }

Success returns 200, including adding an already-present role.

### `POST /v1/role-remove`

Removes a role from the existing set of user roles.  The data must be [valid role data](../src/server/schemas/role-in.json), like

    { "openplatformId": "nCZVkYu9aYSg6Mlduhv4g7OaN0wnt8+f"
    , "role": "editor"
    }

Success returns 200, including removing an non-present role.

## Misc

### `GET /v1/stats`

Returns statistics, like

    { "data":
      { "users":
        { "logged-in": 43
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

As a side-effect, the backend might clean up the database.

# Command-line interaction

To upload a book:

    curl -X PUT -H "Content-Type: application/json" --data "@src/fixtures/min-oste-bog.json" http://localhost:3002/v1/book/12345-ost:98765

To upload a cover image:

    curl -X PUT -H "Content-Type: image/jpeg" --data-binary "@src/fixtures/12345-ost:98765.jpg" http://localhost:3002/v1/image/12345-ost:98765

