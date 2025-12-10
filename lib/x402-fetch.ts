/**
 * x402 fetch wrapper that handles payment requirements
 * This is a simplified version that works with the x402 payment flow
 */

export async function fetchWithX402(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Make the request
  const response = await fetch(url, options);
  
  // If payment is required (402), return as-is so the caller can handle it
  if (response.status === 402) {
    return response;
  }
  
  // For other status codes, return the response
  return response;
}
