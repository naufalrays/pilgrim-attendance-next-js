interface User {
  id: number;
  name: string;
  username: string;
  phone_number: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface Recipient {
  id: number;
  name: string;
}

interface Message {
  id: number;
  senderId: number;
  senderName?: string;
  subject: string;
  message: string;
  createdAt: string;
  recipients: Recipient[];
}

interface RequestSendMessage {
    senderId: number;
    recipientIds: number[];
    subject: string;
    message: string;
  }