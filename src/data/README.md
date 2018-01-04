Files in this folder is used to populate content-first with data. Some of the files are even required at build time to build the client application.

Required files:
- exportTags.json
- exportTaxonomy.json
- librarian-recommends.json
- pidinfo.json
- ranked-profiles.json
- similar-pids.json

Optional files:
 - {pid}.jpg (may be used to upload covers which are not available from metakompasset)

Example files can be found here: [src/data/examples](https://github.com/DBCDK/content-first/tree/refactor-data-folder/src/data/examples)

When content-first is running, data files may be injected by running "npm run inject-metakompas"
