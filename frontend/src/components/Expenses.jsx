import React, { useEffect, useMemo, useState } from 'react'
import api from '../api'

export default function Expenses(){
  const [list, setList] = useState([])
  const [item, setItem] = useState('')
  const [amount, setAmount] = useState('')

  async function load(){ 
    const r = await api.get('/expenses'); 
    setList(r.data) 
  }
  useEffect(()=>{ load() }, [])

  async function add(){
    const r = await api.post('/expenses', { item, amount: Number(amount) })
    setList(l => [...l, r.data]); 
    setItem(''); 
    setAmount('')
  }

  async function del(id){ 
    await api.delete('/expenses/'+id); 
    setList(l=>l.filter(x=>x._id!==id)) 
  }

  async function update(id, patch){
    const r = await api.put('/expenses/'+id, patch)
    setList(l => l.map(x => x._id===id ? r.data : x))
  }

  const daily = useMemo(()=>{
    const map = {}
    list.forEach(e => { 
      const d = e.date; 
      map[d] = (map[d]||0) + Number(e.amount||0) 
    })
    return Object.entries(map).sort(([a],[b])=>a.localeCompare(b))
  }, [list])

  return (
    <div style={{
      maxWidth: 1200, 
      margin: '40px auto', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      color: '#1a202c',
      padding: '0 20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      paddingTop: '60px'
    }}>
      <h2 style={{
        marginBottom: 32,
        fontSize: '2.5rem',
        fontWeight: 800,
        color: '#ffffff',
        textAlign: 'center',
        textShadow: '0 4px 12px rgba(0,0,0,0.3)',
        letterSpacing: '-0.025em'
      }}>💰 Expenses</h2>
      
      <div style={{
        borderRadius: 24,
        padding: '32px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        border: '1px solid rgba(255,255,255,0.3)',
        background: 'transparent'    
      }}>
        {/* Input Row */}
        <div style={{
          display: 'flex', 
          gap: 16,
          marginBottom: 24,
          flexWrap: 'wrap'
        }}>
          <input 
            placeholder="Item" 
            value={item} 
            onChange={e=>setItem(e.target.value)} 
            style={inputStyle}
          />
          <input 
            placeholder="Amount" 
            type="number" 
            value={amount} 
            onChange={e=>setAmount(e.target.value)} 
            style={{...inputStyle, maxWidth: '200px'}}
          />
          <button style={btnPrimary} onClick={add}>Add</button>
        </div>

        {/* Table */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <table style={tableStyle}>
            <thead>
              <tr style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                color: 'white'
              }}>
                <th style={thtd}>Date</th>
                <th style={thtd}>Item</th>
                <th style={thtd}>Amount (₹)</th>
                <th style={thtd}></th>
              </tr>
            </thead>
            <tbody>
              {list.map(e => (
                <tr key={e._id} style={{
                  background: '#f8fafc',
                  transition: 'all 0.2s ease'
                }}>
                  <td style={thtd}>{e.date}</td>
                  <td 
                    style={editableStyle} 
                    contentEditable 
                    suppressContentEditableWarning 
                    onBlur={ev=>update(e._id,{item: ev.target.textContent})}
                  >{e.item}</td>
                  <td 
                    style={editableStyle} 
                    contentEditable 
                    suppressContentEditableWarning 
                    onBlur={ev=>update(e._id,{amount: Number(ev.target.textContent)})}
                  >{e.amount}</td>
                  <td style={thtd}>
                    <button style={btn} onClick={()=>del(e._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chart */}
        <div style={{
          marginTop: 32,
          borderRadius: 16,
          padding: '24px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
          background: 'rgba(255,255,255,0.95)'  
        }}>
          <h4 style={{
            marginBottom: 20,
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#1a202c'
          }}>Spending Over Time</h4>
          <SimpleLine data={daily} />
        </div>
      </div>
    </div>
  )
}


const inputStyle = {
  flex: 1,
  padding: '16px 20px',
  border: '2px solid #e2e8f0',
  borderRadius: 16,
  fontSize: '16px',
  fontWeight: 500,
  background: '#ffffff',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  outline: 'none',
  minWidth: '200px'
}

const btn = {
  padding: '8px 16px',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  background: '#f87171',
  color: 'white',
  fontSize: '12px',
  fontWeight: 600,
  transition: 'all 0.3s ease'
}

const btnPrimary = {
  padding: '16px 32px',
  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
  color: '#ffffff',
  border: 'none',
  fontWeight: 700,
  fontSize: '16px',
  borderRadius: 12,
  cursor: 'pointer',
  boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)',
  transition: 'all 0.3s ease'
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 15
}

const thtd = {
  padding: '16px 20px',
  borderBottom: '1px solid #e2e8f0',
  textAlign: 'left',
  fontWeight: 600
}

const editableStyle = {
  ...thtd,
  background: 'rgba(249, 250, 251, 0.8)',
  borderRadius: 8,
  cursor: 'text',
  transition: 'all 0.2s ease'
}

function SimpleLine({ data }){
  const w = 800, h = 250, pad = 50
  const xs = data.map(d=>d[0])
  const ys = data.map(d=>d[1])
  const minY = 0
  const maxY = Math.max(1, ...ys)
  const scaleX = (i) => pad + (i * (w - 2*pad)) / Math.max(1, data.length - 1)
  const scaleY = (v) => h - pad - ((v - minY) * (h - 2*pad)) / (maxY - minY)
  const points = data.map((d,i)=>`${scaleX(i)},${scaleY(d[1])}`).join(' ')

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
      borderRadius: 16,
      padding: '24px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.08)'
    }}>
      <svg viewBox={`0 0 ${w} ${h}`} style={{width:'100%', height: 280}}>
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="1"/>
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="1"/>
          </linearGradient>
        </defs>
        
        <polyline 
          fill="none" 
          stroke="url(#lineGradient)" 
          strokeWidth="4" 
          points={points}
          strokeLinecap="round"
        />
        
        {data.map((d,i)=> (
          <g key={i}>
            <circle 
              cx={scaleX(i)} 
              cy={scaleY(d[1])} 
              r="6" 
              fill="#b41010ff"
              stroke="url(#lineGradient)"
              strokeWidth="3"
            />
            <circle cx={scaleX(i)} cy={scaleY(d[1])} r="3" fill="url(#lineGradient)" />
            <text x={scaleX(i)} y={h-15} fontSize="12" textAnchor="middle" fill="#64748b" fontWeight="600">
              {d[0].slice(5)}
            </text>
            <text x={scaleX(i)} y={scaleY(d[1]) - 15} fontSize="12" textAnchor="middle" fill="#4f46e5" fontWeight="700">
              ₹{d[1]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
