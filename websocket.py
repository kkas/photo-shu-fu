#!/bin/env python
# -*- coding: utf-8 -*-
import time

import tornado.ioloop
import tornado.options
import tornado.web
import tornado.websocket
import tornado.log

import logging
import os
import redis
from urllib.parse import urlparse
import json
import uuid
import re
import threading

from models.picture import Picture

from tornado.ioloop import PeriodicCallback

from tornado.options import define, options, parse_command_line

gen_log = logging.getLogger("tornado.general")

redis_url = os.environ.get('REDISCLOUD_URL')
url = urlparse(redis_url)

gen_log.error("url_redis: %s", url)

r = redis.Redis(host=url.hostname, port=url.port, password=url.password)


class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")


class RegisterPictureHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("registerPicture.html")


class PictureHandler(tornado.web.RequestHandler):
    """
    This is an API point that stores and retrieves an image uploaded by a client.
    """
    def get(self, slug=None):
        pass

    def get(self, pic_id):
        gen_log.error("pic_id: {0}".format(pic_id))
        picture = Picture.find_by_pic_id(pic_id)
        self.finish(picture.data)

    def post(self):
        print ("SavePictureHandler.post called")

        picture = self._extract_picture()

        # Store the picture sent from a client with a pic_id.
        pic_id = PictureHandler._gen_uuid()
        self._store_image(picture, pic_id)

        # Response
        response = PictureHandler._assemble_response(pic_id)

        r.publish("new_arrival", json.dumps(response))

        self.write(json.dumps(response, separators=(', ', ': ')))
        self.finish()
        print("SavePictureHandler finished")

    @classmethod
    def _assemble_response(cls, pic_id):
        return {'status': "OK", 'id': pic_id}

    @classmethod
    def _gen_uuid(cls):
        return uuid.uuid4().hex

    def _extract_picture(self):
        print("SavePictureHandler._exract_picture called")

        json_data = json.loads(self.request.body)

        return json_data.get('data')

    def _store_image(self, picture, pic_id):
        """
        Store an image with an associated pic_id into the storage.
        :param picture: that is sent from a user.
        :param pic_id: is that newly generated for the image.
        :return: None
        """
        # Store the picture in a database
        pic = Picture(uuid=pic_id, data=picture)
        pic.insert()

        return None


class RedisClient(threading.Thread):
    def __init__(self, r):
        threading.Thread.__init__(self, daemon=True)
        self.redis = r
        self.pubsub = self.redis.pubsub()
        self.pubsub.subscribe(["new_arrival"])

    def go(self, msg):
        gen_log.error("RedisClient.go() called.")
        if msg["type"] == "message":
            gen_log.error("msg: {0}".format(msg["data"]))
            WebSocketServer.send_notification(msg["data"])

    def run(self):
        for msg in self.pubsub.listen():
            if msg["data"] == "KILL":
                self.pubsub.unsubscribe()
            else:
                self.go(msg)


# All the web socket clients' connections will be sotered in here.
WS_CLIENTS = []

class WebSocketServer(tornado.websocket.WebSocketHandler):

    client = RedisClient(r)
    client.start()

    #TODO: Remove this at production
    def check_origin(self, origin):
        return True

    # Called when a new connection is opened.
    # Assuming that the client is always the screen app.
    def open(self):
        gen_log.error("connected:: %s", self)
        WS_CLIENTS.append(self)
        # self.write_message("REGISTERED.")

    def on_message(self, message):
        """
        Called when a new message from a client is received.
        :param message: that is sent by one of the clients.
        :return: None
        """
        # # If the massage is for the screen application to be distinguished.
        # if re.match(self._SCREEN_APP, message):
        #     gen_log.error("_SCREEN_APP detected")
        #     gen_log.error("self: %s", self)
        #     self._screen_app_ws_conn[self._SCREEN_APP] = self
        #     pass

        # Send the message only to the screen application.
        # if self._screen_app_ws_conn[self._SCREEN_APP]:
        #     self._screen_app_ws_conn[self._SCREEN_APP].write_message(message)
        pass

    @classmethod
    def send_notification(cls, data):
        gen_log.error("WS_CLIENTS: {0}".format(WS_CLIENTS))
        WS_CLIENTS[0].write_message(data)
        pass

    # Called when a connection is closed.
    def on_close(self):
        # self._ws_clients.remove(self)
        WS_CLIENTS.remove(self)
        print ("WebSocket closed")


settings = {
    "static_path": os.path.join(os.path.dirname(__file__), "."),
    "autoreload": True,
    "debug": True,
}

app = tornado.web.Application([
    (r"/", IndexHandler),
    (r"/ws", WebSocketServer),
    (r"/register", RegisterPictureHandler),
    (r"/picture/(?P<pic_id>\w+)", PictureHandler),
    (r"/picture", PictureHandler),
    (r"/static/.*", tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
], **settings)


def main():
    try:
        tornado.options.parse_command_line()
    except KeyboardInterrupt:
        gen_log.info("Exit")


if __name__ == "__main__":
    gen_log.error("main called.")

    # This is mostly for Heroku integration.
    port = int(os.environ.get("PORT", 8888))

    app.listen(port)

    tornado.ioloop.IOLoop.instance().start()
