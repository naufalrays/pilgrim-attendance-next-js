interface User {
  id: string;
  name: string;
  username: string;
  phone_number: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

interface Recipient {
  id: string;
  name: string;
}

interface Message {
  id: number;
  sender_id: string;
  sender_name?: string;
  subject: string;
  message: string;
  created_at: string;
  recipients: Recipient[];
}

interface RequestSendMessage {
    sender_id: string;
    recipients_ids: string[];
    subject: string;
    message: string;
  }