FROM python:3.12-slim

WORKDIR /app

COPY pyproject.toml .

RUN pip install uv
RUN uv venv
# Remove the problematic activation line and use the venv python directly
RUN uv pip install --python .venv/bin/python .

COPY . .

EXPOSE 8000

# Use the python from the virtual environment to run the application
CMD [".venv/bin/python", "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
