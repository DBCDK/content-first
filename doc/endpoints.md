# Service endpoints

The responses from the backend are either raw images or JSON loosely based on the [JSON-API](http://jsonapi.org/) specification, see [schemas used when testing](../src/integration/schemas/).

The endopints are based on [initial analysis](content-first-backend.png).

To only expose non-destructive endpoint to the public (ie. those needed by the [frontend](../src/client/)), the [backend](../src/server) sets an internal HTTP server up on an a non-public port in addtion to the port used for public access.

## Books

### `GET /v1/book/`*pid*

Returns a [book structure](../src/integration/schemas/book-data-out.json), like

    { "data":
      { "pid": "870970-basis:53188931"
      , "unit_id": "unit:22125672"
      , "work_id": "work:20137979"
      , "bibliographic_record_id": "53188931"
      , "creator": "Jens Blendstrup"
      , "title": "Havelågebogen"
      , "title_full": "Havelågebogen : trælåger, gitterlåger, fyldningslåger, jern- og smedejernslåger"
      , "description": "Ingen beskrivelse"
      , "pages": 645
      , "published_year": 2017
      , "published_month": 2
      , "published_day": 3
      , "loan_count": 1020
      , "type": "Bog"
      , "work_type": "book"
      , "language": "Dansk"
      , "items": 196
      , "libraries": 80
      }
    , "links":
      { "self": "/v1/book/870970-basis:53188931"
      , "cover": "/v1/image/870970-basis:53188931"
      }
    }

### `GET /v1/books?pids=`*pid*,...,*pid*

Results in a [list of books](../src/integration/schemas/books-data-out.json), each of the format as `GET /v1/book`, like

    { "data":
      [ { "book":
          { "pid": "870970-basis:53188931"
          , "title": "Havelågebogen"
          , "...": "..."
          }
        , "links":
          { "self": "/v1/book/870970-basis:53188931"
          , "cover": "/v1/image/870970-basis:53188931"
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
      { "self": "/v1/books?pids=870970-basis:53188931,870970-basis:22629344"
      }
    }

### `PUT /v1/book/`*pid*

The data must be [valid book input](../src/server/schemas/book-in.json), like

    { "pid": "870970-basis:53188931"
    , "unitId": "unit:22125672"
    , "workId": "work:20137979"
    , "bibliographicRecordId": "53188931"
    , "creator": "Jens Blendstrup"
    , "title": "Havelågebogen"
    , "titleFull": "Havelågebogen : trælåger, gitterlåger, fyldningslåger, jern- og smedejernslåger"
    , "type": "Bog"
    , "workType": "book"
    , "language": "Dansk"
    , "items": 196
    , "libraries": 80
    , "pages": 645
    , "image_detail": "https://moreinfo.addi.dk/2.9/more_info_get.php?lokalid=53188931&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=d2cc02a57d78c7015725"
    , "loancount": 1020
    }

## Images

### `GET /v1/image/`*pid*

The path must one that has been returned by a `/v1/book` or `/v1/books` request.

The result is an image file.

### `PUT /v1/image/`*pid*

The content-type must be `image/jpeg` or `image/png`.

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

    {
      "pid": "870970-basis:52947804",
      "selected": ["44", "46", "49"]
    }

The result is like that of `GET /v1/tags/`*pid*.

### `DELETE /v1/tags/`*pid*

Removes all tags for a specific PID.

## Recommendations

### `GET /v1/recommendations?tag=`*metatag*`&`...`&tag=`*metatag*

Each metatag must be a number defined by [Metakompasset](https://github.com/DBCDK/metakompasset).  The client must provide at least one metatag.

The result is a list of books such that each book include all the specified tags.

# Command-line interaction

To upload a book:

    curl -X PUT -H "Content-Type: application/json" --data "@src/fixtures/min-oste-bog.json" http://localhost:3002/v1/book/12345-ost:98765

To upload a cover image:

    curl -X PUT -H "Content-Type: image/jpeg" --data-binary "@src/fixtures/12345-ost:98765.jpg" http://localhost:3002/v1/image/12345-ost:98765

