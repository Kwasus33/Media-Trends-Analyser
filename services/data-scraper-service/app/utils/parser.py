import re


def parse_text(text: str = "") -> str:
    """
    Parses scraped text using regular expressions and removes unwanted artifacts like HTML tags

    :param text: Description
    :type text: str
    :return: Description
    :rtype: str
    """
    cleaned_text = re.sub(pattern="<[^>]+.*?>", repl="", string=text)
    return cleaned_text
