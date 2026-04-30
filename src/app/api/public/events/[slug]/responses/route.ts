import { createPublicResponse } from "@/lib/events/public-service";

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  return createPublicResponse(slug, request);
}

