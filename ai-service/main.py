from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import numpy as np
from PIL import Image
import io
import os

app = FastAPI(title="FashionAI Style Analysis Service", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class StyleAnalysisRequest(BaseModel):
    preferences: List[str]
    occasion: str
    budget: Optional[float] = None

class StyleRecommendation(BaseModel):
    style_type: str
    confidence: float
    description: str
    recommended_items: List[str]
    color_palette: List[str]

class OutfitSuggestion(BaseModel):
    occasion: str
    items: List[dict]
    total_price: float
    style_score: float

# Mock AI models (in production, these would be real ML models)
class FashionAI:
    def __init__(self):
        # Mock style categories
        self.styles = {
            'minimalist': ['black', 'white', 'grey', 'navy', 'clean lines', 'simple'],
            'bohemian': ['flowy', 'ethnic prints', 'natural fabrics', 'earth tones'],
            'classic': ['tailored', 'neutral colors', 'quality fabrics', 'timeless'],
            'streetwear': ['bold', 'urban', 'comfortable', 'trendy', 'oversized'],
            'elegant': ['luxury', 'sophisticated', 'metallic', 'structured', 'refined']
        }

    def analyze_style_from_image(self, image_data: bytes) -> StyleRecommendation:
        """Mock style analysis from image"""
        # In production, this would use computer vision models
        # For now, return a random style analysis
        style_types = list(self.styles.keys())
        selected_style = np.random.choice(style_types)

        return StyleRecommendation(
            style_type=selected_style,
            confidence=round(np.random.uniform(0.7, 0.95), 2),
            description=f"Your style appears to be {selected_style} with clean, modern aesthetics.",
            recommended_items=self._get_recommended_items(selected_style),
            color_palette=self._get_color_palette(selected_style)
        )

    def analyze_style_from_preferences(self, preferences: List[str], occasion: str) -> StyleRecommendation:
        """Analyze style based on user preferences"""
        # Simple keyword matching for demo
        style_scores = {}
        for style, keywords in self.styles.items():
            score = sum(1 for pref in preferences if any(kw in pref.lower() for kw in keywords))
            style_scores[style] = score

        best_style = max(style_scores, key=style_scores.get)

        return StyleRecommendation(
            style_type=best_style,
            confidence=round(np.random.uniform(0.8, 0.95), 2),
            description=f"Based on your preferences, you have a {best_style} style personality.",
            recommended_items=self._get_recommended_items(best_style),
            color_palette=self._get_color_palette(best_style)
        )

    def generate_outfit_suggestion(self, occasion: str, budget: Optional[float] = None) -> OutfitSuggestion:
        """Generate outfit suggestions"""
        # Mock outfit generation
        outfits = {
            'casual': [
                {'item': 'White Cotton T-Shirt', 'price': 25, 'category': 'tops'},
                {'item': 'Blue Jeans', 'price': 80, 'category': 'bottoms'},
                {'item': 'White Sneakers', 'price': 90, 'category': 'shoes'}
            ],
            'business': [
                {'item': 'Navy Blazer', 'price': 150, 'category': 'outerwear'},
                {'item': 'White Dress Shirt', 'price': 45, 'category': 'tops'},
                {'item': 'Grey Trousers', 'price': 85, 'category': 'bottoms'},
                {'item': 'Black Leather Shoes', 'price': 120, 'category': 'shoes'}
            ],
            'party': [
                {'item': 'Black Cocktail Dress', 'price': 120, 'category': 'dresses'},
                {'item': 'Gold Heels', 'price': 95, 'category': 'shoes'},
                {'item': 'Silver Clutch', 'price': 65, 'category': 'accessories'}
            ]
        }

        outfit = outfits.get(occasion.lower(), outfits['casual'])
        total_price = sum(item['price'] for item in outfit)

        # Check budget constraint
        if budget and total_price > budget:
            # Scale down prices if over budget
            scale_factor = budget / total_price
            for item in outfit:
                item['price'] = round(item['price'] * scale_factor, 2)
            total_price = budget

        return OutfitSuggestion(
            occasion=occasion,
            items=outfit,
            total_price=round(total_price, 2),
            style_score=round(np.random.uniform(8.0, 9.5), 1)
        )

    def _get_recommended_items(self, style: str) -> List[str]:
        """Get recommended items for a style"""
        recommendations = {
            'minimalist': ['White Oxford Shirt', 'Black Trousers', 'Leather Loafers', 'Wool Coat'],
            'bohemian': ['Flowy Maxi Dress', 'Ankle Boots', 'Layered Necklaces', 'Kimono'],
            'classic': ['Tailored Blazer', 'Button-Down Shirt', 'Chinos', 'Loafers'],
            'streetwear': ['Oversized Hoodie', 'Cargo Pants', 'High-Top Sneakers', 'Baseball Cap'],
            'elegant': ['Silk Blouse', 'Tailored Pants', 'Stilettos', 'Pearl Earrings']
        }
        return recommendations.get(style, [])

    def _get_color_palette(self, style: str) -> List[str]:
        """Get color palette for a style"""
        palettes = {
            'minimalist': ['#000000', '#FFFFFF', '#808080', '#000080'],
            'bohemian': ['#8B4513', '#DAA520', '#F5DEB3', '#556B2F'],
            'classic': ['#000000', '#FFFFFF', '#000080', '#808080'],
            'streetwear': ['#000000', '#FF0000', '#FFFFFF', '#FFD700'],
            'elegant': ['#000000', '#FFFFFF', '#C0C0C0', '#FFD700']
        }
        return palettes.get(style, [])

# Initialize AI service
fashion_ai = FashionAI()

@app.get("/")
async def root():
    return {"message": "FashionAI Style Analysis Service", "status": "running"}

@app.post("/analyze/image", response_model=StyleRecommendation)
async def analyze_style_from_image(file: UploadFile = File(...)):
    """Analyze style from uploaded image"""
    try:
        # Read image data
        image_data = await file.read()

        # Validate image
        try:
            image = Image.open(io.BytesIO(image_data))
            image.verify()
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid image file")

        # Analyze style
        result = fashion_ai.analyze_style_from_image(image_data)
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/analyze/preferences", response_model=StyleRecommendation)
async def analyze_style_from_preferences(request: StyleAnalysisRequest):
    """Analyze style from user preferences"""
    try:
        result = fashion_ai.analyze_style_from_preferences(
            request.preferences,
            request.occasion
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/suggest-outfit", response_model=OutfitSuggestion)
async def suggest_outfit(request: StyleAnalysisRequest):
    """Generate outfit suggestions"""
    try:
        result = fashion_ai.generate_outfit_suggestion(
            request.occasion,
            request.budget
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Suggestion failed: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "FashionAI"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)