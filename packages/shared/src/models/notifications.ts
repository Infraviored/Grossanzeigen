export interface Notification {
  id: string;
  user_id: string;
  type: string;
  payload: unknown;
  read_at?: string;
}

