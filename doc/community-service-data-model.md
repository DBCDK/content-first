# Community Service data model

ContentFirst profile:

    { "openplatformId": "nCZVkYu9aYSg6Mlduhv4g7OaN0wnt8+f"
    , "openplatformToken": "d659925b4ae29696d7c395faef9d1d850c66519f"
    , "name": "Jens Godfredsen"
    , "roles": ["editor"]
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
        openplatform_id: 'nCZVkYu9aYSg6Mlduhv4g7OaN0wnt8+f',
        openplatform_token: 'd659925b4ae29696d7c395faef9d1d850c66519f',
        roles: ['editor'],
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
      id: 6543,
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
