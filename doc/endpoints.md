# Service endpoints

The endopints are based on [initial analysis](content-first-backend.png).

## `GET /v1/recommendations?tag=`*metatag*`&`...`&tag=`*metatag*

Each metatag can be one of the tags defined in [Metakompasset](https://github.com/DBCDK/metakompasset).  The client must provide at least one metatag.

The result is a list of books as structure:

    [{pid: ...}, {pid: ...}, ...]

Each book has the following structure:

    { pid: '870970-basis:53188931'
    , pages: 123
    , published_year: 2013
    , published_month: 1,
    , published_day: 31,
    , cover: '/v1/image/12345-1'
    , loan_count: 98
    , inventory: 154
    , purchased: 165
    , title: 'En dag på bænken'
    , creator: 'Steen Stensen Sten'
    , description: 'Marius har aldrig været god i skolen eller på fodboldholdet.  Faktisk har han aldrig rigtig været god til noget.  Men i dag skal det ændre sig.'
    }

## `GET /v1/image/`*id*

The path must one that has been returned by a `/v1/recommendation` request.

The result is an image file.

