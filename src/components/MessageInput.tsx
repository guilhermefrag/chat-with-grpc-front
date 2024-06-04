import { useState } from 'react'

interface MessageInputProps {
  onSendMessage: (content: string) => void
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [input, setInput] = useState('')

  const handleSendMessage = () => {
    if (input) {
      onSendMessage(input)
      setInput('')
    }
  }

  return (
    <div className="p-4 flex">
      <input
        type="text"
        placeholder="Enter message"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 p-2 border border-gray-300 rounded mr-2"
      />
      <button
        onClick={handleSendMessage}
        className="p-2 bg-green-500 text-white rounded"
      >
        Send
      </button>
    </div>
  )
}

export default MessageInput
