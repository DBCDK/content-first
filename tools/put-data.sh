#!/bin/sh -e

put()
{
  DATA_FILE=$1
  ENDPOINT=$2

  curl --fail -X PUT -H "Content-Type: application/json" --data "@$DATA_FILE" "$ENDPOINT" > /dev/null
  echo "injected $DATA_FILE to $ENDPOINT"
}

HOST=$1
SCRIPT_PATH="`dirname \"$0\"`"
DATA_PATH="$SCRIPT_PATH/../src/client/data"

echo "Begin injection of data to $HOST"

put "$DATA_PATH/exportTaxonomy.json" "$HOST/v1/taxonomy"
put "$DATA_PATH/pidinfo.json" "$HOST/v1/books"
put "$DATA_PATH/exportTags.json" "$HOST/v1/tags"

echo "Sucessfully injected all data to $HOST"
