import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Universe3D } from './Universe3D';
import React from 'react';

// Mock GSAP to avoid issues in test environment
const mockTween = { 
  kill: vi.fn(),
  pause: vi.fn(),
  play: vi.fn()
};
vi.mock('gsap', () => ({
  default: {
    to: vi.fn(() => mockTween),
    getProperty: vi.fn((el, prop) => {
      if (prop === 'rotationY') return 12;
      if (prop === 'rotationX') return 4;
      return 0;
    }),
    killTweensOf: vi.fn(),
  },
  getProperty: vi.fn((el, prop) => {
    if (prop === 'rotationY') return 12;
    if (prop === 'rotationX') return 4;
    return 0;
  }),
  to: vi.fn(() => mockTween),
}));

describe('Universe3D Mobile Interactivity', () => {
  it('should respond to touch events for camera rotation (Red Phase)', () => {
    const onPlanetClick = vi.fn();
    const { container } = render(
      <Universe3D active={true} onPlanetClick={onPlanetClick} />
    );

    const universeContainer = container.querySelector('.universe-container');
    
    // Simulate touch start
    fireEvent.touchStart(universeContainer, {
      touches: [{ clientX: 100, clientY: 100 }]
    });

    // Simulate touch move
    fireEvent.touchMove(universeContainer, {
      touches: [{ clientX: 150, clientY: 120 }]
    });

    // In a real browser, requestAnimationFrame would trigger updateParallax.
    // In JSDOM, we might need to wait or rely on the fact that handleTouchMove 
    // should ideally apply changes immediately if we want high responsiveness.
    
    // Let's modify Universe3D to apply changes in handleTouchMove too for testing and snappiness.
    
    const camera = container.querySelector('.universe-camera');
    expect(camera.style.transform).toContain('rotate');
  });
});
