import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ProductPage(){
  const nav = useNavigate()
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        padding: '48px 40px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        maxWidth: '900px',
        width: '100%',
        textAlign: 'center',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Octa-AI Assistant
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: '#64748b',
            fontWeight: '400'
          }}>
            Your all-in-one personal AI assistant – free for everyone.
          </p>
        </div>

        {/* Features Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            padding: '32px 24px',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.1)',
            textAlign: 'left',
            border: '1px solid rgba(102, 126, 234, 0.1)'
          }}>
            <h3 style={{ marginBottom: '12px', color: '#667eea', fontSize: '1.5rem', fontWeight: '600' }}>
              Smart Chat
            </h3>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.6' }}>
              Have natural conversations, get answers, and manage your daily queries with ease.
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(118, 75, 162, 0.05) 0%, rgba(102, 126, 234, 0.05) 100%)',
            padding: '32px 24px',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(118, 75, 162, 0.1)',
            textAlign: 'left',
            border: '1px solid rgba(118, 75, 162, 0.1)'
          }}>
            <h3 style={{ marginBottom: '12px', color: '#764ba2', fontSize: '1.5rem', fontWeight: '600' }}>
              Productivity Tools
            </h3>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.6' }}>
              Manage tasks, expenses, reminders, and to-do lists – all in one place.
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            padding: '32px 24px',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.1)',
            textAlign: 'left',
            border: '1px solid rgba(102, 126, 234, 0.1)'
          }}>
            <h3 style={{ marginBottom: '12px', color: '#667eea', fontSize: '1.5rem', fontWeight: '600' }}>
              Insights & Analytics
            </h3>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.6' }}>
              Visualize spending trends and analyze your activities with smart charts.
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(118, 75, 162, 0.05) 0%, rgba(102, 126, 234, 0.05) 100%)',
            padding: '32px 24px',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(118, 75, 162, 0.1)',
            textAlign: 'left',
            border: '1px solid rgba(118, 75, 162, 0.1)'
          }}>
            <h3 style={{ marginBottom: '12px', color: '#764ba2', fontSize: '1.5rem', fontWeight: '600' }}>
              Creativity Tools
            </h3>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.6' }}>
              Generate images, get creative suggestions, and explore AI-powered assistance.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <button 
          onClick={() => nav('/signup')}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '1.125rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.39)',
            transform: 'translateY(0)'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 8px 25px 0 rgba(102, 126, 234, 0.5)'
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 4px 14px 0 rgba(102, 126, 234, 0.39)'
          }}
          onMouseDown={(e) => {
            e.target.style.transform = 'translateY(1px)'
          }}
          onMouseUp={(e) => {
            e.target.style.transform = 'translateY(-2px)'
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  )
}
