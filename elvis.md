# Plan

- kill table `users`, move everything to Elvis.
- More strict types for appropriate columns.

```
contentfirst=# \d+ users
                                            Table "public.users"
  Column   |          Type          |           Modifiers           | Storage  | Stats target | Description 
-----------+------------------------+-------------------------------+----------+--------------+-------------
 uuid      | character varying(255) | not null                      | extended |              | 
 name      | character varying(255) | default ''::character varying | extended |              | 
 cpr       | character varying(255) | default ''::character varying | extended |              | 
 user_id   | character varying(255) | default ''::character varying | extended |              | 
 profiles  | jsonb                  | not null default '[]'::jsonb  | extended |              | 
 shortlist | jsonb                  | not null default '[]'::jsonb  | extended |              | 
 lists     | jsonb                  | not null default '[]'::jsonb  | extended |              | 
Indexes:
    "users_pkey" PRIMARY KEY, btree (uuid)
Referenced by:
    TABLE "cookies" CONSTRAINT "cookies_user_foreign" FOREIGN KEY ("user") REFERENCES users(uuid)

contentfirst=# \d+ cookies
                                    Table "public.cookies"
     Column      |          Type          | Modifiers | Storage  | Stats target | Description 
-----------------+------------------------+-----------+----------+--------------+-------------
 uuid            | character varying(255) | not null  | extended |              | 
 user            | character varying(255) | not null  | extended |              | 
 expires_epoch_s | integer                | not null  | plain    |              | 
Indexes:
    "cookies_pkey" PRIMARY KEY, btree (uuid)
Foreign-key constraints:
    "cookies_user_foreign" FOREIGN KEY ("user") REFERENCES users(uuid)

```


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

becomes CommunityService records:

### Profile

    {
        id: 123,
        name: 'Ole Henriksen',
        attributes: {
            cpr: ....,
            user_id: ...,
            unilogin_id: ...,
        }
    }

### Entities

    {
        type: 'shortlist',
        owner_id: 123,
        title: '',
        contents: ''
        attributes: {
            public: false,
            list: [
                {pid: '870970-basis-53188931', origin: 'en-let-læst-bog'},
                {pid: '870970-basis-51752341', origin: 'bibliotikarens-ugentlige-anbefaling'}
            ]
        }
    }

    { 
        type: 'simple-list',
        owner_id: 123,
        title: 'My list',
        contents: 'A brand new list',
        attributes: {
            public: false,
            list: [
                {pid: '870970-basis-22629344', description: 'Magic to the people'}
            ]
        }
    }

    {
        type: 'taste-profile',
        owner_id: 123,
        title: 'En tynd en',
        constents: '',
        attributes: {
            moods: ['frygtelig'],
            authors: ['Carsten Jensen'],
            genres: ['Skæbnefortællinger'],
            archetypes: ['Goth']
        }
    }

    {
        type: 'taste-profile',
        owner_id: 123,
        title: 'Ny profile',
        constents: '',
        attributes: {
            moods: ['dramatisk'],
            authors: ['Helge Sander'],
            genres: ['Skæbnefortællinger'],
            archetypes: ['Goth']
        }
    }

The algorithm for an update from a PUT from the ContentFirst frontend is like this:
- Prepare the (user) Profile update and the Entities representing all the lists and taste profiles PUT by the frontend.
- Use the login token to find the `uuid` in the `cookies` table.
- Use Community connector to get the user id in the community service.
- Update the shortlist through the Community connector.
- Hmm we need UUIDs on the lists etc. 
















