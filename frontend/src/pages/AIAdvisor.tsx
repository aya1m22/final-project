import React, { useState } from 'react';
import { Upload, Sparkles, Camera, CheckCircle2, ChevronRight, Info, Zap, Loader2 } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';

const OCCASIONS = ['Wedding Guest', 'Date Night', 'Business Formal', 'Weekend Casual', 'Beach Vacation', 'Red Carpet'];

interface StyleAnalysis {
  style_type: string;
  confidence: number;
  description: string;
  recommended_items: string[];
  color_palette: string[];
}

interface OutfitItem {
  item: string;
  price: number;
  category: string;
}

interface OutfitSuggestion {
  occasion: string;
  items: OutfitItem[];
  total_price: number;
  style_score: number;
}

export default function AIAdvisor() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [occasion, setOccasion] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [styleAnalysis, setStyleAnalysis] = useState<StyleAnalysis | null>(null);
  const [outfitSuggestion, setOutfitSuggestion] = useState<OutfitSuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setError(null);
    }
  };

  const analyzeImage = async () => {
    if (!file) return;

    setAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:4000/api/ai/analyze/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      setStyleAnalysis(result);

      // Also get outfit suggestion
      await getOutfitSuggestion();

    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const getOutfitSuggestion = async () => {
    if (!occasion) return;

    try {
      const response = await fetch('http://localhost:4000/api/ai/suggest-outfit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences: styleAnalysis ? [styleAnalysis.style_type] : [],
          occasion: occasion.toLowerCase().replace(' ', '_'),
          budget: 300
        }),
      });

      if (!response.ok) {
        throw new Error('Outfit suggestion failed');
      }

      const result = await response.json();
      setOutfitSuggestion(result);

    } catch (err) {
      console.error('Outfit suggestion error:', err);
    }
  };

  const startAnalysis = () => {
    if (!file || !occasion) return;

    if (file) {
      analyzeImage();
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
            <Sparkles size={14} />
            AI STYLIST v2.0
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            The Science of <span className="text-primary">Personal Style</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our neural network analyzes your proportions, skin undertone, and aesthetic preferences to curate the perfect wardrobe.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Upload & Inputs */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <Camera className="text-primary" size={24} />
                <h2 className="text-xl font-semibold text-foreground">1. Upload Your Reference</h2>
              </div>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  preview ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'
                }`}
                onClick={() => document.getElementById('ai-upload')?.click()}
              >
                {preview ? (
                  <img
                    src={preview}
                    className="w-full h-64 object-cover rounded-md"
                    alt="Preview"
                  />
                ) : (
                  <div>
                    <Upload className="mx-auto text-muted-foreground mb-4" size={48} />
                    <div className="text-lg font-medium text-foreground mb-2">Drop a full-body photo</div>
                    <div className="text-sm text-muted-foreground">or click to browse. Max 10MB.</div>
                  </div>
                )}
                <input
                  type="file"
                  id="ai-upload"
                  hidden
                  onChange={handleUpload}
                  accept="image/*"
                />
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="text-primary" size={24} />
                <h2 className="text-xl font-semibold text-foreground">2. Select the Occasion</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {OCCASIONS.map(o => (
                  <button
                    key={o}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      occasion === o
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                    onClick={() => setOccasion(o)}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={!file || !occasion || analyzing}
              onClick={startAnalysis}
            >
              {analyzing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Analyzing Visual Data...
                </>
              ) : (
                <>
                  Analyze My Style
                  <Sparkles size={16} />
                </>
              )}
            </button>

            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Right: Results / Info */}
          <div>
            {!styleAnalysis && !analyzing && (
              <div className="bg-muted rounded-lg p-8 text-center h-full flex flex-col justify-center">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">Waiting for Data</h3>
                <p className="text-muted-foreground">
                  Upload a photo and select an occasion to generate your AI style report.
                </p>
              </div>
            )}

            {analyzing && (
              <div className="bg-card rounded-lg p-8 border border-border h-full flex flex-col justify-center items-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="text-primary-foreground animate-pulse" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Neural Processing</h3>
                <div className="w-3/5 h-2 bg-muted rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-primary animate-pulse" style={{ width: '60%' }} />
                </div>
                <p className="text-muted-foreground text-sm">Scanning proportions and color harmony...</p>
              </div>
            )}

            {styleAnalysis && (
              <div className="space-y-6">
                <div className="bg-card rounded-lg p-6 border border-border">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Style Profile</div>
                      <div className="text-lg font-semibold text-foreground capitalize">
                        {styleAnalysis.style_type}
                      </div>
                    </div>
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {Math.round(styleAnalysis.confidence * 100)}% Confidence
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    {styleAnalysis.description}
                  </p>

                  <div className="flex gap-2 mb-4">
                    {styleAnalysis.color_palette.map((color, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-border"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-card rounded-lg p-6 border border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="text-primary" size={18} />
                    <h3 className="text-lg font-semibold text-foreground">AI Styling Guidelines</h3>
                  </div>
                  <ul className="space-y-3">
                    {styleAnalysis.recommended_items.map((rec, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <CheckCircle2 className="text-primary mt-0.5 flex-shrink-0" size={14} />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Recommendations Grid */}
        {outfitSuggestion && (
          <div className="mt-12">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8">
              <div>
                <div className="text-sm text-muted-foreground mb-2">The Look</div>
                <h2 className="text-3xl font-bold text-foreground">
                  Curated For <span className="text-primary">{occasion}</span>
                </h2>
              </div>
              <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors mt-4 sm:mt-0">
                Shop Full Look
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {outfitSuggestion.items.map((item, index) => (
                <div key={index} className="bg-card rounded-lg p-6 border border-border">
                  <div className="text-sm text-muted-foreground mb-2 capitalize">{item.category}</div>
                  <div className="font-semibold text-foreground mb-2">{item.item}</div>
                  <div className="text-primary font-medium">${item.price}</div>
                </div>
              ))}
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground">Total Price</div>
                  <div className="text-2xl font-bold text-foreground">${outfitSuggestion.total_price}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Style Score</div>
                  <div className="text-2xl font-bold text-primary">{outfitSuggestion.style_score}/10</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
