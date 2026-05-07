import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../ProductCard';

// Mock the CartContext
const mockAddToCart = vi.fn();
vi.mock('../../context/CartContext', () => ({
  useCart: () => ({
    addToCart: mockAddToCart,
  }),
}));

const mockProduct = {
  id: 1,
  title: 'Test Product',
  price: 99.99,
  originalPrice: 129.99,
  brand: 'Test Brand',
  images: ['test-image.jpg'],
  rating: 4.5,
  reviewCount: 42,
  isNew: true,
  discount: 20,
  colors: [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
  ],
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Brand')).toBeInTheDocument();
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('$129.99')).toBeInTheDocument();
    expect(screen.getByText('4.5 (42)')).toBeInTheDocument();
  });

  it('displays new badge when product is new', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);

    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('displays discount badge when discount exists', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);

    expect(screen.getByText('-20%')).toBeInTheDocument();
  });

  it('renders color swatches', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);

    const colorSwatches = screen.getAllByTitle(/Black|White/);
    expect(colorSwatches).toHaveLength(2);
  });

  it('calls addToCart when add to cart button is clicked', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButton);

    expect(mockAddToCart).toHaveBeenCalledWith({
      productId: 1,
      qty: 1,
      title: 'Test Product',
      price: 99.99,
      image: 'test-image.jpg',
      brand: 'Test Brand',
    });
  });

  it('toggles wishlist when heart button is clicked', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);

    const heartButton = screen.getByRole('button', { name: '' }); // Heart button has no accessible name
    fireEvent.click(heartButton);

    // The button should have red background when wished
    expect(heartButton).toHaveClass('bg-red-500');
  });

  it('links to product detail page', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/product/1');
  });
});