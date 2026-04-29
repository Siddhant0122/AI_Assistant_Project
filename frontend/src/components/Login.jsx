import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

export default function Login({ onAuth }){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try{
      const r = await api.post('/login', { email, password })
      onAuth?.(r.data)
      nav('/dashboard')
    }catch(err){
      alert(err?.response?.data?.msg || 'Login failed')
    }
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '24px',
        padding: '48px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
        width: '100%',
        maxWidth: '440px',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>Welcome Back</h2>
          <p style={{
            color: '#64748b',
            fontSize: '16px'
          }}>Sign in to your account</p>
        </div>

        <form onSubmit={submit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px', 
              color: '#374151',
              fontWeight: '600',
              marginBottom: '8px'
            }}>Email Address</label>
            <input 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              type="email" 
              required 
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '16px 20px',
                border: '2px solid #f1f5f9',
                borderRadius: '12px',
                outline: 'none',
                fontSize: '16px',
                backgroundColor: '#f8fafc',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box' 
                
              }}
              onFocus={(e)=>{ 
                e.target.style.borderColor = '#667eea'
                e.target.style.backgroundColor = '#ffffff'
                e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)'
              }}
              onBlur={(e)=>{ 
                e.target.style.borderColor = '#f1f5f9'
                e.target.style.backgroundColor = '#f8fafc'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px', 
              color: '#374151',
              fontWeight: '600',
              marginBottom: '8px'
            }}>Password</label>
            <input 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              type="password" 
              required 
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '16px 20px',
                border: '2px solid #f1f5f9',
                borderRadius: '12px',
                outline: 'none',
                fontSize: '16px',
                backgroundColor: '#f8fafc',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e)=>{ 
                e.target.style.borderColor = '#667eea'
                e.target.style.backgroundColor = '#ffffff'
                e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)'
              }}
              onBlur={(e)=>{ 
                e.target.style.borderColor = '#f1f5f9'
                e.target.style.backgroundColor = '#f8fafc'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          <button 
            type="submit" 
            style={{
              width: '100%',
              marginTop: '8px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '16px 20px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
            }}
            onMouseOver={(e)=>{
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 12px 28px rgba(102, 126, 234, 0.4)'
            }}
            onMouseOut={(e)=>{
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)'
            }}
          >
            Sign In
          </button>
        </form>

        <div style={{
          marginTop: '32px',
          fontSize: '16px',
          textAlign: 'center',
          color: '#64748b'
        }}>
          Don't have an account?{' '}
          <Link 
            to="/signup" 
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none', 
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
          >
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  )
}
