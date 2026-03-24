export function getOriginDomain (origin) {
  const normalizedOrigin = origin.trim().toLowerCase();

  try {
    return new URL(normalizedOrigin).hostname;
  } catch (err) {
    // Some clients may send Origin without protocol, e.g. google.com instead of https://google.com
    return new URL(`http://${normalizedOrigin}`).hostname;
  }
};