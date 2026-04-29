import React, { useEffect, useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'

export default function Dashboard(){
  const [stats, setStats] = useState({
    chats: 0,
    expenses: 0,
    todos: 0,
    reminders: 0,
    predictedExpense: 0    
  })

  const nav = useNavigate()

  useEffect(() => { 
    api.get('/api/dashboard').then(r => {
      setStats(prev => ({
        ...prev,
        ...r.data   
      }))
    }) 
  }, [])

  const Card = ({title, value, to, icon, gradient}) => (
    <div 
      onClick={()=>nav(to)} 
      style={{
        cursor:'pointer',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'translateY(0)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={e=>{
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)'
      }}
      onMouseLeave={e=>{
        e.currentTarget.style.transform = 'translateY(0) scale(1)'
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: gradient,
        borderRadius: '24px 24px 0 0'
      }} />
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        <div style={{
          fontSize: '16px', 
          color: '#64748b',
          fontWeight: '600',
          letterSpacing: '0.025em'
        }}>
          {title}
        </div>
        <div style={{
          fontSize: '24px',
          opacity: 0.7
        }}>
          {icon}
        </div>
      </div>
      
      <div style={{
        fontSize: '48px', 
        fontWeight: '800', 
        background: gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: '1',
        marginBottom: '8px'
      }}>
        {value}
      </div>
      
      <div style={{
        fontSize: '14px',
        color: '#94a3b8',
        fontWeight: '500'
      }}>
        Click to view details →
      </div>
    </div>
  )

  const cardData = [
    {
      title: "Chats Today",
      value: stats.chats,
      to: "/chat",
      icon: "💬",
      gradient: "linear-gradient(135deg, #667eea, #764ba2)"
    },
    {
      title: "Today's Expense",
      value: `₹${stats.expenses}`,
      to: "/expenses",
      icon: "💰",
      gradient: "linear-gradient(135deg, #f093fb, #f5576c)"
    },
    {
      title: "Predicted Tomorrow's Expense",
      value: `₹${stats.predictedExpense}`,  
      to: "/expenses",
      icon: "📈",
      gradient: "linear-gradient(135deg, #43e97b, #38f9d7)"
    },
    {
      title: "Open Tasks",
      value: stats.todos,
      to: "/todo",
      icon: "✅",
      gradient: "linear-gradient(135deg, #4facfe, #00f2fe)"
    },
    {
      title: "Reminders",
      value: stats.reminders,
      to: "/reminders",
      icon: "🔔",
      gradient: "linear-gradient(135deg, #43e97b, #38f9d7)"
    }
  ]

  return (
    <div style={{
      maxWidth: '1400px', 
      margin: '0 auto', 
      padding: '24px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '32px',
        marginBottom: '32px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h1 style={{
          margin: 0,
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '48px',
          fontWeight: '800',
          letterSpacing: '-0.02em',
          textAlign: 'center'
        }}>
          Dashboard
        </h1>
        <p style={{
          margin: '12px 0 0 0',
          fontSize: '18px',
          color: '#64748b',
          textAlign: 'center',
          fontWeight: '500'
        }}>
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        animation: 'fadeIn 0.6s ease-out'
      }}>
        {cardData.map((card, index) => (
          <div
            key={card.title}
            style={{
              animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`
            }}
          >
            <Card {...card} />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{
        marginTop: '32px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h3 style={{
          margin: '0 0 24px 0',
          color: '#334155',
          fontSize: '24px',
          fontWeight: '700'
        }}>
          Quick Actions
        </h3>
        <div style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          {[
            { label: 'New Chat', to: '/chat', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
            { label: 'Add Expense', to: '/expenses', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
            { label: 'Create Task', to: '/todo', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
            { label: 'Set Reminder', to: '/reminders', gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)' }
          ].map(action => (
            <button
              key={action.label}
              onClick={() => nav(action.to)}
              style={{
                padding: '16px 32px',
                border: 'none',
                borderRadius: '16px',
                background: action.gradient,
                color: '#fff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                transform: 'scale(1)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.05)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)'
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
