#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# read json lines with info from stdin
# write curl fetch lines to stdout

import json

import sys
import os

def warn(*args):
    print(*args, file=sys.stderr)
    sys.stderr.flush()

def printer(filehandle):
    def printtofilehandle(*args):
        print(*args, file=filehandle)
    return printtofilehandle


example = { "pid": "870970-basis:53188931"
, "unitId": "unit:22125672"
, "workId": "work:20137979"
, "bibliographicRecordId": "53188931"
, "creator": "Jens Blendstrup"
, "title": "Havelågebogen"
, "titleFull": "Havelågebogen : trælåger, gitterlåger, fyldningslåger, jern- og smedejernslåger"
, "type": "Bog"
, "workType": "book"
, "language": "Dansk"
, "items": 196
, "libraries": 80
, "pages": 645
, "image_detail": "https://moreinfo.addi.dk/2.9/more_info_get.php?lokalid=53188931&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=d2cc02a57d78c7015725"
, "loancount": 1020
}

def read_descriptions(filename):
    with open(filename) as f:
        d = json.load(f)
    return d


if __name__ == "__main__":
    #print(list(example.keys()))
    #exit(0)
    assert(os.environ["CONTENTFIRST_BASEURL"])
    CONTENTFIRST_BASEURL = os.environ["CONTENTFIRST_BASEURL"]

    desc = read_descriptions("fulldescriptions.json")

    for line in sys.stdin:
        src = json.loads(line)
        dst = {}
        if "loans" in src:
            dst['loancount'] = int(src['loans'])
        else:
            dst['loancount'] = 0
            warn("NO LOANS, setting to 0")
        dst['image_detail'] = ""
        pid = src["pid"]
        if pid in desc:
            dst['description'] = desc[pid]
        else:
            dst['description'] = "? ? ?"
        #dst['image_detail'] = ""
                #dst['image_detail'] = ""
        for key in ['items', 'pages', 'libraries']:
            if key in src:
                dst[key] = src[key]
            else:
                dst[key] = 0
        for key in ['title', 'creator', 'type', 'language', 'bibliographicRecordId', 'workType', 'unitId', 'titleFull', 'pid', 'workId']:
            if key in src:
                dst[key] = src[key]
            else:
                dst[key] = ""

        pid = dst['pid']
        filename = "%s.json" %(pid)
        f = open(filename, 'w')
        PP = printer(f)
        PP(json.dumps(dst))
        url = "%sv1/book/%s" % (CONTENTFIRST_BASEURL, pid)
        s = """curl -X PUT -H 'Content-Type: application/json' --data '@%s' '%s' || (echo ERROR && exit 1)""" % (filename, url)
        print(s)

