.
├── agent-service  # Contains the main application files.
│   ├── __init__.py   # this file makes "app" a "Python package"
│   ├── main.py       # Initializes the FastAPI application.
│   ├── dependencies.py # Defines dependencies used by the routers
│   ├── routers       # Defines APIs
│   │   ├── __init__.py
│   │   └── ...
│   ├── core          # Defines configurations, auth, jwt, loggers
│   │   ├── __init__.py
│   │   └── ...
│   ├── models/       # Defines database ORM models
│   │   ├── __init__.py  
│   │   └── ...
│   ├── schemas       # Defines Pydantic data schemas
│   │   ├── __init__.py
│   │   └── ...
│   ├── db            # Defines and configures data base 
│   │   ├── __init__.py
│   │   ├── migrations
│   │   └── ...  
│   ├── services      # Defines application's bussiness logic
│   │   ├── __init__.py
│   │   └── ...
│   └── utils         # Defines utils used across application
│       ├── __init__.py
│       └── ...
├── tests
│   ├── __init__.py
│   └── ...
├── pyproject.toml
├── .gitignore
└── README.md