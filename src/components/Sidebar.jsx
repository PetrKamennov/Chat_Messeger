export const Sidebar = ({ sections, activeId, onSelect, onAdd, isOpen }) => (
  <aside 
    className={`sidebar ${isOpen ? 'open' : ''}`} 
    onClick={e => e.stopPropagation()}
  >
    <div className="user-profile">
      <img className="avatar"  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh2n_xXL9kFvaQPdfsxRJaWLgnEiRJoY8yy7O4WK1EbLlL0Jyp1yzo8MQ&s=10" alt=""/>
      <div className="user-info">
        <div className="name">David Hill</div>
        <div className="status">online</div>
      </div>
      <button className="add-section-btn" onClick={onAdd}>+</button>
    </div>

    <nav className="menu">
      <div className="menu-header">
        <span>MESSAGES</span>
        <span className="history">history</span>
      </div>
      
      <div className="menu-list">
        {sections.map(s => (
          <div 
            key={s.id}
            className={`menu-item ${activeId === s.id ? 'active' : ''}`}
            onClick={() => onSelect(s.id)}
          >
            <span className="icon">💻</span>
            <span className="text">
              {s.title} <span className="count">({s.count})</span>
            </span>
          </div>
        ))}
      </div>
    </nav>
  </aside>
)