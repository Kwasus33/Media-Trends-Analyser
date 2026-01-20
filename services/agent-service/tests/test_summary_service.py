from datetime import date, datetime
from unittest.mock import MagicMock, patch
import pytest
import asyncio
from app.models import Article, DailySummary
from app.services import summary_service
from fastapi import HTTPException
from sqlalchemy.orm import Session


# --- FIXTURES ---
@pytest.fixture
def mock_db():
    return MagicMock(spec=Session)


@pytest.fixture
def mock_agent():
    agent = MagicMock()
    agent.get_daily_summary_for_source.return_value = {
        "summaries": {"BBC": {"Technology": "Test summary"}},
        "categories": {"BBC": {"Technology": 1}},
        "references": {"BBC": {"Technology": [1]}},
    }
    return agent


# --- UNIT TESTS ---
def test_fetch_articles_by_source_found(mock_db):
    mock_query = mock_db.query.return_value
    mock_filter = mock_query.filter.return_value
    mock_filter.all.return_value = [
        Article(
            id=1,
            title="Roxi Węgiel wore this to the market!?!?!? [PHOTOS]",
            source="BBC",
        )
    ]

    result = summary_service.fetch_articles_by_source(mock_db, date(2026, 1, 1), "BBC")
    assert len(result) == 1
    assert result[0].title == "Roxi Węgiel wore this to the market!?!?!? [PHOTOS]"


def test_fetch_all_articles_grouped_not_found(mock_db):
    mock_db.query.return_value.filter.return_value.all.return_value = []

    with pytest.raises(HTTPException) as exc:
        summary_service.fetch_all_articles_grouped(mock_db, date(2026, 1, 1))
    assert exc.value.status_code == 404


@pytest.mark.asyncio
@patch("app.services.summary_service.create_summary_agent")
@patch("app.services.summary_service.fetch_all_articles_grouped")
async def test_get_daily_summary_success(mock_fetch, mock_create_agent, mock_db, mock_agent):
    summary_date = date(2026, 1, 1)
    mock_db.query.return_value.filter.return_value.first.return_value = None

    article = Article(
        id=1,
        title="Roxi Węgiel wore this to the market!?!?!? [PHOTOS]",
        url="http://example.com",
        published_at=datetime.now(),
        description="Roxie Węgiel stunned fans with her latest outfit.",
        source="BBC",
        categories=["Technology"],
    )
    mock_fetch.return_value = {"BBC": [article]}
    mock_create_agent.return_value = mock_agent

    await summary_service.get_daily_summary_async(summary_date, mock_db)

    mock_fetch.assert_called_once_with(mock_db, summary_date)
    mock_db.add.assert_called_once()
    mock_db.commit.assert_called_once()

    args, _ = mock_db.add.call_args
    added_summary = args[0]
    assert isinstance(added_summary, DailySummary)
    assert added_summary.date == summary_date


def test_get_daily_summary_already_exists(mock_db):
    summary_date = date(2026, 1, 1)
    existing_summary = DailySummary(
        id=99, date=summary_date, summaries={"BBC": {"Technology": "Old summary"}}
    )

    mock_db.query.return_value.filter.return_value.first.return_value = existing_summary

    with pytest.raises(HTTPException) as exc:
        asyncio.run(summary_service.get_daily_summary_async(summary_date, mock_db))

    assert exc.value.status_code == 409
    mock_db.add.assert_not_called()
    mock_db.commit.assert_not_called()


@patch("app.services.summary_service.create_summary_agent")
@patch("app.services.summary_service.fetch_all_articles_grouped")
def test_get_daily_summary_agent_failure(
    mock_fetch, mock_create_agent, mock_db, mock_agent
):
    mock_db.query.return_value.filter.return_value.first.return_value = None
    mock_fetch.return_value = {"BBC": [MagicMock(spec=Article)]}
    mock_create_agent.return_value = mock_agent
    mock_agent.get_daily_summary_for_source.side_effect = Exception("AI rebellion")

    with pytest.raises(Exception):
        asyncio.run(summary_service.get_daily_summary_async(date(2026, 1, 1), mock_db))

    mock_db.commit.assert_not_called()


def test_convert_dict_to_percentages():
    data = {"Technology": 10, "Politics": 30, "Sports": 60}
    result = summary_service.convert_dict_to_percentages(data)
    assert sum(result.values()) == 100
    assert result["Sports"] == 60


def test_fill_dates_in_categories():
    categories_timeline = [{"date": "2026-01-02", "Technology": 50, "Politics": 50}]
    result = summary_service.fill_dates_in_categories(
        categories_timeline,
        date(2026, 1, 1),
        date(2026, 1, 3),
        ["Technology", "Politics"],
    )
    assert len(result) == 3
    assert result[0]["date"] == "2026-01-01"
    assert result[0]["Technology"] == 0
