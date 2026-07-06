import { useState } from 'react'
import { Card } from '../ui/Card'

export const ChatArea = ({ messages, usersPool, onToggleUser, onToggleStatus }) => {
    const [activeMenu, setActiveMenu] = useState(null)

    return (
        <div className="chat-area" onClick={() => setActiveMenu(null)}>
            {messages.map(msg => (
                <Card key={msg.id}>
                    <div className="msg-content">

                        <div className={`status-badge ${msg.status}`} onClick={(e) => { e.stopPropagation(); onToggleStatus(msg.id) }}>
                            <div className="id-part">Q{msg.id}</div>
                            <div className="status-part">
                                {msg.status === 'closed' ? (
                                    <><span className="check">✔</span><span className="label">Closed</span></>
                                ) : (
                                    <span className="elapsed">{msg.elapsed || 'now'}</span>
                                )}
                            </div>
                        </div>

                        <div className="text-section">
                            <p className="message-text">{msg.text}</p>
                            <div className="meta-info">Guest {msg.time} {msg.date && `- ${msg.date}`}</div>
                        </div>

                        <div className="participants-section">
                            <div className="added-users">
                                {usersPool
                                    .filter(u => msg.participants?.includes(u.id))
                                    .map(u => (
                                        <img key={u.id} src={u.avatar} className="mini-avatar" alt={u.name} />
                                    ))
                                }
                            </div>

                            <div className="plus-container" onClick={e => e.stopPropagation()}>
                                <button
                                    className={`action-btn ${msg.participants?.length > 0 ? 'has-count' : 'is-plus'}`}
                                    onClick={() => setActiveMenu(activeMenu === msg.id ? null : msg.id)}
                                >
                                    {msg.participants?.length > 0 ? msg.participants.length : '+'}
                                </button>

                                {activeMenu === msg.id && (
                                    <div className="user-pool-dropdown">
                                        {usersPool.map(user => (
                                            <div
                                                key={user.id}
                                                className={`user-option ${msg.participants?.includes(user.id) ? 'selected' : ''}`}
                                                onClick={() => onToggleUser(msg.id, user.id)}
                                            >
                                                <img src={user.avatar} alt="" />
                                                <span>{user.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </Card>
            ))}
        </div>
    )
}