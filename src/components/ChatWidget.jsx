import { useState, useRef, useEffect } from 'react';
import './ChatWidget.css'; // Import the design system

const CONFIG = {
  webhookUrl: 'https://n8n.srv1384642.hstgr.cloud/webhook/cba8924b-5b5e-4c09-949f-0870a20b9e67/chat',
  businessName: 'NurtureClose',
  agentName: 'Sarah',
  tagline: 'Typically replies instantly',
  welcomeMsg: "Welcome, this is Sarah! How can I assist you today?",
  quickReplies: [],
  placeholder: 'Type your message…',
};

// Simple ID generator for the session
const getSessionId = () => {
  let sid = localStorage.getItem('kimberley_session');
  if (!sid) {
    sid = 'session_' + Math.random().toString(36).slice(2, 11);
    localStorage.setItem('kimberley_session', sid);
  }
  return sid;
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [unreadCount, setUnreadCount] = useState(1);
  const [quickReplies, setQuickReplies] = useState([]);
  
  const messagesEndRef = useRef(null);
  const sessionId = useRef(getSessionId());
  const initialized = useRef(false);

  // Scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, quickReplies]);

  // Initial welcome message
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Simulate connection delay
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages([{ role: 'bot', text: CONFIG.welcomeMsg, time: getTime() }]);
        setQuickReplies(CONFIG.quickReplies);
      }, 900);
    }, 400);
  }, []);

  const getTime = () => {
    return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const handleOpenToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const resetChat = () => {
    // Generate new session ID to clear n8n history context
    const newSession = 'session_' + Math.random().toString(36).slice(2, 11);
    localStorage.setItem('kimberley_session', newSession);
    sessionId.current = newSession;
    
    // Reset local UI state
    setMessages([{ role: 'bot', text: CONFIG.welcomeMsg, time: getTime() }]);
    setQuickReplies(CONFIG.quickReplies);
    setIsTyping(false);
  };

  const sendMessage = async (text) => {
    if (!text.trim() || isTyping) return;
    setIsOpen(true);

    // Remove any active quick replies immediately
    setQuickReplies([]);
    
    // Add User Message
    setMessages(prev => [...prev, { role: 'user', text: text.trim(), time: getTime() }]);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await fetch(CONFIG.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ chatInput: text, sessionId: sessionId.current }),
      });

      const rawText = await res.text();
      setIsTyping(false);

      let reply;
      try {
        const data = JSON.parse(rawText);
        if (data.type === 'error') {
          reply = "I'm sorry, I'm having trouble processing that right now. Please try again in a moment.";
        } else {
          reply = (Array.isArray(data) ? data[0]?.output : data.output)
            || data.reply || data.text || data.message
            || rawText;
        }
      } catch (_) {
        reply = rawText.trim() || "I'm sorry, I didn't catch that. Could you rephrase?";
      }

      setMessages(prev => [...prev, { role: 'bot', text: reply, time: getTime() }]);

      // Simple quick reply heuristic logic ported from original
      if (reply.toLowerCase().includes('new family') || reply.toLowerCase().includes('new or existing')) {
        setQuickReplies(["I'm a new family", "I'm an existing student/parent"]);
      }

      // If closed, increment notification badge
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }

    } catch (err) {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: "Sorry, I'm having a little trouble connecting. Please try again in a moment.", 
        time: getTime() 
      }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  // Helper to safely format text (bolding, line breaks, and list mapping)
  const formatText = (text) => {
    if (!text) return '';
    // Escape HTML first
    let escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // Bold matches
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert newlines to breaks
    const withBreaks = escaped.split('\\n').join('<br>').split('\n').join('<br>');
    
    // Convert hyphened lists to structured arrays for cleaner layout spacing
    // We isolate just the line with the hyphen to ensure subsequent paragraphs remain normal text
    return withBreaks.replace(/(?:<br>\s*-\s*|^\s*-\s*)(.*?)(?=<br>|$)/g, '<div class="list-item"><span>•</span> <span>$1</span></div>');
  };

  return (
    <div className="chat-widget-container">
      {/* Google Fonts specifically needed for this widget's design system */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=Playfair+Display:wght@400;500&display=swap" rel="stylesheet" />

      {/* Floating Trigger Button with Tooltip */}
      <div className={`embed-tooltip-wrap ${isOpen ? 'hidden' : ''}`}>
        <div className="embed-tooltip">How can I help you? 👋</div>
        <button className="embed-trigger" onClick={handleOpenToggle} aria-label="Chat with Sarah">
          <span className="trigger-avatar">S</span>
          {unreadCount > 0 && <span className="notif-dot">{unreadCount}</span>}
        </button>
      </div>

      {/* Main Chat Panel */}
      <div className={`embed-card ${isOpen ? 'open' : ''}`}>
        
        {/* Header */}
        <div className="chat-header">
          <div className="avatar-wrap">
            <div className="avatar">S</div>
            <div className="status-dot"></div>
          </div>
          <div className="header-text">
            <div className="header-name">{CONFIG.agentName}</div>
            <div className="header-sub">{CONFIG.tagline}</div>
          </div>
          <div className="header-actions">
            <button className="header-btn" onClick={resetChat} title="Reset Chat" aria-label="Reset Chat">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
            </button>
            <button className="header-btn" onClick={handleOpenToggle} title="Close Chat" aria-label="Close Chat">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Message Area */}
        <div className="messages">
          <div className="date-divider"><span>Today</span></div>
          
          {messages.map((msg, idx) => (
            <div key={idx} className={`msg-row ${msg.role}`}>
               {msg.role === 'bot' && <div className="msg-avatar">S</div>}
               <div>
                 <div className="bubble" dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />
                 <div className="msg-time">{msg.time}</div>
               </div>
            </div>
          ))}

          {/* Quick Replies */}
          {quickReplies.length > 0 && !isTyping && (
            <div className="quick-replies">
              {quickReplies.map((reply, idx) => (
                <button 
                  key={idx} 
                  className="chip" 
                  onClick={() => sendMessage(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="typing-row">
              <div className="msg-avatar">S</div>
              <div className="typing-bubble">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="input-area">
          <div className="input-row">
            <textarea
              className="chat-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={CONFIG.placeholder}
              rows={1}
              aria-label="Message Sarah"
            />
            <button 
              className="send-btn" 
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim()} 
              aria-label="Send"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
          <div className="input-footer">Powered by <a href="https://nurtureclose.com/" target="_blank" rel="noopener noreferrer">{CONFIG.businessName}</a></div>
        </div>
      </div>
    </div>
  );
}
