jest.mock('../src/services/tracker-ga4', () => ({
  trackGtag: jest.fn(),
}))
