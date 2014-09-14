# coding: utf-8
from lxml import etree
from lxml.builder import ElementMaker


def render_xml(video):
    e = ElementMaker()

    tree = e.fcpxml(
        {'version': '1.4'},
        e.resources(
            e.asset(id="r1", src="file:/Volumes/Media/MyVideo.mov"),
            e.format(id="r2", name="FFVideoFormat1080p30")
        ),
        e.library(
            e.event({'name': "MyEvent"},
                e.project({'name': 'MyProjct'},
                    e.sequence({'format': 'r2'},
                        e.spine(
                            e.video({'ref': 'r1', 'duration': '5s'},
                                e.audio(lane='-1', ref='r1', duration='5s')
                            )
                        )
                    )
                )
            )
        )
    )

    return etree.tostring(tree)
