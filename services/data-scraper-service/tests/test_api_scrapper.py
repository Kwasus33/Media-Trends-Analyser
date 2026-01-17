import pytest
import requests_mock
from app.scrapers.api.api_scraper import BBCScraper, NYTScraper


# --- FIXTURES ---
@pytest.fixture
def nyt_scraper():
    return NYTScraper(url="http://test-nyt.com", source_name="NYT")


@pytest.fixture
def bbc_scraper():
    return BBCScraper(url="http://test-bbc.com/%s", source_name="BBC")


# --- UNIT TESTS ---
def test_nyt_scraper_collect_data_success(nyt_scraper):
    mock_response = {
        "status": "OK",
        "results": [
            {
                "title": "Kacper Siemionek założył to na plażę?! [ZOBACZ ZDJĘCIA]",
                "abstract": "WOW! Jaki wpływ będzie to miało na polską technologię? Eksperci pytają: 'Czy to jeszcze stylizacja, czy już wołanie o atencję?' [ZDJĘCIA]",
                "url": "http://kacpersiemionek.com/1",
                "published_date": "2026-01-17T12:00:00",
                "des_facet": ["Technology"],
                "org_facet": ["Google"],
            }
        ],
    }

    with requests_mock.Mocker() as m:
        m.get("http://test-nyt.com", json=mock_response)
        articles = nyt_scraper.collect_data()

    assert len(articles) == 1
    assert (
        articles[0].title == "Kacper Siemionek założył to na plażę?! [ZOBACZ ZDJĘCIA]"
    )
    assert articles[0].source == "NYT"
    assert "Technology" in articles[0].categories


def test_bbc_scraper_collect_data_success(bbc_scraper):
    mock_response = {
        "news": [
            {
                "title": "Kacper Siemionek założył to na plażę?! [ZOBACZ ZDJĘCIA]",
                "summary": "ODWAŻNY KACPER SIEMIONEK w nowym, ostrym wydaniu! Pręży się w słonecznym Świebodzinie... Przesadził? [ZOBACZ ZDJĘCIA]",
                "news_link": "http://bbc.com/news1",
            }
        ]
    }

    with requests_mock.Mocker() as m:
        m.get("http://test-bbc.com/Economy", json=mock_response)
        articles = bbc_scraper.collect_data(category="Economy")

    assert len(articles) == 1
    assert (
        articles[0].title == "Kacper Siemionek założył to na plażę?! [ZOBACZ ZDJĘCIA]"
    )
    assert "Economy" in articles[0].categories
