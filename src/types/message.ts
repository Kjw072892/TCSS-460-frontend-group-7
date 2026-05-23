import type { Priority } from './priority';

/**
 * Shape of a message returned by `GET /v2/messages` on `backend-3`.
 * `author` is included via Prisma `include` on the server.
 */
export interface Message {
  id: number;
  content: string;
  subject: string | null;
  priority: Priority;
  read: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: number;
    username: string;
  };
}

/**
 * Shape of `GET /v2/messages` — list with pagination metadata.
 */
export interface MessagesListResponse {
  data: Message[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Shape of `POST /v2/messages` and `GET /v2/messages/:id`.
 */
export interface MessageResponse {
  data: Message;
}
