import os
from urllib.parse import urlparse

from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker

import logging
gen_log = logging.getLogger("tornado.general")


# an Engine, which the Session will use for connection
# resources
# engine = create_engine("postgresql://kentakikui@localhost:5432/testdb")
# engine = create_engine("postgresql+psycopg2://kentakikui@localhost:5432/testdb")

pg_url = os.environ.get('DATABASE_URL')
url = urlparse(pg_url)

engine = create_engine(
    "{dialect}+{driver}://{user}:{password}@{host}:{port}/{database}".format(**{
        'dialect': "postgresql",
        'driver': "psycopg2",
        'user': url.username,
        'password': url.password,
        'host': url.hostname,
        'port': url.port,
        'database': url.path[1:]
    })
)

metadata = MetaData()
metadata.bind = engine

# create a configured "Session" class
# Whenever we need a session, this Session should be used.
Session = sessionmaker(bind=engine)