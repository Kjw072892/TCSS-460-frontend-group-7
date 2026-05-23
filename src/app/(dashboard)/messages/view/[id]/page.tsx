import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ApiError, apiGet } from '@/lib/api';
import type { MessageResponse } from '@/types/message';
import MessageDetailContent from '@/components/MessageDetailContent';
import { APP_CONFIG } from '@/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return { title: `Message #${id} — ${APP_CONFIG.app.title}` };
}

/**
 * Dashboard detail view for a single message — sibling of the public
 * `/messages/[id]` page. Both pages demo the same dynamic-route-param
 * pattern (`await params`) and share `MessageDetailContent` for layout;
 * this version lives inside the `(dashboard)` group so the DashboardShell
 * cascades and the back-link points to the authenticated list.
 *
 * Middleware gates this URL via `src/middleware.ts` — the matcher includes
 * `/messages/view/:id`.
 */
export default async function DashboardMessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
      backHref={APP_CONFIG.routes.messagesView}
      backLabel="Back to Read Messages"
      redirectAfterDelete={APP_CONFIG.routes.messagesView}
    />
  );
}
