api-gateway               # Contains service files
    ├── app               # main micro service logic
    │   ├── api           # Defines APIs
    │   │   ├── v1       # API versioning
    |   |   |    ├── __init__.py   
    │   │   |    └── ...
    │   │   ├── __init__.py
    │   │   └── ...
    │   ├── core          # Defines configurations, auth, jwt, loggers
    │   │   ├── __init__.py
    │   │   └── ...
    │   ├── database      # Defines database configuration
    │   │   ├── __init__.py
    │   │   └── ...
    │   ├── models        # Defines SQLAlchemy ORM models
    │   │   ├── __init__.py
    │   │   └── ...
    │   ├── services      # Defines application's bussiness logic
    │   │   ├── __init__.py
    │   │   └── ...
    │   ├── __init__.py  
    │   └── main.py
    ├── tests
    │   ├── __init__.py
    │   └── ...
    ├── .env.example
    ├── .gitignore
    ├── .python-version
    ├── pyproject.toml    # Stores project information and dependecies 
    ├── README.md
    └── uv.lock           # Locks dependencies for uv package manager