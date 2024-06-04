// src/App.tsx
import React, { useState, useEffect } from 'react'
import { ConnectForm } from './components/ConnectForm'
import { MessageList } from './components/MessageList'
import { MessageInput } from './components/MessageInput'
import { Message } from './types/message'

const App: React.FC = () => {
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [username, setUsername] = useState('')

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8083')

    socket.onopen = () => {
      console.log('Connected to WebSocket server')
      setWs(socket)
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'message') {
        setMessages((prevMessages) => [...prevMessages, data.message])
      }
    }

    socket.onclose = () => {
      console.log('Disconnected from WebSocket server')
    }

    return () => {
      socket.close()
    }
  }, [])

  const handleConnect = (username: string) => {
    if (ws) {
      ws.send(JSON.stringify({ type: 'connect', name: username }))
      setIsConnected(true)
      setUsername(username)
    }
  }

  const handleSendMessage = (content: string) => {
    if (ws) {
      ws.send(JSON.stringify({ type: 'message', id: username, content }))
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {!isConnected ? (
        <ConnectForm onConnect={handleConnect} />
      ) : (
        <>
          <MessageList messages={messages} />
          <MessageInput onSendMessage={handleSendMessage} />
        </>
      )}
    </div>
  )
}

export default App
