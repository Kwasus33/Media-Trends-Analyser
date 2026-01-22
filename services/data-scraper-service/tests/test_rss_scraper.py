from datetime import datetime
from unittest.mock import MagicMock, patch

import pytest
import requests
from app.scrapers.rss.rss_scraper import RssScraper

SAMPLE_RSS_XML = """
<rss version="2.0">
    <channel>
        <item>
            <title>ODWAŻNA Roxie Węgiel w nowym, ostrym wydaniu! Pręży się w słonecznym Świebodzinie... Przesadziła? [ZOBACZ ZDJĘCIA]</title>
            <link>http://pudelek.pl/roxie-wegiel-testowy-tytul-html-news</link>
            <description>Fani są w SZOKU. Jaki wpływ będzie to miało na polską technologię? Eksperci pytają: "Czy to jeszcze stylizacja, czy już wołanie o atencję?" [ZDJĘCIA]</description>
            <pubDate>Sat, 01 Jan 2026 20:20:00 GMT</pubDate>
            <category>Skandale</category>
            <author>Pudelek</author>
        </item>
    </channel>
</rss>
"""


# --- FIXTURES ---
@pytest.fixture
def mock_article_create():
    with patch("app.scrapers.rss.rss_scraper.ArticleCreate.create") as mock_create:
        yield mock_create


@pytest.fixture
def rss_scraper():
    instance = RssScraper(
        url="http://kacpersiemionek.com/rss/%s", source_name="Test Source"
    )
    return instance


# --- UNIT TESTS ---
@patch("app.scrapers.rss.rss_scraper.requests.get")
def test_collect_data_success(mock_get, rss_scraper, mock_article_create):
    mock_response = MagicMock()
    mock_response.content = SAMPLE_RSS_XML.encode("utf-8")
    mock_get.return_value = mock_response

    mock_article_create.side_effect = lambda **kwargs: kwargs

    results = rss_scraper.collect_data(category="Technology")

    assert len(results) == 1

    article_data = results[0]

    assert (
        article_data["title"]
        == "ODWAŻNA Roxie Węgiel w nowym, ostrym wydaniu! Pręży się w słonecznym Świebodzinie... Przesadziła? [ZOBACZ ZDJĘCIA]"
    )
    assert (
        article_data["url"] == "http://pudelek.pl/roxie-wegiel-testowy-tytul-html-news"
    )
    assert (
        article_data["description"]
        == 'Fani są w SZOKU. Jaki wpływ będzie to miało na polską technologię? Eksperci pytają: "Czy to jeszcze stylizacja, czy już wołanie o atencję?" [ZDJĘCIA]'
    )
    assert article_data["source"] == "Test Source"

    assert isinstance(article_data["published_at"], datetime)
    assert article_data["published_at"].year == 2026

    assert "Technology" in article_data["categories"]


@patch("app.scrapers.rss.rss_scraper.requests.get")
def test_collect_data_request_failure(mock_get, rss_scraper):
    mock_get.side_effect = requests.RequestException("Network error")

    with pytest.raises(Exception) as exc:
        rss_scraper.collect_data()

    assert "Request failed for" in str(exc.value)


@patch("app.scrapers.rss.rss_scraper.requests.get")
def test_collect_data_invalid_xml(mock_get, rss_scraper):
    mock_response = MagicMock()
    mock_response.content = b"Kacper Siemionek, completely not valid XML"
    mock_get.return_value = mock_response

    with pytest.raises(Exception) as exc:
        rss_scraper.collect_data()

    assert len(str(exc.value)) > 0


@patch("app.scrapers.rss.rss_scraper.requests.get")
def test_collect_data_missing_fields(mock_get, rss_scraper, mock_article_create):
    broken_xml = """
    <rss version="2.0">
        <channel>
            <item>
                <title>No link :(((</title>
                <description>Kacper Siemionek</description>
                <pubDate>Sat, 01 Jan 2026 20:20:00 GMT</pubDate>
            </item>
        </channel>
    </rss>
    """
    mock_response = MagicMock()
    mock_response.content = broken_xml.encode("utf-8")
    mock_get.return_value = mock_response

    with pytest.raises(AttributeError):
        rss_scraper.collect_data()
