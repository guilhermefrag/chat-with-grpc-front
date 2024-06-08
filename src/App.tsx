import { useState, useEffect } from 'react'
import { ConnectForm } from './components/ConnectForm'
import { MessageList } from './components/MessageList'
import { MessageInput } from './components/MessageInput'
import { Message } from './types/message'

export function App() {
  const [ws, setWs] = useState<WebSocket | null>(null)
  
  // State para armazenar a lista de mensagens
  const [messages, setMessages] = useState<Message[]>([])
  
  // State para controlar se o usuário está conectado
  const [isConnected, setIsConnected] = useState(false)
  
  // State para armazenar o nome de usuário
  const [username, setUsername] = useState('')

  // useEffect para estabelecer a conexão WebSocket
  useEffect(() => {
    // Cria uma nova conexão WebSocket
    const socket = new WebSocket('ws://localhost:8083')

    // Evento disparado quando a conexão é aberta
    socket.onopen = () => {
      console.log('Connected to WebSocket server')
      setWs(socket)
    }

    // Evento disparado ao receber uma mensagem do servidor WebSocket
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

  // Função para lidar com a conexão do usuário
  const handleConnect = (username: string) => {
    if (ws) {
      ws.send(JSON.stringify({ type: 'connect', name: username }))
      setIsConnected(true)
      setUsername(username)
    }
  }

  // Função para enviar uma mensagem de chat
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