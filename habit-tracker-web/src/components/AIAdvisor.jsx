import { useEffect, useState, useRef } from 'react'
import { getAIAdvice } from '../services/api'

function AIAdvisor({ tasks }) {
    const [userMessage, setUserMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const chatEndRef = useRef(null) //for chat auto scroll
    const textareaRef = useRef(null) //for textarea auto scroll

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth'})
    }, [messages, loading])

    const sendMessage = async () => {
        if (!userMessage.trim()) {
            setError('Please enter a question')
            return
        }
        const newUserMessage = { role: 'user', content: userMessage }
        const updatedMessages = [...messages, newUserMessage]
        setMessages(updatedMessages)
        setUserMessage('')
        setLoading(true)
        setError(null)

        try {
            const taskContent = tasks.map( t => 
                `- ${t.text} (${t.daily ? 'daily' : 'one-time'}, ${t.done ? 'completed' : 'pending completion'})`
            ).join('\n')

            const data = await getAIAdvice(taskContent, updatedMessages)
            
            const aiMessage = {
                role: 'assistant',
                content: data.advice
            }
            setMessages([...updatedMessages, aiMessage])
        } catch (err) {
            setError('Failed to get advice. Please try again.')
            console.error(err)
        }
        setLoading(false)
    }

    const handleKeyPress = (e) => {
        if(e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
    <div className="ai-advisor">
      <h3>Task Advisor</h3>
      
      {/* Chat history */}
      <div className="chat-history">
        {messages.length === 0 && !loading ? (
          <p className="chat-placeholder">Ask me anything about your tasks...</p>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`chat-message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}
            >
              <strong>{msg.role === 'user' ? 'You' : 'Blue Doggy'}:</strong>
              <p>{msg.content}</p>
            </div>
          ))
        )}
        {loading && <div className="loading-indicator"><em>Thinking...</em></div>}
        <div ref={chatEndRef} />
      </div>
      
      {error && <p className="error-message">{error}</p>}
      
      <div className="chat-input">
        <textarea
        ref={textareaRef}
        value={userMessage}
        onChange={(e) => {
          setUserMessage(e.target.value)
          // Auto-scroll textarea to bottom as user types
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.scrollTop = textareaRef.current.scrollHeight
            }
          }, 0)
        }}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
        rows="2"
        disabled={loading}
        />
      </div>

        <button 
          onClick={sendMessage} 
          disabled={loading || !userMessage.trim()}
          className="ai-buttons"
        >
          Send
        </button>

        <button
            onClick={() => setMessages([])}
            className="ai-buttons"
        >
        Clear Chat
        </button>
      </div>
  )
}

export default AIAdvisor