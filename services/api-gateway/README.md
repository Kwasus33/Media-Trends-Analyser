.
├── api-gateway     # Contains service files
│   ├── api           # Defines APIs
│   │   ├── v1/       # API versioning
│   │   ├── __init__.py
│   │   └── ...
│   ├── core          # Defines configurations, auth, jwt, loggers
│   │   ├── __init__.py
│   │   └── ...
│   └── services      # Defines application's bussiness logic
│       ├── __init__.py
│       └── ...
├── tests
│   ├── __init__.py
│   └── ...
├── .gitignore
├── .python-version
├── pyproject.toml    # Stores project information and dependecies 
├── README.md
└── uv.lock           # Locks dependencies for uv package manager