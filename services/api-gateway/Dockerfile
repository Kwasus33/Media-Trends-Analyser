FROM python:3.11

RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates

ADD https://astral.sh/uv/install.sh /uv-installer.sh

RUN sh /uv-installer.sh && rm /uv-installer.sh

ENV PATH="/root/.local/bin/:$PATH"

WORKDIR /app

COPY . .

RUN uv sync

ENV PATH="/.venv/bin:${PATH}"

EXPOSE $PORT

RUN useradd app

USER app

CMD [ "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080", "--reload" ]