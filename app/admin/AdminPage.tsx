'use client';
import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { NotificationDashboard } from '@/components/admin/NotificationDashboard';

export default function AdminPage() {
  const [authenticated,setAuthenticated]=useState(false);
  const [checking,setChecking]=useState(true);
  const [token,setToken]=useState('');
  const [error,setError]=useState('');

  const check=async()=>{
    try{
      const r=await fetch('/api/v1/admin/auth',{cache:'no-store'});
      setAuthenticated(r.ok);
    } finally { setChecking(false); }
  };
  useEffect(()=>{ check(); },[]);

  const login=async(e:React.FormEvent)=>{
    e.preventDefault(); setError('');
    try{
      const r=await fetch('/api/v1/admin/auth',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({token})
      });
      const j=await r.json();
      if(!r.ok||!j.success) throw new Error(j.error||'Login failed');
      setToken('');
      setAuthenticated(true);
    }catch(err){ setError(err instanceof Error?err.message:'Login failed'); }
  };

  const logout=async()=>{
    await fetch('/api/v1/admin/auth',{method:'DELETE'});
    setAuthenticated(false);
  };

  return <>
    <Header lang="en" onLangChange={()=>{}}/>
    <main id="main-content" className="min-h-screen bg-cream pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {checking ? <div className="h-64 bg-navy-100/60 rounded animate-pulse"/> :
        authenticated ? <div>
          <div className="flex justify-end mb-5"><button onClick={logout} className="btn-ghost">Sign out</button></div>
          <NotificationDashboard />
        </div> :
        <form onSubmit={login} className="max-w-md mx-auto bg-navy-950 p-7 border border-gold-500/20">
          <p className="text-gold-500 text-xs uppercase tracking-[0.2em]">VedRith Admin</p>
          <h1 className="font-serif text-4xl text-cream-100 font-light mt-2">Secure access</h1>
          <p className="text-cream-100/50 text-sm mt-3">Enter the server-configured admin token. The session is stored in an HttpOnly cookie.</p>
          <input value={token} onChange={e=>setToken(e.target.value)} type="password" autoComplete="current-password" className="vedrith-input mt-5" placeholder="Admin token" required/>
          <button className="btn-gold w-full justify-center mt-4">Sign in</button>
          {error&&<p className="text-sm text-red-300 mt-3">{error}</p>}
        </form>}
      </div>
    </main>
    <Footer lang="en"/>
  </>;
}
