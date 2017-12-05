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
