import json

CONFIG_FILE = "app/core/config.json"


def load_context():
    with open(CONFIG_FILE, "r") as fh:
        obj = json.load(fh)
    return obj


CONTEXT = load_context()
