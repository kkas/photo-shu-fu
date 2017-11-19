import logging

from sqlalchemy import Table, Column, Integer, String
from sqlalchemy.dialects.postgresql import TEXT
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.exc import SQLAlchemyError

from models import metadata, engine
from models import Session

base = declarative_base()

gen_log = logging.getLogger("tornado.general")

class Picture(base):
    """
    Pictures Table Definitions
    """
    __tablename__ = 'pictures'
    id = Column(Integer, primary_key=True)
    uuid = Column(String, nullable=False)
    data = Column(TEXT)

    def __repr__(self):
        return "<Picture(uuid='{0}', data='{1}')>".format(self.uuid, self.data)

    def to_json(self):
        return {
            "id": self.id,
            "uuid": self.uuid,
            "data": self.data,
        }

    def insert(self):
        session = Session()
        try:
            session.add(self)
            session.commit()
        except SQLAlchemyError as e:
            print(e)
        finally:
            session.close()

    @staticmethod
    def find_by_pic_id(pic_id):
        session = Session()
        row = session.query(Picture).filter(Picture.uuid == pic_id).first()
        return row

base.metadata.create_all(engine)