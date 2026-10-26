import '@testing-library/jest-dom';

// Mock matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock HTMLMediaElement.prototype.play and pause
window.HTMLMediaElement.prototype.play = () => Promise.resolve();
window.HTMLMediaElement.prototype.pause = () => {};

// Mock URL.createObjectURL and revokeObjectURL
window.URL.createObjectURL = () => 'blob:mock-url';
window.URL.revokeObjectURL = () => {};

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = () => {};
