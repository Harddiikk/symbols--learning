import { useState } from 'react';
import { LayoutDashboard, Users, Send, Settings, LogOut, Search, Plus, Filter, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LeadTable from '../components/LeadTable';
import UploadModal from '../components/UploadModal';
import ChatWidget from '../components/ChatWidget';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('leads');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads Map', icon: Users },
    { id: 'campaigns', label: 'Campaigns', icon: Send },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-liquid-bg flex overflow-hidden">
      {/* Background Blobs for Dashboard */}
      <div className="fixed top-0 right-0 w-[50vw] h-[50vw] rounded-full bg-liquid-primary/10 blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-liquid-secondary/10 blur-[120px] pointer-events-none" />

      {/* Sidebar */}
      <aside className="w-[280px] h-screen glass-panel rounded-none border-t-0 border-b-0 border-l-0 border-r flex flex-col relative z-20">
        <div className="p-8 pb-4">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-liquid-primary to-liquid-accent">
            PulseReach
          </h2>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-liquid-primary/15 text-liquid-primaryHover font-medium shadow-sm' 
                    : 'text-liquid-textMuted hover:bg-white/50 hover:text-liquid-text'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-liquid-primaryHover' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-liquid-border/50">
          <button 
            onClick={() => navigate('/login')}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-liquid-textMuted hover:bg-red-50 hover:text-red-500 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen flex flex-col relative z-10 overflow-hidden">
        {/* Header */}
        <header className="h-[88px] px-8 flex items-center justify-between border-b border-liquid-border/50 bg-white/30 backdrop-blur-md">
          <div className="relative w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-liquid-textMuted" />
            <input 
              type="text" 
              placeholder="Search leads or campaigns..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="liquid-input pl-10 bg-white/60 focus:bg-white"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="btn-secondary flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Import Leads</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {activeTab === 'leads' && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-semibold text-liquid-text">Leads Pipeline</h1>
                    <p className="text-liquid-textMuted mt-1">Manage, filter, and review scraped leads.</p>
                  </div>
                  <div className="flex space-x-3">
                    <button className="p-2 rounded-xl bg-white/60 border border-liquid-border text-liquid-textMuted hover:text-liquid-text hover:bg-white transition-all shadow-sm">
                      <Filter className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Data Table Container */}
                <div className="glass-panel p-1 min-h-[500px]">
                  <LeadTable searchQuery={searchQuery} />
                </div>
              </>
            )}

            {activeTab === 'overview' && (
              <div className="glass-panel p-1 min-h-[500px]">
                <div className="w-full h-full rounded-[18px] bg-white/40 border border-white/20 p-8 flex items-center justify-center flex-col">
                  <LayoutDashboard className="w-12 h-12 text-liquid-primary/30 mb-4" />
                  <h2 className="text-2xl font-medium text-liquid-text mb-2">Overview Dashboard</h2>
                  <p className="text-liquid-textMuted text-lg">High-level metrics and charts will appear here.</p>
                </div>
              </div>
            )}

            {activeTab === 'campaigns' && (
              <div className="glass-panel p-1 min-h-[500px]">
                <div className="w-full h-full rounded-[18px] bg-white/40 border border-white/20 p-8 flex items-center justify-center flex-col">
                  <Send className="w-12 h-12 text-liquid-primary/30 mb-4" />
                  <h2 className="text-2xl font-medium text-liquid-text mb-2">Campaign Management</h2>
                  <p className="text-liquid-textMuted text-lg">Review and edit active email sequences and icebreakers here.</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-semibold text-liquid-text">System Settings</h1>
                    <p className="text-liquid-textMuted mt-1">Configure your workspace integrations and API keys.</p>
                  </div>
                </div>

                <div className="glass-panel p-8 max-w-3xl space-y-8">
                  {/* n8n Integration */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 border-b border-liquid-border/50 pb-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                        <Settings className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-liquid-text">n8n Webhook Integration</h3>
                        <p className="text-sm text-liquid-textMuted">Send enriched leads from n8n directly to this dashboard.</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-liquid-text ml-1">Inbound Webhook URL</label>
                      <input 
                        type="url" 
                        placeholder="https://your-n8n-instance.com/webhook/..." 
                        className="liquid-input font-mono text-sm"
                        defaultValue="https://n8n.example.com/webhook/pulse-reach-inbound"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button className="btn-secondary text-sm">Test Connection</button>
                    </div>
                  </div>

                  {/* Instantly.ai Integration */}
                  <div className="space-y-4 pt-4 border-t border-liquid-border/50">
                    <div className="flex items-center space-x-3 border-b border-liquid-border/50 pb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Send className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-liquid-text">Instantly.ai Integration</h3>
                        <p className="text-sm text-liquid-textMuted">Connect your Instantly workspace for campaign syncing.</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-liquid-text ml-1">API Key</label>
                      <input 
                        type="password" 
                        placeholder="inst_..." 
                        className="liquid-input font-mono text-sm"
                        defaultValue="inst_mock_api_key_12345"
                      />
                    </div>
                  </div>

                  {/* Google Sheets Integration */}
                  <div className="space-y-4 pt-4 border-t border-liquid-border/50">
                    <div className="flex items-center space-x-3 border-b border-liquid-border/50 pb-3">
                      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                        <LayoutDashboard className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-liquid-text">Google Sheets Export</h3>
                        <p className="text-sm text-liquid-textMuted">Configure the destination sheet for manual exports.</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-liquid-text ml-1">Target Spreadsheet ID</label>
                      <input 
                        type="text" 
                        placeholder="1BxiMVs0XRYFgwnLEUKkqYQtk3V..." 
                        className="liquid-input font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-liquid-border/50 flex justify-end space-x-4">
                    <button className="btn-secondary">Cancel</button>
                    <button className="btn-primary">Save Configuration</button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        onUploadComplete={(data) => {
          console.log("Parsed CSV Data:", data);
          // Here we would typically push this to the LeadTable state or Backend API
        }}
      />
      
      <ChatWidget />
    </div>
  );
}
