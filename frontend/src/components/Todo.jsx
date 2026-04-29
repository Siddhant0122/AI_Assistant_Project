import React, { useEffect, useState } from 'react'
import api from '../api'

export default function Todo(){
  const [list, setList] = useState([])
  const [task, setTask] = useState('')
  const [deadline, setDeadline] = useState('')
  const [important, setImportant] = useState(false)

  
  async function load(){
    try {
      const r = await api.get('/todos')
      setList(r.data)
    } catch (err) {
      alert('Failed to load todos')
    }
  }
  useEffect(()=>{ load() }, [])

  
  async function add(){
    if(!task.trim()) return
    const r = await api.post('/todos', { task, deadline, important })
    setList(l => [...l, r.data])
    setTask('')
    setDeadline('')
    setImportant(false)
  }


  async function update(id, patch){
    const r = await api.put('/todos/'+id, patch)
    setList(l => l.map(x => x._id === id ? r.data : x))
  }


  async function del(id){
    await api.delete('/todos/'+id)
    setList(l => l.filter(x => x._id !== id))
  }

  return (
    <div style={{
      display:'flex',
      justifyContent:'center',
      alignItems:'flex-start',
      minHeight:'100vh',
      background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding:'40px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{
        background:'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius:'24px',
        padding:'32px',
        boxShadow:'0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.2)',
        width:'100%',
        maxWidth:'700px',
        border: '1px solid rgba(255,255,255,0.3)'
      }}>
        <h2 style={{
          fontSize:'2.5rem',
          marginBottom:'32px',
          textAlign:'center',
          color:'#1e293b',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.025em'
        }}>📝 To-Do List</h2>

        {/* Add Task Form */}
        <div style={{
          display:'grid',
          gridTemplateColumns:'2fr 1fr auto auto',
          gap:'16px',
          marginBottom:'32px',
          padding: '24px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
          borderRadius: '20px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <input 
            placeholder="What needs to be done?"
            value={task}
            onChange={e=>setTask(e.target.value)}
            style={{
              padding:'16px 20px',
              border:'2px solid #e2e8f0',
              borderRadius:'16px',
              fontSize:'16px',
              fontWeight: 500,
              background: '#ffffff',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              outline: 'none'
            }}
          />
          <input 
            type="date"
            value={deadline}
            onChange={e=>setDeadline(e.target.value)}
            style={{
              padding:'16px 20px',
              border:'2px solid #e2e8f0',
              borderRadius:'16px',
              fontSize:'14px',
              fontWeight: 500,
              background: '#ffffff',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              outline: 'none',
              color: '#64748b'
            }}
          />
          <label style={{
            display:'flex',
            alignItems:'center',
            gap:'8px',
            fontSize:'14px',
            color:'#475569',
            fontWeight: 600,
            padding: '8px 16px',
            background: 'rgba(79, 70, 229, 0.1)',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}>
            <input 
              type="checkbox" 
              checked={important} 
              onChange={e=>setImportant(e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                cursor: 'pointer'
              }}
            />
            ⭐ Important
          </label>
          <button onClick={add} style={{
            background:'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            color:'#fff',
            border:'none',
            borderRadius:'16px',
            padding:'16px 24px',
            fontSize:'16px',
            fontWeight:'700',
            cursor:'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)',
            transform: 'translateY(0)'
          }}>Add Task</button>
        </div>

        {/* Task List */}
        <ul style={{listStyle:'none', padding:0, margin:0}}>
          {list.map((t, index) => (
            <li key={t._id} style={{
              display:'grid',
              gridTemplateColumns:'auto 1fr auto auto',
              alignItems:'center',
              gap:'16px',
              padding:'20px',
              borderBottom: index === list.length - 1 ? 'none' : '1px solid rgba(226, 232, 240, 0.6)',
              background: index % 2 === 0 ? 'rgba(248, 250, 252, 0.5)' : 'rgba(255, 255, 255, 0.8)',
              borderRadius: '12px',
              margin: '8px 0',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: '1px solid rgba(226, 232, 240, 0.3)'
            }}>
              <input 
                type="checkbox" 
                checked={t.done} 
                onChange={e=>update(t._id, {done: e.target.checked})}
                style={{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                  accentColor: '#4f46e5'
                }}
              />
              <div>
                <div 
                  contentEditable 
                  suppressContentEditableWarning
                  onBlur={ev=>update(t._id,{task:ev.target.textContent})}
                  style={{
                    fontSize:'16px',
                    color: t.done ? '#94a3b8' : '#0f172a',
                    textDecoration: t.done ? 'line-through' : 'none',
                    fontWeight: t.important ? '700' : '500',
                    marginBottom: '6px',
                    cursor: 'text',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: 'rgba(249, 250, 251, 0.8)',
                    border: '2px solid transparent',
                    transition: 'all 0.2s ease',
                    lineHeight: 1.4
                  }}
                >
                  {t.task}
                </div>
                <small style={{
                  color:'#64748b', 
                  fontSize:'12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'rgba(100, 116, 139, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '8px',
                }}>
                  ⏰ {t.deadline || 'No deadline'}
                </small>
              </div>
              <span style={{
                fontSize:'12px',
                color: t.important ? '#dc2626' : 'transparent',
                fontWeight: 700,
                background: t.important ? 'rgba(220, 38, 38, 0.1)' : 'transparent',
                padding: t.important ? '6px 12px' : '0',
                borderRadius: t.important ? '8px' : '0',
                transition: 'all 0.3s ease'
              }}>
                {t.important ? '⭐ Priority' : ''}
              </span>
              <button onClick={()=>del(t._id)} style={{
                background:'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color:'#fff',
                border:'none',
                borderRadius:'10px',
                padding:'8px 16px',
                fontSize:'12px',
                fontWeight: 600,
                cursor:'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 8px rgba(239, 68, 68, 0.3)',
                transform: 'translateY(0)'
              }}>🗑️ Delete</button>
            </li>
          ))}
          {list.length === 0 && (
            <li style={{
              textAlign: 'center',
              padding: '40px',
              color: '#94a3b8',
              fontSize: '18px',
              fontWeight: 500,
              background: 'rgba(248, 250, 252, 0.5)',
              borderRadius: '16px',
              border: '2px dashed #e2e8f0'
            }}>
              📋 No tasks yet. Add one above to get started!
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
