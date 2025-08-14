export interface Conversation {
  id: string;
  participant_ids: string[];
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string;
  created_at: string;
  read_at?: string;
}

