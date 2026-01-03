from dotenv import load_dotenv
import json


def load_context():
    with open("app/utils/config.json", "r") as fh:
        obj = json.load(fh)
    return obj


load_dotenv()
CONTEXT = load_context()
