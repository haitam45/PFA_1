/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { EquipmentsTab } from './pages/EquipmentsTab';
import { AllocationsTab } from './pages/AllocationsTab';
import { MaintenancesTab } from './pages/MaintenancesTab';
import { UsersTab } from './pages/UsersTab';
import { HistoryTab } from './pages/HistoryTab';
import { LoginScreen } from './pages/LoginScreen';

import { 
  BarChart4, 
  Laptop, 
  ArrowLeftRight, 
  Wrench, 
  Users, 
  History, 
  Database,
  GraduationCap,
  X,
  Menu
} from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { currentUser, isLoggedIn, logoutUser } = useApp();

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  const navGroups = [
    {
      title: "Vue d'ensemble",
      items: [
        { id: 'dashboard', label: 'Tableau de bord', icon: <BarChart4 className="h-4 w-4" /> },
      ]
    },
    {
      title: "Gestion du parc",
      items: [
        { id: 'equipments', label: 'Équipements (Inventaire)', icon: <Laptop className="h-4 w-4" /> },
        { id: 'allocations', label: 'Affectations / Retours', icon: <ArrowLeftRight className="h-4 w-4" /> },
        { id: 'users', label: 'Collaborateurs & Rôles', icon: <Users className="h-4 w-4" /> },
      ]
    },
    {
      title: "Technique & Audit",
      items: [
        { id: 'maintenance', label: 'Suivi Maintenance', icon: <Wrench className="h-4 w-4" /> },
        { id: 'history', label: 'Journal Historique', icon: <History className="h-4 w-4" /> },
      ]
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'equipments':
        return <EquipmentsTab />;
      case 'allocations':
        return <AllocationsTab />;
      case 'maintenance':
        return <MaintenancesTab />;
      case 'users':
        return <UsersTab />;
      case 'history':
        return <HistoryTab />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans selection:bg-indigo-500 selection:text-white" id="root_layout_container">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 bg-[#0f172a] text-slate-350 flex-col border-r border-slate-800 shrink-0 h-screen sticky top-0" id="desktop_app_sidebar">
        {/* Logo header */}
        <div className="p-4 border-b border-slate-800 flex items-center space-x-2.5 bg-slate-950/25 shrink-0">
          <div className="p-1.5 bg-indigo-600 rounded text-white font-bold text-xs tracking-tight flex items-center justify-center w-7 h-7">
            GP
          </div>
          <div>
            <h2 className="text-xs font-display font-bold text-white tracking-tight leading-none">ParcManager v2.4</h2>
            <span className="text-[9px] text-slate-500 font-medium uppercase tracking-wider block mt-0.5">Tableau de bord</span>
          </div>
        </div>

        {/* Navigation groups */}
        <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-4">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <h4 className="text-[9px] uppercase tracking-wider text-slate-500 font-bold px-3 py-1">
                {group.title}
              </h4>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded text-xs font-semibold transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-slate-800 text-white border-l-2 border-indigo-500 pl-2.5 shadow-xs' 
                          : 'text-slate-400 hover:text-slate-250 hover:bg-slate-900/40'
                      }`}
                    >
                      <span className="shrink-0 text-slate-500">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer User Info */}
        <div className="p-3.5 bg-slate-950/30 border-t border-slate-800 flex flex-col gap-2.5 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <div className="w-6.5 h-6.5 bg-slate-800 text-slate-300 rounded-full flex items-center justify-center font-bold text-[10px] uppercase shrink-0">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="truncate flex-1">
              <span className="text-[11px] font-bold text-slate-200 leading-none truncate block">{currentUser?.name}</span>
              <span className="text-[9px] text-slate-500 font-mono block mt-0.5">{currentUser?.department}</span>
            </div>
          </div>
          
          <button
            onClick={() => logoutUser()}
            className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 bg-rose-950/30 hover:bg-rose-900/40 border border-rose-900/30 text-rose-300 rounded text-[11px] font-bold transition-all cursor-pointer mt-1"
          >
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" id="mobile_sidebar_overlay">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" 
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          {/* Drawer Body */}
          <aside className="relative flex w-64 max-w-sm flex-col bg-[#0f172a] text-slate-300 h-full p-4 shadow-xl z-10">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 bg-indigo-600 rounded text-white font-bold text-xs">GP</div>
                <div>
                  <h2 className="text-xs font-display font-bold text-white leading-none">ParcManager</h2>
                  <span className="text-[9px] text-slate-500 font-medium">Session Active</span>
                </div>
              </div>
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto space-y-4">
              {navGroups.map((group) => (
                <div key={group.title} className="space-y-1">
                  <h4 className="text-[9px] uppercase tracking-wider text-slate-500 font-bold px-3 py-1">
                    {group.title}
                  </h4>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setIsMobileSidebarOpen(false);
                          }}
                          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded text-xs font-semibold transition-all cursor-pointer ${
                            isActive 
                              ? 'bg-slate-800 text-white border-l-2 border-indigo-500 pl-2.5 shadow-xs' 
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                          }`}
                        >
                          <span className="shrink-0 text-slate-500">{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-800 mt-auto flex flex-col gap-2.5 text-xs text-slate-455">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-slate-800 text-slate-300 rounded-full flex items-center justify-center font-bold text-[10px] uppercase">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
                <div className="truncate">
                  <span className="text-[11px] font-bold text-slate-200 block leading-none">{currentUser?.name}</span>
                  <span className="text-[9px] text-slate-500 font-mono block mt-0.5">{currentUser?.department}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  logoutUser();
                  setIsMobileSidebarOpen(false);
                }}
                className="w-full py-1.5 bg-rose-950/40 text-rose-300 border border-rose-900/30 rounded text-[11px] font-bold cursor-pointer hover:bg-rose-900/50 transition-colors"
              >
                Se déconnecter
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* CONTAINER ON THE RIGHT */}
      <div className="flex-1 flex flex-col min-w-0 h-screen" id="main_app_layout_content">
        {/* HEADER (Role Selectors, Mobile hamburger toggler etc.) */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 shrink-0 flex items-center h-14" id="main_app_topbar">
          <button 
            onClick={() => setIsMobileSidebarOpen(true)}
            className="inline-flex md:hidden items-center justify-center p-1.5 mr-2 rounded text-slate-500 hover:bg-slate-100 cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-2.5">
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-150 uppercase tracking-wider">
              Parc Actif
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Gestion Informatique & Cycles Matériels</span>
          </div>

          {/* RHS: Inject compact simulated header stuff */}
          <Header />
        </div>

        {/* MAIN PAGE SCROLLABLE CONTENT */}
        <main className="flex-1 p-3 md:p-5 space-y-5 overflow-y-auto bg-slate-50 w-full" id="root_tab_scroller">
          <div className="max-w-7xl mx-auto space-y-5">
            {renderTabContent()}
          </div>
        </main>

        {/* APP FOOTER */}
        <footer className="bg-white border-t border-slate-250 py-2.5 px-6 shrink-0" id="app_academic_footer">
          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <div className="flex items-center space-x-2">
              <span>
                <strong>ParcManager v2.4</strong> — Logiciel de gestion d'inventaire informatique et d'interventions de maintenance.
              </span>
            </div>
            <div className="flex space-x-3 text-slate-400 font-mono">
              <span>React TypeScript</span>
            </div>
          </div>
        </footer>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
