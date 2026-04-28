import React from 'react';
import {
  Brain,
  Zap,
  LayoutDashboard,
  BookOpen,
  Star,
  History,
  LogOut,
  Send,
  Loader2,
  Flame,
} from 'lucide-react';

const Sidebar = ({
  authUser,
  xp,
  streak,
  completedModules,
  lessons,
  view,
  setView,
  handleLogout,
  chatHistory,
  chatInput,
  setChatInput,
  handleSendMessage,
  mentorLoading,
  chatEndRef,
  handleReset,
  isOpen,
  setIsOpen,
}) => {
  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static top-0 left-0 h-screen w-80 glass border-r border-white/5 flex flex-col shrink-0 overflow-hidden transition-transform duration-500 z-[1001]
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between pointer-events-auto">
          <div className="flex flex-col min-w-0">
            <h1 className="font-black text-base tracking-tighter leading-none truncate">
              {authUser?.displayName || 'TECH GRILL'}
            </h1>
            <h2 className="text-plasma text-[10px] font-bold tracking-widest uppercase truncate">
              {authUser?.email || 'Academy'}
            </h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-white/30 hover:text-plasma transition-all"
            >
              <Zap className="w-4 h-4 rotate-90" />
            </button>
            {/* Streak Badge */}
            {streak > 0 && (
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400"
                   title={`${streak}-dniowa seria!`}>
                <Flame className="w-3.5 h-3.5 fill-orange-400" />
                <span className="text-xs font-black">{streak}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              title="Wyloguj"
              className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      <div className="p-6 border-b border-white/5 pointer-events-auto">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-ghost/10 rounded-full flex items-center justify-center border border-white/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-ghost/50"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <div className="text-sm text-ghost/50 uppercase tracking-widest font-bold">Poziom 1</div>
            <div className="font-bold text-lg flex items-center gap-2 text-plasma-light">
              <Zap className="w-4 h-4 fill-plasma text-plasma" /> {xp} XP
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-ghost/70 mb-2">
            <span>Ukończone moduły</span>
            <span>
              {completedModules.length} / {lessons.length}
            </span>
          </div>
          <div className="h-2 bg-ghost/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-plasma transition-all duration-1000"
              style={{ width: `${(completedModules.length / lessons.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-1 pointer-events-auto">
        <button
          onClick={() => setView('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
            view === 'dashboard'
              ? 'bg-plasma text-void shadow-plasma-glow'
              : 'text-ghost/70 hover:bg-white/5 hover:text-ghost'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" /> Dashboard
        </button>
        <button
          onClick={() => setView('knowledge')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
            view === 'knowledge'
              ? 'bg-plasma text-void shadow-plasma-glow'
              : 'text-ghost/70 hover:bg-white/5 hover:text-ghost'
          }`}
        >
          <BookOpen className="w-5 h-5" /> Moja Wiedza
        </button>
        <button
          onClick={() => setView('favorites')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
            view === 'favorites'
              ? 'bg-plasma text-void shadow-plasma-glow'
              : 'text-ghost/70 hover:bg-white/5 hover:text-ghost'
          }`}
        >
          <Star className="w-5 h-5" /> Ulubione
        </button>
        <button
          onClick={() => setView('history')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
            view === 'history'
              ? 'bg-plasma text-void shadow-plasma-glow'
              : 'text-ghost/70 hover:bg-white/5 hover:text-ghost'
          }`}
        >
          <History className="w-5 h-5" /> Historia
        </button>
      </div>

      <div className="flex-1 border-t border-white/5 mt-auto flex flex-col overflow-hidden bg-plasma/5 pointer-events-auto">
        <div className="p-4 border-b border-white/5 bg-void text-xs font-bold tracking-widest uppercase text-plasma flex items-center gap-2">
          <Brain className="w-4 h-4" /> AI Mentor
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm scrollbar-hide">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`px-4 py-2 rounded-2xl max-w-[90%] whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-plasma text-void font-medium rounded-br-sm'
                    : 'bg-ghost/10 text-ghost rounded-bl-sm border border-white/5'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-void shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Zapytaj mentora (np. 'zmień muzykę')"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={mentorLoading}
              className="w-full bg-ghost/5 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-ghost focus:outline-none focus:border-plasma transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={mentorLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-ghost/50 hover:text-plasma transition-colors p-2 disabled:opacity-50"
            >
              {mentorLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </form>

        <div className="p-4 bg-void border-t border-white/5">
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] text-red-500/40 hover:text-red-500 hover:bg-red-500/5 transition-all"
          >
            <Zap className="w-3 h-3" /> Resetuj System AI
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
