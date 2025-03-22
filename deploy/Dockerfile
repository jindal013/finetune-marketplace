FROM python:3.9-slim

# Install libraries
COPY ./requirements.txt ./
RUN pip install -r requirements.txt && \
    rm ./requirements.txt

# container directories
RUN mkdir /app

# Copy app directory (code and Pytorch model) to the container
COPY ./app /app

# run server with gunicorn
WORKDIR /app
EXPOSE 8080
CMD ["gunicorn", "main:app", "--timeout=0", "--preload", \
    "--workers=1", "--threads=4", "--bind=0.0.0.0:8080"]