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

1. Create a new virtualenv: `mkvirtualenv revision`
2. Install local requirements: `pip install -r requirements/local.txt`
3. Create .env file: `cp .env.example .env`
4. Bootstrap project: `make bootstrap`
5. Start dev server: `honcho start`
6. Open a browser to [http://localhost:8000/](http://localhost:8000/)


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
6. keyboard shortcuts http://craig.is/killing/mice


Phases
------

**Phase 1:**

As a videographer
I want the ability to upload/refer to revisions of my project
and invite my client and perhaps thrd-parties to review each revision
and give feedback via comments

As a videographer
I want the ability to add subtitles to each video

As a videographer and client
I want the ability to add sketches to a video to allow easier illustration of
my concept

As a videographer
I want the ability to export comments and subtitles out as FCP xml
along with timing settings (show subtitle from this point to this point)


As a videographer
I want the ability to add effect notation as FCP xml
i.e. add fade in and fade outs over time


**Phase 2:**

As an anonymous user
I want the ability to refer to a facebook.youtube.vimeo video
and allow public or invite only comments on that video


