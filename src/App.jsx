import { useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { Sidebar } from './components/Sidebar'
import { ChatArea } from './components/ChatArea'
import './styles/main.scss'

const USERS_POOL = [
  { id: 1, name: 'Fiona', avatar: 'https://multoigri.ru/images/wiki-shrek-16.jpg' },
  { id: 2, name: 'Rumpelstiltskin', avatar: 'https://static.wikia.nocookie.net/shrek/images/3/33/Stiltskin.png/revision/latest/smart/width/250/height/250?cb=20240127172200&path-prefix=ru' },
  { id: 3, name: 'Fairy', avatar: 'https://upload.wikimedia.org/wikipedia/ru/thumb/a/ab/Fairy_Godmother_%28Shrek_2%29.png/330px-Fairy_Godmother_%28Shrek_2%29.png' }
]

const MOCK_DATA = [
  { id: 2718, sectionId: 2, text: 'Hello, what is the delivery time?', status: 'open', time: '4:20 am', date: '', elapsed: '16h', participants: [] },
  { id: 2717, sectionId: 2, text: 'Hi, do you have this item in stock?', status: 'closed', time: '1:33 am', date: '', elapsed: '', participants: [] },
  { id: 2716, sectionId: 2, text: 'Does this come in the colour blue?', status: 'closed', time: '11:30 pm', date: '10 Oct', elapsed: '', participants: [3] },
  { id: 2715, sectionId: 2, text: "My delivery hasn't arrived, what can I do?", status: 'open', time: '10:34 pm', date: '10 Oct', elapsed: '22h', participants: [] }
]

const App = () => {
  const [sections, setSections] = useLocalStorage('sections', [
    { id: 1, title: 'My Questions' },
    { id: 2, title: 'Messenger' },
    { id: 3, title: 'Community QA' },
    { id: 4, title: 'FAQ' }
  ])
  
  const [messages, setMessages] = useLocalStorage('messages', MOCK_DATA)
  const [activeId, setActiveId] = useState(2)
  const [inputText, setInputText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const filterLabels = { all: 'All Questions', open: 'Open', closed: 'Closed' }

  const sectionsWithCounts = sections.map(s => ({
    ...s,
    count: messages.filter(m => m.sectionId === s.id).length
  }))

  const handleAddSection = () => {
    const title = window.prompt('Section name:')
    if (title && title.trim()) {
      const id = Date.now()
      setSections([...sections, { id, title: title.trim() }])
      setActiveId(id)
      setIsSidebarOpen(false)
    }
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const newMessage = {
      id: Math.floor(Math.random() * 9000) + 1000,
      sectionId: activeId,
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: '10 Oct',
      elapsed: '1m',
      participants: [],
      status: 'open' 
    }

    setMessages([newMessage, ...messages])
    setInputText('')
  }

  const toggleParticipant = (messageId, userId) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        const participants = msg.participants || []
        const exists = participants.includes(userId)
        return {
          ...msg,
          participants: exists ? participants.filter(pId => pId !== userId) : [...participants, userId]
        }
      }
      return msg
    }))
  }

  const filteredMessages = messages
    .filter(m => m.sectionId === activeId)
    .filter(m => statusFilter === 'all' ? true : m.status === statusFilter)

  return (
    <div className="app-layout" onClick={() => {
      setIsFilterOpen(false)
      if (isSidebarOpen) setIsSidebarOpen(false)
    }}>
      <div className={`overlay ${isSidebarOpen ? 'show' : ''}`} />

      <Sidebar 
        sections={sectionsWithCounts} 
        activeId={activeId} 
        isOpen={isSidebarOpen}
        onSelect={(id) => {
          setActiveId(id)
          setIsSidebarOpen(false)
        }} 
        onAdd={handleAddSection} 
      />
      
      <main className="main-viewport">
        <header className="main-header">
          <div className="header-top">
            <button 
              className="burger-btn" 
              onClick={(e) => {
                e.stopPropagation()
                setIsSidebarOpen(!isSidebarOpen)
              }}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <h1>Questions Messenger</h1>
          </div>
          
          <div className="filter-dropdown-container" onClick={e => e.stopPropagation()}>
            <div className="filter-trigger" onClick={() => setIsFilterOpen(!isFilterOpen)}>
              {filterLabels[statusFilter]} <span className="arrow">▾</span>
            </div>
            {isFilterOpen && (
              <div className="filter-menu">
                {Object.entries(filterLabels).map(([key, label]) => (
                  <div key={key} className={`filter-option ${statusFilter === key ? 'active' : ''}`} onClick={() => { setStatusFilter(key); setIsFilterOpen(false); }}>
                    {label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </header>

        <ChatArea messages={filteredMessages} usersPool={USERS_POOL} onToggleUser={toggleParticipant} />

        <form className="message-form" onSubmit={handleSend} onClick={e => e.stopPropagation()}>
          <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Type your message..." />
          <button type="submit">Send Message</button>
        </form>
      </main>
    </div>
  )
}

export default App