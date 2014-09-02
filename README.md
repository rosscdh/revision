Nootroo
=======

Nootroo website, get you some good stuff


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
