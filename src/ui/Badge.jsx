export const Badge = ({ children, time }) => (
  <div className="badge-wrapper">
    <div className="badge-id">{children}</div>
    {time && <div className="badge-time">{time}</div>}
  </div>
)