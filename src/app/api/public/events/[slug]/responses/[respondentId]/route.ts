import { updatePublicResponse } from "@/lib/events/public-service";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ respondentId: string; slug: string }> }
) {
  const { respondentId, slug } = await context.params;
  return updatePublicResponse(slug, respondentId, request);
}

