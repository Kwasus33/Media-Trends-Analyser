import re


def parse_text(text: str | None = "") -> str:
    """
    Parses scraped text using regular expressions and removes unwanted artifacts like HTML tags

    :param text: Description
    :type text: str
    :return: Description
    :rtype: str
    """
    if not text:
        return ""
    return re.sub(pattern="<(?!!)[^>]+.*?>", repl="", string=text)
