#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# read json lines with info from stdin
# write curl fetch lines to stdout

import json

import sys

def warn(*args):
    print(*args, file=sys.stderr)
    sys.stderr.flush()


if __name__ == "__main__":    
    IMAGEURL='image_detail_500'
    PID='pid'
    for line in sys.stdin:
        d = json.loads(line)
        assert(PID in d)
        pid = d[PID]
        if not IMAGEURL in d:
            warn("no image for", pid)
            continue
        url = d[IMAGEURL]
        print("curl '%s' > %s.jpg" % (url, pid))

    

