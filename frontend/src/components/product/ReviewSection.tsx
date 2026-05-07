import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageSquare, Upload } from 'lucide-react';

interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  title?: string;
  content?: string;
  images?: string;
  helpful: number;
  notHelpful: number;
  status: string;
  createdAt: string;
  user: { id: number; email: string };
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: { [key: number]: number };
}

interface ReviewSectionProps {
  productId: number;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    content: ''
  });

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/reviews/product/${productId}?limit=5`);
      const data = await response.json();
      setReviews(data.reviews);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/reviews/stats/${productId}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:4000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token' // In production, use real token
        },
        body: JSON.stringify({
          productId,
          rating: formData.rating,
          title: formData.title,
          content: formData.content
        })
      });

      if (response.ok) {
        setFormData({ rating: 5, title: '', content: '' });
        setShowForm(false);
        fetchReviews();
        fetchStats();
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const handleHelpful = async (reviewId: number, helpful: boolean) => {
    try {
      await fetch(`http://localhost:4000/api/reviews/${reviewId}/helpful`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ helpful })
      });
      fetchReviews();
    } catch (error) {
      console.error('Failed to mark helpful:', error);
    }
  };

  return (
    <div className="mt-24 py-12 border-t border-border">
      <h2 className="font-serif text-3xl text-foreground mb-8">Customer Reviews</h2>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {/* Rating Summary */}
        <div className="md:col-span-1 bg-card border border-border rounded-lg p-6">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-foreground mb-2">
              {stats ? stats.averageRating : '—'}
            </div>
            <div className="flex justify-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.round(stats?.averageRating || 0) ? 'fill-accent text-accent' : 'text-border'}
                />
              ))}
            </div>
            <p className="text-sm text-foreground-muted">
              {stats?.totalReviews || 0} reviews
            </p>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-3 text-sm">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-xs text-foreground-muted w-6">{rating}★</span>
                <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent"
                    style={{
                      width: `${stats ? (stats.ratingBreakdown[rating] / stats.totalReviews) * 100 : 0}%`
                    }}
                  />
                </div>
                <span className="text-xs text-foreground-muted w-6 text-right">
                  {stats?.ratingBreakdown[rating] || 0}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full btn-primary py-3 mt-6 text-sm"
          >
            Write a Review
          </button>
        </div>

        {/* Review Form */}
        {showForm && (
          <div className="md:col-span-2 bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Share Your Experience</h3>
            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="text-2xl transition-colors"
                    >
                      <Star
                        size={24}
                        className={star <= formData.rating ? 'fill-accent text-accent' : 'text-border'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Title (optional)</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="What's the main point?"
                  className="w-full bg-background border border-border rounded px-4 py-2 text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Review (optional)</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Share your experience..."
                  rows={4}
                  className="w-full bg-background border border-border rounded px-4 py-2 text-foreground resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary px-6 py-2 text-sm">
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary px-6 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <p className="text-foreground-muted">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-foreground-muted">No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="border-b border-border pb-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < review.rating ? 'fill-accent text-accent' : 'text-border'}
                        />
                      ))}
                    </div>
                    <span className="font-medium text-foreground text-sm">{review.title || 'Untitled'}</span>
                  </div>
                  <p className="text-xs text-foreground-muted">
                    by {review.user.email.split('@')[0]} • {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {review.content && (
                <p className="text-sm text-foreground mb-4">{review.content}</p>
              )}

              <div className="flex items-center gap-4 text-xs text-foreground-muted">
                <button
                  onClick={() => handleHelpful(review.id, true)}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <ThumbsUp size={14} />
                  Helpful ({review.helpful})
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
