import React from 'react'

export default function Features(){
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      paddingTop: '20px'
    }}>
        <div style={{maxWidth:900, margin:'20px auto', fontFamily:'Arial, sans-serif', color:'#1f2937'}}>
      <div style={{
        background:'rgba(255, 255, 255, 0.95)',
        borderRadius:20,
        padding:'48px',
        boxShadow:'0 20px 40px rgba(0, 0, 0, 0.1)',
        backdropFilter:'blur(10px)',
        border:'1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h2 style={{marginBottom:16, fontSize:'48px', fontWeight:'bold', background:'linear-gradient(135deg, #8b5cf6, #a855f7)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', textAlign:'center'}}>Features</h2>
        <ul style={{listStyle:'none', padding:0, margin:0, lineHeight:1.6}}>
          <li style={liStyle}>✅ Text chat with history sidebar</li>
          <li style={liStyle}>🎤 Voice input & output (browser STT/TTS)</li>
          <li style={liStyle}>💰 Expenses with CRUD and spending chart</li>
          <li style={liStyle}>📝 To-Do</li>
          <li style={liStyle}>⏰ Reminders with time-based alerts</li>
          <li style={liStyle}>🖼️ Image generation </li>
          <li style={liStyle}>🔒 Session-based auth (no JWT)</li>
        </ul>
      </div>
    </div>
    </div>

    
  )
}

const liStyle = {
  marginBottom: '12px',
  padding: '12px 16px',
  background: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  fontSize: '15px',
  fontWeight: '500'
}
