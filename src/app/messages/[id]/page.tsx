import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ApiError, apiGet } from '@/lib/api';
import type { MessageResponse } from '@/types/message';
import MessageDetailContent from '@/components/MessageDetailContent';
import { APP_CONFIG } from '@/config';

/**
 * App Router idiom: `generateMetadata` is the dynamic counterpart to the
 * static `metadata` export. It receives the same `params` Promise the page
 * does, so the `<title>` reflects the actual route. Renders before the page
 * body — the browser tab updates as soon as the id resolves.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return { title: `Message #${id} — ${APP_CONFIG.app.title}` };
}

/**
 * Public detail view for a single message — `GET /v2/messages/:id`.
 *
 * Lecture point: this file lives at `[id]/page.tsx`, which makes the segment a
 * *dynamic route parameter*. Next.js passes the resolved value in the `params`
 * prop. In Next 15 `params` is a Promise (it can depend on async work in
 * middleware/headers) so it must be `await`ed before use.
 *
 * This is a server component — the fetch runs on the server and rendered HTML
 * ships to the client. There is a sibling route at `/messages/view/[id]` under
 * `(dashboard)` that demos the same `params` pattern inside the signed-in
 * shell; both pages render via `MessageDetailContent`.
 */
export default async function MessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const messageId = Number(id);
  if (!Number.isInteger(messageId) || messageId <= 0) {
    notFound();
  }

  let message;
  try {
    const response = await apiGet<MessageResponse>(`/v2/messages/${messageId}`);
    message = response.data;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }

  return (
    <MessageDetailContent
      message={message}
      rawId={id}
      backHref={APP_CONFIG.routes.messagesPublic}
      backLabel="All messages"
      redirectAfterDelete={APP_CONFIG.routes.messagesPublic}
    />
  );
}
