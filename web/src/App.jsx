import { useState, useEffect } from 'react'
import axios from 'axios'

const API = '/api'

export default function App() {
  const [health, setHealth] = useState(null)
  const [users, setUsers] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    axios.get('/health').then(r => setHealth(r.data)).catch(() => setError('Backend unreachable'))
    axios.get(`${API}/users`).then(r => setUsers(r.data)).catch(() => {})
  }, [])

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <header style={{ background: '#2ecc71', color: '#fff', padding: '16px 24px', borderRadius: 12, marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>👹 Gremlin Health</h1>
        <p style={{ opacity: 0.85, marginTop: 4 }}>Admin Dashboard</p>
      </header>

      {error && (
        <div style={{ background: '#fee', border: '1px solid #e74c3c', borderRadius: 8, padding: 16, marginBottom: 16, color: '#e74c3c' }}>
          ❌ {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card title="Backend Status">
          {health ? (
            <span style={{ color: '#2ecc71', fontWeight: 600 }}>✅ Online v{health.version}</span>
          ) : (
            <span style={{ color: '#95a5a6' }}>⏳ Checking...</span>
          )}
        </Card>
        <Card title="Users">
          <span style={{ fontSize: 32, fontWeight: 700, color: '#2ecc71' }}>{users.length}</span>
        </Card>
      </div>

      <Card title="Users List">
        {users.length === 0 ? (
          <p style={{ color: '#95a5a6' }}>No users yet</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ecf0f1' }}>
                <th style={th}>ID</th>
                <th style={th}>Username</th>
                <th style={th}>Email</th>
                <th style={th}>Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                  <td style={td}>{u.id}</td>
                  <td style={td}>{u.username}</td>
                  <td style={td}>{u.email}</td>
                  <td style={td}>{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <a href="/docs" style={{ color: '#3498db', textDecoration: 'none' }}>📖 API Docs (Swagger)</a>
      </div>
    </div>
  )
}

function Card({ title, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <h3 style={{ fontSize: 13, color: '#95a5a6', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>{title}</h3>
      {children}
    </div>
  )
}

const th = { textAlign: 'left', padding: '8px 12px', fontSize: 13, color: '#7f8c8d', fontWeight: 600 }
const td = { padding: '10px 12px', fontSize: 14 }
