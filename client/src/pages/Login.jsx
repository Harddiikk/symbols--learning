import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // For now, simple mock login
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-liquid-bg">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-liquid-secondary/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-liquid-primary/30 blur-3xl pointer-events-none" />
      <div className="absolute top-[20%] right-[15%] w-[20vw] h-[20vw] rounded-full bg-liquid-success/20 blur-3xl pointer-events-none" />

      {/* Login Card */}
      <div className="glass-panel w-full max-w-md p-10 relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-liquid-primary to-liquid-accent flex items-center justify-center shadow-lg mb-6">
          <Mail className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-3xl font-semibold mb-2 text-center">PulseReach</h1>
        <p className="text-liquid-textMuted mb-8 text-center max-w-[280px]">
          Seamless cold email management and campaign intelligence.
        </p>

        <form onSubmit={handleLogin} className="w-full space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5 ml-1">Work Email</label>
            <input 
              type="email" 
              placeholder="you@company.com" 
              className="liquid-input" 
              defaultValue="admin@pulsereach.io"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 ml-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="liquid-input" 
              defaultValue="password123"
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full btn-primary flex items-center justify-center space-x-2 mt-4"
          >
            <span>Log In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
