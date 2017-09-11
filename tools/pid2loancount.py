#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# read jsonlines with pids from stdin
# write jsonlines with loancounts added to stdout
# written to run on xp-build-i01 (collections currently lives there)

import pymongo
import json
from collections import defaultdict
from collections import namedtuple
import pandas as pd
import time
import random

import sys

def warn(*args):
    print(*args, file=sys.stderr)
    sys.stderr.flush()


def get_collections(db):
    client = pymongo.MongoClient("localhost", 27017)   
    popids = client[db].pid_to_popid
    users = client[db].popid_to_users
    return popids, users

not_in_popid_count = 0
not_in_users_count = 0

def pid2loancount(pid, popids, users):
    global not_in_popid_count
    global not_in_users_count
    e = popids.find_one(pid)
    if e:
        popid = e['popid']
        ee = users.find_one(popid)
        if ee:
            loancount = len(ee['users'])
            return loancount
        else:
            not_in_popid_count+=1
            warn("not in users col:", pid, popid)
    else:
        not_in_users_count+=1
        warn("not in popid col:", pid)
    return None
        
if __name__ == "__main__":    
    popids, users = get_collections("cisterne")
    PID = 'pid'
    count = 0
    for line in sys.stdin:
        count+=1
        d = json.loads(line)
        assert(PID in d)
        pid = d[PID]
        d['loancount'] = pid2loancount(pid, popids, users)
        print(json.dumps(d))
    warn("total:", count)
    warn("not in popid:", not_in_popid_count)
    warn("not in users:", not_in_users_count)

    

