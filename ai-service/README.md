# FashionAI Style Analysis Service

A FastAPI-based AI service for fashion style analysis and outfit recommendations.

## Features

- **Style Analysis from Images**: Upload fashion images to analyze personal style
- **Preference-Based Analysis**: Analyze style based on user preferences and occasions
- **Outfit Suggestions**: Generate outfit recommendations for different occasions
- **Budget Constraints**: Consider budget limitations in outfit suggestions

## API Endpoints

### POST /analyze/image
Analyze style from an uploaded image.

**Request**: Multipart form with image file
**Response**: Style analysis with recommendations

### POST /analyze/preferences
Analyze style based on user preferences.

**Request Body**:
```json
{
  "preferences": ["minimalist", "clean", "modern"],
  "occasion": "business",
  "budget": 200.0
}
```

### POST /suggest-outfit
Generate outfit suggestions for an occasion.

**Request Body**: Same as preferences analysis

### GET /health
Health check endpoint

## Running Locally

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the service:
```bash
python main.py
```

The service will be available at `http://localhost:8000`

## Docker

Build and run with Docker:
```bash
docker build -t fashion-ai .
docker run -p 8000:8000 fashion-ai
```

## Development

The service uses mock AI models for demonstration. In production, replace with real machine learning models for:
- Computer vision for image analysis
- Style classification models
- Recommendation algorithms