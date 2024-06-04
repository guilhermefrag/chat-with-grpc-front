import { useState } from 'react';

interface ConnectFormProps {
  onConnect: (username: string) => void;
}

export function ConnectForm({ onConnect }: ConnectFormProps) {
  const [username, setUsername] = useState('');

  const handleConnect = () => {
    if (username) {
      onConnect(username);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <button
        onClick={handleConnect}
        className="p-2 bg-blue-500 text-white rounded"
      >
        Connect
      </button>
    </div>
  );
}

