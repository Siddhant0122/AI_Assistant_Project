import React, { useEffect, useRef, useState } from 'react'
import api from '../api'

export default function Chat(){
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const scroller = useRef()

  useEffect(() => { loadHistory() }, [])
  useEffect(() => { scroller.current?.scrollTo(0, scroller.current.scrollHeight) }, [messages])

  async function loadHistory(){
    const r = await api.get('/chat/history')
    setMessages(r.data.reverse().map(d => ([{from:'user', text:d.query}, {from:'bot', text:d.response}])).flat())
  }

  async function send(){
    if(!query.trim()) return
    setMessages(m => [...m, {from:'user', text: query}])
    setQuery('')
    const r = await api.post('/chat', { query })
    setMessages(m => [...m, {from:'bot', text: r.data.response}])
  }

  function startVoice(){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  if(!SR) return alert('SpeechRecognition not supported in this browser.')

  const rec = new SR()
  rec.lang = 'en-IN'
  rec.interimResults = false
  rec.continuous = false

  rec.onresult = (e) => {
    const transcript = e.results[0][0].transcript
    setQuery(transcript)
  }

  rec.onend = async () => {
    if(query.trim()){   
      await send()
      const lastBotMsg = messages[messages.length-1]?.text || ''
      if(lastBotMsg) speak(lastBotMsg)
    }
  }

  rec.onerror = () => alert('Voice error')
  rec.start()
}

function speak(text){
  if(!('speechSynthesis' in window)) return

  const synth = window.speechSynthesis
  synth.cancel() 

  const ut = new SpeechSynthesisUtterance(text)
  ut.lang = 'en-IN'

  
  const voices = synth.getVoices()
  const female = voices.find(v => /female|woman|Google UK English Female|en-GB/.test(v.name))
  if(female) ut.voice = female
    synth.speak(ut)
}

  return (
    <div style={{
      maxWidth: "1400px", 
      margin: "0 auto", 
      padding: "24px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh"
    }}>
      <div style={{
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "24px",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        borderRadius: "20px",
        padding: "20px 32px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
      }}>
        <h1 style={{
          margin: 0,
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: "32px",
          fontWeight: "700",
          letterSpacing: "-0.02em"
        }}>AI Assistant</h1>
        <button 
          style={{
            padding: "12px 24px",
            borderRadius: "16px",
            border: "none",
            cursor: "pointer",
            background: showHistory ? "linear-gradient(135deg, #667eea, #764ba2)" : "rgba(102, 126, 234, 0.1)",
            color: showHistory ? "#fff" : "#667eea",
            fontWeight: "600",
            fontSize: "14px",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: showHistory ? "0 4px 16px rgba(102, 126, 234, 0.3)" : "0 2px 8px rgba(102, 126, 234, 0.1)"
          }} 
          onClick={()=>setShowHistory(s=>!s)}
        >
          📚 History
        </button>
      </div>

      <div style={{
        display: "grid", 
        gridTemplateColumns: showHistory ? '2fr 1fr' : '1fr', 
        gap: "24px"
      }}>
        {/* Chat Section */}
        <div style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          padding: "32px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)"
        }}>
          <div ref={scroller} style={{
            maxHeight: "500px",
            overflowY: "auto",
            padding: "16px 0",
            scrollbarWidth: "thin",
            scrollbarColor: "#667eea #f1f5f9"
          }}>
            {messages.map((m,i)=> 
              <div 
                key={i} 
                style={{
                  display: "flex", 
                  justifyContent: m.from==='user'? "flex-end":"flex-start",
                  margin: "16px 0",
                  animation: "slideIn 0.3s ease-out"
                }}
              >
                <div style={{
                  padding: "16px 20px",
                  borderRadius: "20px",
                  maxWidth: "75%",
                  background: m.from==='user'? 
                    "linear-gradient(135deg, #667eea, #764ba2)" : 
                    "linear-gradient(135deg, #f8fafc, #e2e8f0)",
                  color: m.from==='user'? "#fff":"#334155",
                  boxShadow: m.from==='user'? 
                    "0 8px 24px rgba(102, 126, 234, 0.3)" : 
                    "0 4px 16px rgba(0, 0, 0, 0.1)",
                  fontSize: "15px",
                  lineHeight: "1.6",
                  fontWeight: "500",
                  transform: "scale(1)",
                  transition: "transform 0.2s ease",
                  whiteSpace: "pre-line"
                }}>
                  {m.text}
                </div>
              </div>
            )}
          </div>

          <div style={{
            display:"flex", 
            gap: "12px", 
            marginTop: "24px",
            background: "rgba(248, 250, 252, 0.8)",
            padding: "20px",
            borderRadius: "20px",
            border: "1px solid rgba(226, 232, 240, 0.8)"
          }}>
            <input 
              value={query} 
              onChange={e=>setQuery(e.target.value)} 
              placeholder="Ask me anything... ✨" 
              onKeyDown={e=>{if(e.key==='Enter') send()}}
              style={{
                flex: 1,
                padding: "16px 20px",
                borderRadius: "16px",
                border: "2px solid transparent",
                background: "#fff",
                fontSize: "15px",
                fontWeight: "500",
                outline: "none",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
              }}
            />
            <button style={{
              padding: "16px 32px",
              border: "none",
              borderRadius: "16px",
              cursor: "pointer",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "#fff",
              fontWeight: "600",
              fontSize: "15px",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
              transform: "scale(1)"
            }} onClick={send}>Send</button>
            <button style={{
              padding: "16px 20px",
              border: "2px solid #e2e8f0",
              borderRadius: "16px",
              cursor: "pointer",
              background: "#fff",
              fontSize: "18px",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
            }} onClick={startVoice}>🎤</button>
            <button style={{
              padding: "16px 20px",
              border: "2px solid #e2e8f0",
              borderRadius: "16px",
              cursor: "pointer",
              background: "#fff",
              fontSize: "18px",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
            }} onClick={()=>speak(messages[messages.length-1]?.text || '')}>🔊</button>
          </div>

          <div style={{
            display:"flex", 
            gap: "16px", 
            marginTop: "24px"
          }}>
            <ImageGenerator />
          </div>
        </div>

        {/* History Section */}
        {showHistory && (
          <div style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)"
          }}>
            <h3 style={{
              marginTop:0,
              marginBottom: "24px",
              color: "#334155",
              fontSize: "20px",
              fontWeight: "700"
            }}>Chat History</h3>
            <HistoryList />
          </div>
        )}
      </div>
    </div>
  )
}

function HistoryList(){
  const [hist, setHist] = useState([])
  useEffect(()=>{ api.get('/chat/history').then(r=>setHist(r.data)) }, [])
  
  return (
    <div style={{
      maxHeight: "400px", 
      overflow: 'auto',
      scrollbarWidth: "thin",
      scrollbarColor: "#667eea #f1f5f9"
    }}>
      {hist.map(h => (
        <div key={h._id} style={{
          borderBottom:'1px solid rgba(226, 232, 240, 0.8)', 
          padding:'16px 0',
          transition: "all 0.2s ease"
        }}>
          <div style={{
            fontSize: "12px", 
            color:"#64748b",
            marginBottom: "8px",
            fontWeight: "500"
          }}>
            {new Date(h.createdAt).toLocaleString()}
          </div>
          <div style={{
            marginBottom: "8px",
            fontSize: "14px",
            lineHeight: "1.5"
          }}>
            <strong style={{color: "#667eea"}}>Q:</strong> 
            <span style={{marginLeft: "8px", color: "#334155"}}>{h.query}</span>
          </div>
          <div style={{
            fontSize: "14px",
            lineHeight: "1.5"
          }}>
            <strong style={{color: "#764ba2"}}>A:</strong> 
            <span style={{marginLeft: "8px", color: "#475569"}}>{h.response}</span>
          </div>
        </div>
      ))}
    </div>
  )
}




function ImageGenerator(){
  const [prompt, setPrompt] = useState('')
  const [url, setUrl] = useState('')
  
  const gen = async () => {
    if(!prompt.trim()) return
    const r = await api.post('/image/generate', { prompt })
    setUrl(r.data.url)
  }
  
  return (
    <div style={{
      flex: 1,
      background: "linear-gradient(135deg, rgba(248, 250, 252, 0.9), rgba(241, 245, 249, 0.9))",
      backdropFilter: "blur(10px)",
      padding: "20px",
      borderRadius: "20px",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
      border: "1px solid rgba(226, 232, 240, 0.5)"
    }}>
      <div style={{
        fontSize: "14px", 
        color: "#64748b",
        fontWeight: "600",
        marginBottom: "12px"
      }}>
        🎨 Image Generation
      </div>
      <input 
        value={prompt} 
        onChange={e=>setPrompt(e.target.value)} 
        placeholder="A serene lake at sunrise..."
        style={{
          width: "96.5%",
          padding: "12px 16px",
          borderRadius: "12px",
          border: "2px solid #e2e8f0",
          background: "#fff",
          fontSize: "14px",
          marginBottom: "12px",
          outline: "none",
          transition: "border-color 0.3s ease"
        }}
      />
      <button 
        style={{
          width: "100%",
          padding: "12px 16px",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          background: "linear-gradient(135deg, #10b981, #059669)",
          color: "#fff",
          fontWeight: "600",
          fontSize: "14px",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 16px rgba(16, 185, 129, 0.3)"
        }} 
        onClick={gen}
      >
        Generate ✨
      </button>
      {url && (
        <div style={{marginTop: "16px"}}>
          <img 
            src={url} 
            alt="generated" 
            style={{
              maxWidth:'100%', 
              borderRadius:'12px',
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)"
            }}
          />
        </div>
      )}
    </div>
  )
}
