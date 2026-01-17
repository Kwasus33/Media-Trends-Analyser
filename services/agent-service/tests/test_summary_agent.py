from datetime import date
from unittest.mock import MagicMock, PropertyMock, patch

import pytest
from app.agents.summary_agent import SummaryAgent
from app.schemas.article import Article

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
