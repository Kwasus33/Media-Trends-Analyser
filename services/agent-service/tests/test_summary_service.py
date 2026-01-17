from datetime import date, datetime
from unittest.mock import MagicMock, patch

import pytest
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models import Article, DailySummary, ViewDailySummary
from app.schemas.daily_summary import DailySummary as DailySummarySchema
from app.services import summary_service


# --- FIXTURES ---
@pytest.fixture
def mock_db():
    return MagicMock(spec=Session)


@pytest.fixture
def mock_agent():
    agent = MagicMock()
    mock_daily_result = MagicMock(spec=DailySummarySchema)
    mock_daily_result.model_dump.return_value = {
        "date": date(2026, 1, 1),
        "summaries": {},
        "categories": {},
    }
    mock_daily_result.references = {}
    agent.get_daily_summary.return_value = mock_daily_result
    return agent


# --- HELPER TESTS ---


# --- UNIT TESTS ---
def test_fetch_articles_found(mock_db):
    mock_query = mock_db.query.return_value
    mock_filter1 = mock_query.filter.return_value
    mock_filter2 = mock_filter1.filter.return_value
    mock_filter2.all.return_value = [Article(id=1, title="Roxi Węgiel wore this to the market!?!?!? [PHOTOS]")]

    result = summary_service.fetch_articles(mock_db, date(2026, 1, 1))
    assert len(result) == 1
    assert result[0].title == "Roxi Węgiel wore this to the market!?!?!? [PHOTOS]"

def test_fetch_articles_not_found(mock_db):
    mock_db.query.return_value.filter.return_value.filter.return_value.all.return_value = []

    with pytest.raises(HTTPException) as exc:
        summary_service.fetch_articles(mock_db, date(2026, 1, 1))
    assert exc.value.status_code == 404

@patch("app.services.summary_service.create_summary_agent")
@patch("app.services.summary_service.fetch_articles")
def test_get_daily_summary_success(mock_fetch, mock_create_agent, mock_db, mock_agent):
    summary_date = date(2026, 1, 1)

    mock_db.query.return_value.filter.return_value.first.return_value = None
    
    article = Article(
        id=1, 
        title="Roxi Węgiel wore this to the market!?!?!? [PHOTOS]", 
        url="http://example.com",
        published_at=datetime.now(), 
        description="Roxie Węgiel stunned fans with her latest outfit. What impact will it have on the technology industry? Is she out of her mind? Fashion experts investigate.", 
        source="BBC", 
        categories=["Technology"]
    )
    mock_fetch.return_value = [article]

    mock_create_agent.return_value = mock_agent

    result = summary_service.get_daily_summary(summary_date, mock_db)

    mock_fetch.assert_called_once()
    mock_agent.get_daily_summary.assert_called_once()
    mock_db.add.assert_called_once()
    mock_db.commit.assert_called_once()