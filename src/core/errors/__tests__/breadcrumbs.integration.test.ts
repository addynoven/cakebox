import { describe, expect, it, beforeEach } from 'bun:test';
import { addBreadcrumb, getBreadcrumbs, clearBreadcrumbs } from '../breadcrumbs';
import { captureError, AppError } from '../error-handler';

describe('Flight Recorder Breadcrumbs Integration', () => {
  beforeEach(() => {
    clearBreadcrumbs();
  });

  it('should record user actions and preserve order', () => {
    addBreadcrumb('navigation', 'Navigated to Home');
    addBreadcrumb('ui', 'Tapped on Red Velvet Cake');
    addBreadcrumb('cart', 'Added cake to cart', { quantity: 1 });

    const crumbs = getBreadcrumbs();
    expect(crumbs.length).toBe(3);
    expect(crumbs[0].message).toBe('Navigated to Home');
    expect(crumbs[1].message).toBe('Tapped on Red Velvet Cake');
    expect(crumbs[2].category).toBe('cart');
  });

  it('should enforce circular buffer cap at 50 breadcrumbs', () => {
    for (let i = 1; i <= 60; i++) {
      addBreadcrumb('ui', `Action #${i}`);
    }

    const crumbs = getBreadcrumbs();
    expect(crumbs.length).toBe(50);
    expect(crumbs[0].message).toBe('Action #11');
    expect(crumbs[49].message).toBe('Action #60');
  });

  it('should attach flight recorder breadcrumbs to captured errors', () => {
    addBreadcrumb('auth', 'User signed in');
    addBreadcrumb('network', 'Fetching cakes catalog');

    const error = captureError(new Error('Network connection timeout'), {
      source: 'TestCatalog',
      action: 'fetch',
    });

    expect(error).toBeInstanceOf(AppError);
    expect(error.context?.breadcrumbs).toBeDefined();
    expect(error.context?.breadcrumbs?.length).toBeGreaterThanOrEqual(2);
  });
});
