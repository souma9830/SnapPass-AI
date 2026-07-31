FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# In a container the service must listen on all interfaces, but it stays
# reachable only to peers inside the Docker network. The Express layer
# authenticates with the shared INTERNAL_API_SECRET.
ENV HOST=0.0.0.0

# Run the Flask service so /health and /remove-bg are available.
CMD ["python", "main.py"]
