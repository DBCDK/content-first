# Content First database model

## Books

                                             Table "public.books"
             Column          |          Type          | Modifiers | Storage  | Stats target | Description 
    -------------------------+------------------------+-----------+----------+--------------+-------------
     pid                     | character varying(255) | not null  | extended |              | 
     unit_id                 | character varying(255) |           | extended |              | 
     work_id                 | character varying(255) |           | extended |              | 
     bibliographic_record_id | integer                |           | plain    |              | 
     creator                 | character varying(255) |           | extended |              | 
     title                   | character varying(255) |           | extended |              | 
     title_full              | character varying(255) |           | extended |              | 
     pages                   | integer                |           | plain    |              | 
     type                    | character varying(255) |           | extended |              | 
     work_type               | character varying(255) |           | extended |              | 
     language                | character varying(255) |           | extended |              | 
     items                   | integer                |           | plain    |              | 
     libraries               | integer                |           | plain    |              | 
     subject                 | character varying(255) |           | extended |              | 
     genre                   | character varying(255) |           | extended |              | 
     first_edition_year      | integer                | default 0 | plain    |              | 
     literary_form           | character varying(255) |           | extended |              | 
     taxonomy_description    | text                   |           | extended |              | 
     description             | text                   |           | extended |              | 
     loans                   | integer                |           | plain    |              | 
    Indexes:
        "books_pkey" PRIMARY KEY, btree (pid)



## Cookies

                                          Table "public.cookies"
            Column        |          Type          | Modifiers | Storage  | Stats target | Description 
    ----------------------+------------------------+-----------+----------+--------------+-------------
     cookie               | character varying(255) | not null  | extended |              | 
     community_profile_id | integer                | not null  | plain    |              | 
     expires_epoch_s      | integer                | not null  | plain    |              | 
    Indexes:
        "cookies_pkey" PRIMARY KEY, btree (cookie)

## Covers

                                    Table "public.covers"
     Column |          Type          | Modifiers | Storage  | Stats target | Description 
    --------+------------------------+-----------+----------+--------------+-------------
     pid    | character varying(255) | not null  | extended |              | 
     image  | bytea                  |           | extended |              | 
    Indexes:
        "covers_pkey" PRIMARY KEY, btree (pid)

## Lists

                                   Table "public.lists"
            Column        |  Type   | Modifiers | Storage | Stats target | Description 
    ----------------------+---------+-----------+---------+--------------+-------------
     uuid                 | uuid    | not null  | plain   |              | 
     community_profile_id | integer | not null  | plain   |              | 
     community_entity_id  | integer |           | plain   |              | 
    Indexes:
        "lists_pkey" PRIMARY KEY, btree (uuid)


## Tags

                                     Table "public.tags"
     Column |          Type          | Modifiers | Storage  | Stats target | Description 
    --------+------------------------+-----------+----------+--------------+-------------
     pid    | character varying(255) |           | extended |              | 
     tag    | integer                |           | plain    |              | 
    Indexes:
        "tags_pid_tag_unique" UNIQUE CONSTRAINT, btree (pid, tag)

## Taxonomy

                               Table "public.taxonomy_bottom"
     Column |          Type          | Modifiers | Storage  | Stats target | Description 
    --------+------------------------+-----------+----------+--------------+-------------
     id     | integer                | not null  | plain    |              | 
     middle | integer                | not null  | plain    |              | 
     title  | character varying(255) | not null  | extended |              | 
    Indexes:
        "taxonomy_bottom_pkey" PRIMARY KEY, btree (id)
    Foreign-key constraints:
        "taxonomy_bottom_middle_foreign" FOREIGN KEY (middle) REFERENCES taxonomy_middle(id)

                               Table "public.taxonomy_middle"
     Column |          Type          | Modifiers | Storage  | Stats target | Description 
    --------+------------------------+-----------+----------+--------------+-------------
     id     | integer                | not null  | plain    |              | 
     top    | integer                | not null  | plain    |              | 
     title  | character varying(255) | not null  | extended |              | 
    Indexes:
        "taxonomy_middle_pkey" PRIMARY KEY, btree (id)
    Foreign-key constraints:
        "taxonomy_middle_top_foreign" FOREIGN KEY (top) REFERENCES taxonomy_top(id)
    Referenced by:
        TABLE "taxonomy_bottom" CONSTRAINT "taxonomy_bottom_middle_foreign" FOREIGN KEY (middle) REFERENCES taxonomy_middle(id)

                                 Table "public.taxonomy_top"
     Column |          Type          | Modifiers | Storage  | Stats target | Description 
    --------+------------------------+-----------+----------+--------------+-------------
     id     | integer                | not null  | plain    |              | 
     title  | character varying(255) | not null  | extended |              | 
    Indexes:
        "taxonomy_top_pkey" PRIMARY KEY, btree (id)
    Referenced by:
        TABLE "taxonomy_middle" CONSTRAINT "taxonomy_middle_top_foreign" FOREIGN KEY (top) REFERENCES taxonomy_top(id)






