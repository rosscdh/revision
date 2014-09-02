Re>ision
=======

Video commenting and collaboration platform, sync with dropbox/box etc


Development
===========

Standard django workflow, using django 1.7(rc2)

```
Dev
Write tests
Deploy
```


Setup
-----

1. install requirements - pip install -r requirements/dev.txt
2. fab rebuild_local
3. http://localhost:8000/


Manual Setup
------------

1. install requirements - pip install -r requirements/dev.txt
2. ./manage.py syncdb
3. ./manage.py migrate
4. ./manage.py loaddata sites subscribe
5. http://localhost:8000/

Design Evolutions
-----------------

```
/p/my-cool-project/
```

Features
--------

1. connect with box/dropbox - python-social-auth
2. activity.html - searchable html file with all comments and links to all revisions of videos for easy use and reference
3. FCP.xml - final cut pro export that has the comments and even subtitles specified and able to be imported
4. revisions of videos
5. invite collaborators - unique uuid urls
6. ...
