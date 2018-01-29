# Community Service data model

ContentFirst profile:

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
      [ { "title": "My List"
        , "description": "A brand new list"
        , "list":
        [ { "id": "98c5ff8c6e8f49978c857c23925dbe41"
          , "pid": "870970-basis-22629344"
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

becomes CommunityService records:

### Profile

    {
        id: 123,
        name: 'Ole Henriksen',
        attributes: {
            uuid: ....,
            cpr_hash: ....,
            user_id_hash: ...,
            unilogin_id_hash: ...,
            shortlist: [
                {pid: '870970-basis-53188931', origin: 'en-let-læst-bog'},
                {pid: '870970-basis-51752341', origin: 'bibliotikarens-ugentlige-anbefaling'}
            ],
            tastes: [{
                title: 'En tynd en',
                moods: ['frygtelig'],
                authors: ['Carsten Jensen'],
                genres: ['Skæbnefortællinger'],
                archetypes: ['Goth']
            }, {
                title: 'Ny profile',
                moods: ['dramatisk'],
                authors: ['Helge Sander'],
                genres: ['Skæbnefortællinger'],
                archetypes: ['Goth']
            }]
        }
    }

### Entities

    { 
        type: 'list',
        owner_id: 123,
        title: 'My list',
        contents: 'A brand new list',
        attributes: {
            uuid: '98c5ff8c6e8f49978c857c23925dbe41',
            public: false,
            list: [
                {pid: '870970-basis-22629344', description: 'Magic to the people'}
            ]
        }
    }
