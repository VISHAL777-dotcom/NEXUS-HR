import { useCallback, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import CommandPalette from '../command/CommandPalette';
import AIAssistant from '../ai/AIAssistant';

export default function AppShell() {
  const [cmdkOpen, setCmdkOpen] = useState(false);

  const openCmdk = useCallback(() => setCmdkOpen(true), []);
  const closeCmdk = useCallback(() => setCmdkOpen(false), []);

  useEffect(() => {
    function handleKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openCmdk();
      }
      if (e.key === 'Escape') closeCmdk();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [openCmdk, closeCmdk]);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <Topbar onOpenSearch={openCmdk} />
        <Outlet />
      </main>
      <AIAssistant />
      <CommandPalette open={cmdkOpen} onClose={closeCmdk} />
    </div>
  );
}
