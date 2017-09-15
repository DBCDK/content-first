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
    #IMAGEURLS=['image_detail_500', 'image_full']
    IMAGEURL='image_detail_500'
    PID='pid'
    no_image = 0
    for line in sys.stdin:
        d = json.loads(line)
        assert(PID in d)
        pid = d[PID]
        if not IMAGEURL in d:
            creator = "?"
            if 'creator' in d:
                creator = str(d['creator'])
            title = "?"
            if 'title' in d:
                title = str(d['title'])
            warn("no image for", pid, creator, title)
            #warn([k for k in d.keys() if k.find('image') != -1])
            no_image+=1
            continue
        url = d[IMAGEURL]
        print("curl '%s' > %s.jpg" % (url, pid))
        filename = "%s.jpg" % (pid)
        baseurl = "http://content-first-i01.dbc.dk:8000/"
        url = "%sv1/image/%s" % (baseurl, pid)
        s = """curl -X PUT -H 'Content-Type: image/jpeg' --data-binary '@%s' '%s' """ % (filename, url)
        print(s)
    warn("no image on", no_image)
    

