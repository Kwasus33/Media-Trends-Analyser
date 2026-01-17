from datetime import date
from unittest.mock import MagicMock, PropertyMock, patch

import pytest
from app.agents.summary_agent import SummaryAgent
from app.schemas.article import Article
from app.schemas.daily_summary import DailySummary

# --- FIXTURES ---


@pytest.fixture
def mock_settings():
    settings = MagicMock()
    settings.article_categories = ["Technology", "Politics"]
    settings.sources = ["BBC", "TVN24"]
    return settings


@pytest.fixture
def mock_model():
    return MagicMock()


# --- UNIT TESTS ---


def test_initialization(mock_model, mock_settings):
    agent = SummaryAgent(model=mock_model, settings=mock_settings)

    assert agent.model == mock_model
    assert agent.settings == mock_settings
    assert "Technology" in agent.settings.article_categories
    assert "BBC" in agent.settings.sources


def test_get_daily_summary(mock_model, mock_settings):
    agent = SummaryAgent(model=mock_model, settings=mock_settings)
    test_date = date(2026, 1, 1)

    article = MagicMock(spec=Article)
    article.full_description = "Roxi Węgiel wore this to the market!?!?!? [PHOTOS]"
    article.source = "BBC"

    expected_output = {
        "summaries": {
            "BBC": {
                "Technology": "Roxi Węgiel's outfit revolutionizes polish technology market."
            }
        },
        "categories": {"BBC": {"Technology": 1}},
        "references": {"BBC": {"Technology": [101]}},
    }

    mock_final_chain = MagicMock()
    mock_final_chain.invoke.return_value = expected_output

    with patch(
        "app.agents.summary_agent.SummaryAgent.daily_summary_prompt",
        new_callable=PropertyMock,
    ) as mock_prompt_property:
        mock_prompt_obj = MagicMock()
        mock_prompt_property.return_value = mock_prompt_obj

        mock_prompt_obj.__or__.return_value = mock_model

        mock_model.__or__.return_value = mock_final_chain

        result = agent.get_daily_summary([article], test_date)

    assert result.date == test_date
    assert result.summaries == expected_output["summaries"]
    assert result.categories["BBC"]["Technology"] == 1
    assert 101 in result.references["BBC"]["Technology"]


def test_get_daily_summary_empty(mock_model, mock_settings):
    agent = SummaryAgent(model=mock_model, settings=mock_settings)
    test_date = date(2026, 1, 1)

    expected_output = {"summaries": {}, "categories": {}, "references": {}}

    mock_final_chain = MagicMock()
    mock_final_chain.invoke.return_value = expected_output

    with patch(
        "app.agents.summary_agent.SummaryAgent.daily_summary_prompt",
        new_callable=PropertyMock,
    ) as mock_prompt_property:
        mock_prompt_obj = MagicMock()
        mock_prompt_property.return_value = mock_prompt_obj

        mock_prompt_obj.__or__.return_value = mock_model
        mock_model.__or__.return_value = mock_final_chain

        result = agent.get_daily_summary([], test_date)

    assert result.date == test_date
    assert result.summaries == {}


def test_get_periodic_summary_filtering(mock_model, mock_settings):
    agent = SummaryAgent(model=mock_model, settings=mock_settings)
    daily_mock = MagicMock(spec=DailySummary)
    daily_mock.summaries = {
        "BBC": {
            "Technology": "Important tech news like new Kim Kardashian Fortnite skins"
        },
        "Pudelek": {"Gossip": "Something we don't care about like WW3 or so"},
    }
    daily_mock.categories = {"BBC": {"Technology": 1}, "Pudelek": {"Gossip": 50}}
    daily_mock.references = {"BBC": {"Technology": [1]}, "Pudelek": {"Gossip": [2]}}

    mock_output = {
        "main_summary": "Test",
        "categories_timeline": [],
        "category_totals": {},
        "trends": {},
        "key_insights": [],
        "source_highlights": {},
        "event_timeline": {},
        "references": {},
    }

    mock_final_chain = MagicMock()
    mock_final_chain.invoke.return_value = mock_output

    with patch(
        "app.agents.summary_agent.SummaryAgent.periodic_summary_prompt",
        new_callable=PropertyMock,
    ) as mock_prompt_property:
        mock_prompt_obj = MagicMock()
        mock_prompt_property.return_value = mock_prompt_obj

        mock_prompt_obj.__or__.return_value = mock_model
        mock_model.__or__.return_value = mock_final_chain

        agent.get_periodic_summary(
            daily_summaries=[daily_mock],
            sources=["BBC"],
            categories=["Technology"],
            start_date=date(2026, 1, 1),
            end_date=date(2026, 1, 7),
        )

    assert "BBC" in daily_mock.summaries
    assert "Pudelek" not in daily_mock.summaries

    assert "BBC" in daily_mock.categories
    assert "Pudelek" not in daily_mock.categories


def test_get_periodic_summary_structure(mock_model, mock_settings):
    agent = SummaryAgent(model=mock_model, settings=mock_settings)

    mock_output = {
        "main_summary": "Weekly recap text",
        "categories_timeline": [{"date": "2026-01-01", "Technology": 10}],
        "category_totals": {"Technology": 10},
        "trends": {
            "rising": ["Technology"],
            "declining": ["Economy"],
            "emerging": ["Politics"],
        },
        "key_insights": ["Insight 1"],
        "source_highlights": {"BBC": "Focus on tech"},
        "event_timeline": {"2026-01-01": "Playboi carti in fortnite."},
        "references": {"BBC": [101]},
    }

    mock_final_chain = MagicMock()
    mock_final_chain.invoke.return_value = mock_output

    with patch(
        "app.agents.summary_agent.SummaryAgent.periodic_summary_prompt",
        new_callable=PropertyMock,
    ) as mock_prompt_property:
        mock_prompt_obj = MagicMock()
        mock_prompt_property.return_value = mock_prompt_obj
        mock_prompt_obj.__or__.return_value = mock_model
        mock_model.__or__.return_value = mock_final_chain

        result = agent.get_periodic_summary(
            daily_summaries=[],
            sources=["BBC"],
            categories=["Technology"],
            start_date=date(2026, 1, 1),
            end_date=date(2026, 1, 7),
        )

    assert result.start_date == date(2026, 1, 1)
    assert result.main_summary == "Weekly recap text"
    assert result.trends["rising"] == ["Technology"]
    assert result.category_totals["Technology"] == 10
