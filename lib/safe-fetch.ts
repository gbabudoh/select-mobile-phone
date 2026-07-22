/**
 * Helper utility to safely parse JSON responses from fetch calls.
 * Prevents "Unexpected token '<', '<!DOCTYPE '... is not valid JSON" errors when
 * an API endpoint returns an HTML error page, 404, 500, or redirect response.
 */

export async function safeFetchJson<T = any>(res: Response): Promise<T | null> {
  try {
    const contentType = res.headers.get("content-type");
    if (contentType && !contentType.includes("application/json")) {
      return null;
    }
    const text = await res.text();
    if (!text || text.trim().startsWith("<")) {
      return null;
    }
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
