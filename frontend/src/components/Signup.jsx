import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'
import './Signup.css'   

export default function Signup(){
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const nav = useNavigate()


const submit = async (e) => {
e.preventDefault()
try{
await api.post('/signup', { email, password })
alert('Account created! Please login.')
nav('/login')
}catch(err){
alert(err?.response?.data?.msg || 'Signup failed')
}
}


return (
<div className="container">
<div className="card" style={{maxWidth:420, margin:"24px auto"}}>
<h2>Sign up</h2>
<form onSubmit={submit} className="grid" style={{gridTemplateColumns:'1fr'}}>
<label className="label">Email</label>
<input value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
<label className="label">Password</label>
<input value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
<button className="btn primary" type="submit">Create account</button>
</form>
<div className="small" style={{marginTop:8}}>Have an account? <Link to="/login">Login</Link></div>
</div>
</div>
)
}