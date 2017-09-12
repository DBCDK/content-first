# Service endpoints

The responses from the backend are either raw images or JSON loosely based on the [JSON-API](http://jsonapi.org/) specification, see [schemas used when testing](../src/integration/schemas/).

The endopints are based on [initial analysis](content-first-backend.png).

## `GET /v1/book/`*pid*

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

## `GET /v1/books?pids=`*pid*,...,*pid*

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

## `PUT /v1/book/`*pid*

The data must be [valid book input](../src/server/schemas/book-in.json), like

    { "pid": "870970-basis:53188931"
    , "unitId": "unit:22125672"
    , "workId": "work:20137979"
    , "bibliographicRecordId": 53188931
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

## `GET /v1/image/`*pid*

The path must one that has been returned by a `/v1/book` or `/v1/books` request.

The result is an image file.

## `PUT /v1/image/`*pid*

The content-type must be `image/jpeg` or `image/png`.

## `GET /v1/recommendations?tag=`*metatag*`&`...`&tag=`*metatag*

*Not implemented yet*

Each metatag can be one of the tags defined in [Metakompasset](https://github.com/DBCDK/metakompasset).  The client must provide at least one metatag.

