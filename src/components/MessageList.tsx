import { Message } from '../types/message';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="p-4 flex-1 overflow-y-auto">
      {messages.map((msg, index) => (
        <div key={index} className="mb-2">
          <strong>{msg.id}</strong>: {msg.content} <em>({msg.timestamp})</em>
        </div>
      ))}
    </div>
  );
}

export default MessageList;
