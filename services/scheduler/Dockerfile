FROM python:3.11

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /src

COPY pyproject.toml uv.lock ./

RUN uv sync

COPY app ./app

WORKDIR /src

ENV PATH="/src/.venv/bin:${PATH}"

ENV PYTHONPATH="/src"

EXPOSE 8084

CMD [ "uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8084" ]