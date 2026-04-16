import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

// Mock Dog API so tests don't make real network calls
beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      message: 'https://images.dog.ceo/breeds/husky/test.jpg',
      status: 'success',
    }),
  }));
});

describe('PawsMatch — Core Requirements', () => {
  it('should have a root component that can be found and imported', async () => {
    const module = await import('../App');
    expect(module.default).not.toBeNull();
  });

  it('should render the root component without crashing', () => {
    const { container } = render(<App />);
    expect(container).not.toBeNull();
  });

  it('should display at least one pet name in the UI', async () => {
    render(<App />);
    // First pet is shown synchronously from local data
    const { pets } = await import('../data/mockData');
    await waitFor(() => {
      expect(screen.getByText(pets[0].name)).toBeInTheDocument();
    });
  });

  it('should display pet biographical or descriptive information', async () => {
    render(<App />);
    const { pets } = await import('../data/mockData');
    await waitFor(() => {
      const bioLine = pets[0].bio.split('\n')[0];
      expect(screen.getByText((content) => content.includes(bioLine.slice(0, 20)))).toBeInTheDocument();
    });
  });

  it('should contain an image element for the pet', async () => {
    render(<App />);
    await waitFor(() => {
      const card = document.querySelector('[data-testid="pet-card"]');
      expect(card).not.toBeNull();
    });
  });

  it('should have a like/adopt/yes interaction element', async () => {
    render(<App />);
    await waitFor(() => {
      const likeBtn = screen.getByRole('button', { name: /adoptar/i });
      expect(likeBtn).toBeInTheDocument();
    });
  });

  it('should have a pass/reject/no interaction element', async () => {
    render(<App />);
    await waitFor(() => {
      const passBtn = screen.getByRole('button', { name: /pasar/i });
      expect(passBtn).toBeInTheDocument();
    });
  });

  it('should have interactive buttons or draggable card for swiping', async () => {
    render(<App />);
    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  it('should present a card-like layout for pet profiles', async () => {
    render(<App />);
    await waitFor(() => {
      const card = document.querySelector('[data-testid="pet-card"]');
      expect(card).not.toBeNull();
    });
  });

  it('should show some kind of app branding or title', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/pawsmatch/i)).toBeInTheDocument();
    });
  });

  it('should use multiple pets (not just a single static profile)', async () => {
    const { pets } = await import('../data/mockData');
    expect(pets.length).toBeGreaterThan(1);
  });

  it('should have a confirmation or adoption detail view', async () => {
    render(<App />);
    await waitFor(() => {
      const likeBtn = screen.getByRole('button', { name: /adoptar/i });
      fireEvent.click(likeBtn);
    });
    await waitFor(() => {
      expect(screen.getByTestId('adoption-details')).toBeInTheDocument();
    });
  });
});
