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


if __name__ == "__main__":    
    assert(os.environ["CONTENTFIRST_BASEURL"])
    CONTENTFIRST_BASEURL = os.environ["CONTENTFIRST_BASEURL"]

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
        jpgfile = "/tmp/%s.jpg" % (pid)
        print("curl '%s' > '%s'" % (url, jpgfile))
        url = "%sv1/image/%s" % (CONTENTFIRST_BASEURL, pid)
        s = """curl -X PUT -H 'Content-Type: image/jpeg' --data-binary '@%s' '%s' """ % (jpgfile, url)
        print(s)
    warn("no image on", no_image)
    

