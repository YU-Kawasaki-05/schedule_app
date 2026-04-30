import { getMyPublicResponse } from "@/lib/events/public-service";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  return getMyPublicResponse(slug, request);
}

