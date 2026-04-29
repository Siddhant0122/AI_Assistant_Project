import React, { useEffect, useState } from 'react'
import api from '../api'

export default function Reminders(){
  const [list, setList] = useState([])
  const [text, setText] = useState('')
  const [datetime, setDatetime] = useState('')

  async function load(){ 
    const r = await api.get('/reminders'); 
    setList(r.data) 
  }
  useEffect(()=>{ load() }, [])

  useEffect(()=>{
    const id = setInterval(()=>{
      const now = Date.now()
      list.forEach(r => {
        const t = new Date(r.datetime).getTime()
        if(Math.abs(t - now) < 60*1000){ 
          alert(`⏰ Reminder: ${r.text}`) 
        }
      })
    }, 30000)
    return ()=>clearInterval(id)
  }, [list])

  async function add(){ 
    if(!text || !datetime) return
    const r = await api.post('/reminders', { text, datetime }) 
    setList(l=>[...l, r.data]) 
    setText('') 
    setDatetime('') 
  }
  async function update(id, patch){ 
    const r = await api.put('/reminders/'+id, patch) 
    setList(l=>l.map(x=>x._id===id? r.data: x)) 
  }
  async function del(id){ 
    await api.delete('/reminders/'+id) 
    setList(l=>l.filter(x=>x._id!==id)) 
  }

  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        <h2 style={{marginBottom: '40px', fontSize: '48px', fontWeight: '700', color: '#ffffff', textAlign: 'center', letterSpacing: '-0.02em'}}>Reminders</h2>
        <p style={{textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)', fontSize: '18px', marginBottom: '40px'}}>Manage your reminders with ease</p>

        {/* Input Card */}
        <div style={{marginBottom: '32px', padding: '32px', backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)', border: 'none'}}>
          <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '20px', alignItems: 'center'}}>
            <input 
              placeholder="What do you need to be reminded about?" 
              value={text} 
              onChange={e=>setText(e.target.value)}
              style={{padding: '16px 20px', border: '2px solid #f1f5f9', borderRadius: '12px', fontSize: '16px', backgroundColor: '#f8fafc', outline: 'none', transition: 'all 0.3s ease'}}
              onFocus={e => {e.target.style.borderColor = '#667eea'; e.target.style.backgroundColor = '#ffffff'}}
              onBlur={e => {e.target.style.borderColor = '#f1f5f9'; e.target.style.backgroundColor = '#f8fafc'}}
            />
            <input 
              type="datetime-local" 
              value={datetime} 
              onChange={e=>setDatetime(e.target.value)}
              style={{padding: '16px 20px', border: '2px solid #f1f5f9', borderRadius: '12px', fontSize: '16px', backgroundColor: '#f8fafc', outline: 'none', transition: 'all 0.3s ease'}}
              onFocus={e => {e.target.style.borderColor = '#667eea'; e.target.style.backgroundColor = '#ffffff'}}
              onBlur={e => {e.target.style.borderColor = '#f1f5f9'; e.target.style.backgroundColor = '#f8fafc'}}
            />
            <button 
              onClick={add}
              style={{padding: '16px 32px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'}}
              onMouseOver={e => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.target.style.transform = 'translateY(0)'}
            >
              + Add Reminder
            </button>
          </div>
        </div>

        {/* List Card */}
        <div style={{backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)', overflow: 'hidden'}}>
          <div style={{padding: '32px 32px 0 32px'}}>
            <h3 style={{fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '24px'}}>Your Reminders</h3>
          </div>
          
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0'}}>
                <th style={{width: '200px', padding: '20px 32px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase'}}>When</th>
                <th style={{padding: '20px 32px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase'}}>Reminder</th>
                <th style={{width: '120px', padding: '20px 32px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 && (
                <tr>
                  <td colSpan="3" style={{textAlign: 'center', padding: '60px 32px', color: '#64748b', fontSize: '16px'}}>
                    <div style={{fontSize: '48px', marginBottom: '16px'}}>📝</div>
                    <div>No reminders yet. Create your first reminder above!</div>
                  </td>
                </tr>
              )}
              {list.map(r => (
                <tr key={r._id} style={{borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s ease'}} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{padding: '20px 32px'}}>
                    <input 
                      type="datetime-local" 
                      value={r.datetime?.slice(0,16)} 
                      onChange={e=>update(r._id,{datetime: e.target.value})}
                      style={{padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', backgroundColor: '#ffffff', outline: 'none', width: '100%', transition: 'all 0.2s ease'}}
                      onFocus={e => e.target.style.borderColor = '#667eea'}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </td>
                  <td 
                    contentEditable 
                    suppressContentEditableWarning 
                    onBlur={ev=>update(r._id,{text: ev.target.textContent})}
                    style={{cursor: 'text', padding: '20px 32px', fontSize: '16px', color: '#1f2937', lineHeight: '1.6', outline: 'none', borderRadius: '8px', transition: 'all 0.2s ease', minHeight: '24px'}}
                    onFocus={e => e.target.style.backgroundColor = '#f8fafc'}
                  >
                    {r.text}
                  </td>
                  <td style={{padding: '20px 32px', textAlign: 'center'}}>
                    <button 
                      onClick={()=>del(r._id)}
                      style={{padding: '10px 20px', background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)'}}
                      onMouseOver={e => {e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 6px 16px rgba(255, 107, 107, 0.4)'}}
                      onMouseOut={e => {e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.3)'}}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
