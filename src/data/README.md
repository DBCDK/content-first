Files in this folder are used to populate content-first with data. Some of the files are even required at build time to build the client application.

Required files:

- exportTags.json
- exportTaxonomy.json (required at build time)
- librarian-recommends.json (required at build time)
- pidinfo.json

Optional files:

- {pid}.jpg (may be used to upload covers which are not available from metakompasset)

Example files can be found here: [src/data/examples](https://github.com/DBCDK/content-first/tree/refactor-data-folder/src/data/examples)

When content-first is running, data files may be injected by doing:

- Make sure a content-first instance is running
- Go to [the tools folder][src/data/examples](https://github.com/DBCDK/content-first/tree/refactor-data-folder/tools)
- Install dependencies, if not already done: "npm i"
- Run the script: "npm run fetch-inject-metakompas"
