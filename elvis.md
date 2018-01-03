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


- [x] Create Profile (with tastes & shortlist) in Elvis after login (and for test).
- [x] Create list Entity.

The algorithm for an update from a PUT from the ContentFirst frontend is like this:
- [x] Prepare the (user) Profile update and the Entities representing the lists provided by the frontend.
- [x] Use the login token to find the user `uuid` in the `cookies` table.
- [x] Use Community connector to get the user id in the community service.
- [x] Update the user Profile with shortlist and tastes through the Community connector.
- [x] Find all list-Entities that are owned by the user.
- [x] Divide the update lists into those that match an existing community Entity UUID, and those that do not.
- [x] For each Entity: overwrite the entity with the frontend-provided for a matching UUID; if no UUID matches, delete the Entity.
- [x] Create new Entities for all remaining not-matched lists.
- [ ] Document Elvis data model (user_id, type:list, etc).

Later:
- Community Query error => "details", but Profile error => "detail" ?
- Create a general purpose class for dump-logs-after-test-error, see `afterEach` in `login-hejmdal_test`.
- Include number-of-users in /stats.

Elvis:
- "Total" from lists queries seem to return the id of the first element in the list?
- Queries on wrong community still returns the number of matches in another community.
- GET /v1/community/6afe528 will give the same result as /v1/community/6 !
