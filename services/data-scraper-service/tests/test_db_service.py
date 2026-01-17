from datetime import datetime

import pytest
from app.models.articles import ArticleDB
from app.schemas.articles import ArticleCreate
from app.services.db_service import DatabaseService
from sqlalchemy import create_engine
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.orm import sessionmaker


# --- SQQLITE JSONB FIX ---
@compiles(JSONB, "sqlite")
def compile_jsonb_sqlite(type_, compiler, **kw):
    return "JSON"


# --- FIXTURES ---
@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")

    ArticleDB.metadata.create_all(bind=engine)

    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    yield session
    session.close()


@pytest.fixture
def service():
    return DatabaseService()


# --- UNIT TESTS ---
def test_save_articles_success(service, db_session):
    articles = [
        ArticleCreate(
            title="Kacper Siemionek Test",
            description="Test test test",
            url="http://kacpersiemionek.com/test-1",
            published_at=datetime.now(),
            source="Test Source",
            categories=["Technology"],
        )
    ]

    result = service.save_articles(articles, db_session)

    assert result["status"] == "SUCCESS"
    assert result["new_saved"] == 1

    db_record = (
        db_session.query(ArticleDB)
        .filter_by(url="http://kacpersiemionek.com/test-1")
        .first()
    )
    assert db_record is not None
    assert db_record.title == "Kacper Siemionek Test"


def test_save_articles_empty_list(service, db_session):
    result = service.save_articles([], db_session)
    assert result["status"] == "SUCCESS"
    assert result["new_saved"] == 0


def test_save_articles_special_chars(service, db_session):
    title_with_emojis = "Roxie 🔥🥵😳 '''''👣🦍🍏🚀🔑🚳🚩<br>"
    article = ArticleCreate(
        title=title_with_emojis,
        description="Fani w szoku 😱🤯🔥",
        url="http://pudelek.pl/emoji",
        published_at=datetime.now(),
        source="Test",
        categories=[],
    )
    service.save_articles([article], db_session)
    db_record = db_session.query(ArticleDB).first()
    assert db_record.title == title_with_emojis


def test_save_articles_duplicate_url(service, db_session):
    article = ArticleCreate(
        title="Roxie Węgiel założyła TO do sklepu!? [ZOBACZ ZDJĘCIA]",
        description="Fani w szoku",
        url="http://pudelek.pl/roxie-1",
        published_at=datetime.now(),
        source="Pudelek",
        categories=["Politics"],
    )

    service.save_articles([article], db_session)
    result = service.save_articles([article], db_session)

    assert result["new_saved"] == 0
    assert db_session.query(ArticleDB).count() == 1
