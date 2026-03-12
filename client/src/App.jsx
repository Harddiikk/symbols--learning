import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col items-center justify-center font-['DM_Sans']">
      <div className="text-center max-w-2xl px-6 -mt-20">
        <h1 className="text-5xl font-['Playfair_Display'] font-medium text-[#2C2C2C] mb-6">Welcome to Symbols Learning</h1>
        <p className="text-xl text-[#666660]">Our virtual assistant Kimberley is here to help! Click the chat icon in the bottom right corner to get started with booking your consultation or answering any questions you may have.</p>
      </div>
      <ChatWidget />
    </div>
  );
}

export default App;
