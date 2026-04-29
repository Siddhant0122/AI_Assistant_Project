import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import api from '../api'

export default function Navbar({ authed }){
  const nav = useNavigate()
  const logout = async () => { 
    await api.post('/logout'); 
    nav('/login') 
  }

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      padding: '16px 24px',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        
        {/* Left links */}
        <div style={{
          display: 'flex', 
          gap: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          padding: '8px',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)'
        }}>
          <NavLink 
            to="/" 
            end
            style={({isActive}) => ({
              textDecoration: 'none',
              color: '#ffffff',
              fontWeight: '500',
              fontSize: '15px',
              padding: '12px 20px',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
              backdropFilter: isActive ? 'blur(10px)' : 'none',
              border: isActive ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent'
            })}
          >
            Product
          </NavLink>
          <NavLink 
            to="/features"
            style={({isActive}) => ({
              textDecoration: 'none',
              color: '#ffffff',
              fontWeight: '500',
              fontSize: '15px',
              padding: '12px 20px',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
              backdropFilter: isActive ? 'blur(10px)' : 'none',
              border: isActive ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent'
            })}
          >
            Features
          </NavLink>
          
          <NavLink 
            to="/chat"
            style={({isActive}) => ({
              textDecoration: 'none',
              color: '#ffffff',
              fontWeight: '500',
              fontSize: '15px',
              padding: '12px 20px',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
              backdropFilter: isActive ? 'blur(10px)' : 'none',
              border: isActive ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent'
            })}
          >
            Chat
          </NavLink>
          <NavLink 
            to="/dashboard"
            style={({isActive}) => ({
              textDecoration: 'none',
              color: '#ffffff',
              fontWeight: '500',
              fontSize: '15px',
              padding: '12px 20px',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
              backdropFilter: isActive ? 'blur(10px)' : 'none',
              border: isActive ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent'
            })}
          >
            Dashboard
          </NavLink>
        </div>

        {/* Right button */}
        <div>
          {authed ? (
            <button 
              onClick={logout}
              style={{
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px',
                boxShadow: '0 4px 16px rgba(255, 107, 107, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={e => {e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 24px rgba(255, 107, 107, 0.4)'}}
              onMouseOut={e => {e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 16px rgba(255, 107, 107, 0.3)'}}
            >
              Logout
            </button>
          ) : (
            <button 
              onClick={() => nav('/login')}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={e => {e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'; e.target.style.transform = 'translateY(-2px)'}}
              onMouseOut={e => {e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; e.target.style.transform = 'translateY(0)'}}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
