import { useState, useEffect } from 'react'
import { ConnectForm } from './components/ConnectForm'
import { MessageList } from './components/MessageList'
import { MessageInput } from './components/MessageInput'
import { Message } from './types/message'

export function App() {
  // Estado para armazenar a conexão WebSocket
  const [ws, setWs] = useState<WebSocket | null>(null)
  
  // Estado para armazenar a lista de mensagens
  const [messages, setMessages] = useState<Message[]>([])
  
  // Estado para controlar se o usuário está conectado
  const [isConnected, setIsConnected] = useState(false)
  
  // Estado para armazenar o nome de usuário
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

    // Evento disparado quando a conexão é fechada
    socket.onclose = () => {
      console.log('Disconnected from WebSocket server')
    }

    // Função de limpeza que fecha a conexão WebSocket quando o componente é desmontado
    return () => {
      socket.close()
    }
  }, [])

  // Função para lidar com a conexão do usuário
  const handleConnect = (username: string) => {
    if (ws) {
      // Envia uma mensagem do tipo 'connect' ao servidor WebSocket
      ws.send(JSON.stringify({ type: 'connect', name: username }))
      setIsConnected(true)
      setUsername(username)
    }
  }

  // Função para enviar uma mensagem de chat
  const handleSendMessage = (content: string) => {
    if (ws) {
      // Envia uma mensagem do tipo 'message' ao servidor WebSocket
      ws.send(JSON.stringify({ type: 'message', id: username, content }))
    }
  }

  // Renderiza a interface do usuário
  return (
    <div className="flex flex-col h-screen">
      {!isConnected ? (
        // Renderiza o formulário de conexão se o usuário não estiver conectado
        <ConnectForm onConnect={handleConnect} />
      ) : (
        <>
          // Renderiza a lista de mensagens e o campo de entrada de mensagem se o usuário estiver conectado
          <MessageList messages={messages} />
          <MessageInput onSendMessage={handleSendMessage} />
        </>
      )}
    </div>
  )
}