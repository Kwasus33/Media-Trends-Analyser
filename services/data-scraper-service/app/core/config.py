from dotenv import load_dotenv
import json

CONFIG_FILE = "app/core/config.json"


def load_context():
    with open(CONFIG_FILE, "r") as fh:
        obj = json.load(fh)
    return obj


load_dotenv()
CONTEXT = load_context()
