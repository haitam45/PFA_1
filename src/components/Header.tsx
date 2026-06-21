/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { Shield, Sparkles, User, RefreshCw, Layers, Bell, Check, Inbox, LogOut } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentRole, setCurrentRole, currentUser, setCurrentUser, users, notifications, markNotificationAsRead, clearAllNotifications, logoutUser } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  // Actor challenge states
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [targetRoleForLogin, setTargetRoleForLogin] = useState<Role | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Auto-sync selected user when switching roles
  React.useEffect(() => {
    if (loginModalOpen && targetRoleForLogin) {
      const roleUsers = users.filter(u => u.role === targetRoleForLogin && u.isActive);
      if (roleUsers.length > 0) {
        setSelectedUserId(roleUsers[0].id);
      } else {
        setSelectedUserId('');
      }
    }
  }, [loginModalOpen, targetRoleForLogin, users]);

  const rolesList: { value: Role; label: string; color: string; desc: string }[] = [
    {
      value: 'ADMINISTRATEUR',
      label: 'Administrateur',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold',
      desc: 'Supervision globale, dictionnaire de données, configuration, stats.',
    },
    {
      value: 'GESTIONNAIRE',
      label: 'Gestionnaire du parc',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold',
      desc: 'Saisie equipements, affectation, contrôle des retours / stock.',
    },
    {
      value: 'TECHNICIEN',
      label: 'Technicien de maintenance',
      color: 'bg-amber-50 border-amber-200 text-amber-700 font-semibold',
      desc: 'Fiches techniques, diagnostic panne, enregistrement réparation.',
    },
    {
      value: 'BENEFICIAIRE',
      label: 'Bénéficiaire',
      color: 'bg-slate-100 border-slate-300 text-slate-700 font-semibold',
      desc: 'Visualisation équipements assignés, déclaration rapide incident.',
    },
  ];

  const handleRoleBtnClick = (role: Role) => {
    const roleUsers = users.filter(u => u.role === role && u.isActive);
    setTargetRoleForLogin(role);
    if (roleUsers.length > 0) {
      const matchConnected = roleUsers.find(u => u.id === currentUser.id);
      setSelectedUserId(matchConnected ? matchConnected.id : roleUsers[0].id);
    } else {
      setSelectedUserId('');
    }
    setLoginPassword('');
    setLoginError('');
    setLoginModalOpen(true);
  };

  const handleLoginSubmit = () => {
    const userToVerify = users.find(u => u.id === selectedUserId);
    if (!userToVerify) {
      setLoginError("Aucun collaborateur actif sélectionné.");
      return;
    }

    const expectedPass = userToVerify.password || '';
    if (loginPassword !== expectedPass) {
      setLoginError("Mot de passe incorrect pour le collaborateur sélectionné.");
      return;
    }

    setCurrentUser(userToVerify);
    setLoginModalOpen(false);
    setLoginPassword('');
    setLoginError('');
  };

  // Specific filter logic: recipients matching the current selected profile
  const roleNotifications = notifications.filter(
    n => n.recipientRole === currentRole || n.recipientRole === 'ALL'
  );
  const unreadCount = roleNotifications.filter(n => !n.isRead).length;

  return (
    <div className="flex items-center space-x-4 ml-auto" id="compact_simulation_header">
      
      {/* Dynamic Notification Bell system */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors cursor-pointer relative flex items-center justify-center border border-slate-200 bg-white shadow-3xs"
          title="Notifications instantanées"
          id="realtime_notifications_bell"
        >
          <Bell className="h-4 w-4 text-slate-700" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-200 rounded shadow-xl z-50 text-left font-sans animate-fade-in">
            <div className="p-3 border-b border-slate-150 flex items-center justify-between bg-slate-50/80 rounded-t">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Bell className="h-3.5 w-3.5 text-indigo-650" />
                <span>Alertes ({roleNotifications.length})</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-bold font-mono">
                    {unreadCount} non lues
                  </span>
                )}
              </h4>
              {roleNotifications.length > 0 && (
                <button
                  onClick={() => { clearAllNotifications(); setIsOpen(false); }}
                  className="text-[10px] text-slate-500 hover:text-red-650 font-bold cursor-pointer"
                >
                  Vider tout
                </button>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-slate-150 hide-scrollbar">
              {roleNotifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                  <Inbox className="h-8 w-8 text-slate-300" />
                  <span className="font-semibold text-slate-500">Aucun message pour {currentRole.toLowerCase()}</span>
                </div>
              ) : (
                roleNotifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-3 text-xs transition-colors hover:bg-slate-50/50 flex gap-2.5 items-start ${
                      !notif.isRead ? 'bg-indigo-50/20' : ''
                    }`}
                  >
                    <span className="mt-1 shrink-0">
                      {notif.type === 'breakdown' && <span className="block w-2 h-2 rounded-full bg-rose-500" />}
                      {notif.type === 'allocation' && <span className="block w-2 h-2 rounded-full bg-indigo-500" />}
                      {notif.type === 'restitution' && <span className="block w-2 h-2 rounded-full bg-emerald-500" />}
                      {notif.type === 'maintenance' && <span className="block w-2 h-2 rounded-full bg-amber-500" />}
                      {notif.type === 'system' && <span className="block w-2 h-2 rounded-full bg-slate-550" />}
                    </span>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-slate-800 truncate">{notif.title}</span>
                        <span className="text-[9px] text-slate-400 shrink-0 font-mono">
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-0.5 leading-snug">{notif.message}</p>
                      {notif.equipmentCode && (
                        <div className="mt-1">
                          <span className="inline-block text-[9px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-100 rounded px-1">
                            {notif.equipmentCode}
                          </span>
                        </div>
                      )}
                    </div>

                    {!notif.isRead && (
                      <button
                        onClick={() => markNotificationAsRead(notif.id)}
                        className="p-1 hover:bg-slate-200 text-slate-400 hover:text-indigo-750 rounded cursor-pointer shrink-0"
                        title="Marquer comme lu"
                      >
                        <Check className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Simulation operator badge */}
      <div className="hidden lg:flex items-center space-x-2.5 bg-slate-50 border border-slate-200 rounded px-2.5 py-1 select-none">
        <div className="w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center">
          <User className="h-3.5 w-3.5" />
        </div>
        <div className="text-left font-sans">
          <div className="text-xs font-bold text-slate-800 leading-tight truncate">{currentUser.name}</div>
          <div className="text-[10px] text-slate-500 font-mono leading-none">{currentUser.department}</div>
        </div>
      </div>

      {/* Disconnect/LogOut button */}
      <button
        onClick={() => logoutUser()}
        className="px-2.5 py-1.5 border border-rose-220 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 rounded font-extrabold transition-all text-[11px] flex items-center gap-1.5 cursor-pointer leading-tight shadow-3xs hover:scale-[1.02]"
        title="Se déconnecter"
        id="header_logout_btn"
      >
        <LogOut className="h-3 w-3 text-rose-600" />
        <span className="hidden sm:inline">Déconnexion</span>
      </button>

      {/* Tighter horizontal quick switcher */}
      <div className="flex items-center space-x-1.5 bg-slate-150 p-1 rounded border border-slate-200">
        <span className="hidden sm:inline-flex text-[10px] text-slate-500 font-bold uppercase tracking-wider px-1.5 items-center gap-1">
          <Shield className="h-3 w-3 text-indigo-600 shrink-0" />
          Rôle :
        </span>
        <div className="flex items-center space-x-1">
          {rolesList.map((role) => {
            const isSelected = currentRole === role.value;
            return (
              <button
                key={role.value}
                onClick={() => handleRoleBtnClick(role.value)}
                title={role.desc}
                className={`px-2 py-1 text-[11px] rounded font-bold cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {role.value === 'ADMINISTRATEUR' ? 'Admin' : role.value === 'GESTIONNAIRE' ? 'Gestionnaire' : role.value === 'TECHNICIEN' ? 'Technicien' : 'Bénéficiaire'}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECURE PASS-PORT LOGIN MODAL FOR DYNAMIC ACTORS */}
      {loginModalOpen && targetRoleForLogin && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/60 p-4 font-sans backdrop-blur-xs animate-fade-in">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleLoginSubmit(); }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200"
          >
            
            <div className="bg-gradient-to-r from-slate-800 to-indigo-950 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-indigo-300" />
                <span className="font-bold text-xs font-sans">Authentification Requise</span>
              </div>
              <button 
                type="button"
                onClick={() => setLoginModalOpen(false)}
                className="text-slate-350 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Rôle Système Visé
                </label>
                <div className="p-2 bg-indigo-50 border border-indigo-150 text-indigo-800 rounded font-bold text-xs uppercase tracking-wide text-center">
                  {targetRoleForLogin}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Sélectionner l'Acteur Dynamique *
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => {
                    setSelectedUserId(e.target.value);
                    setLoginError('');
                  }}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold bg-white text-slate-800 cursor-pointer"
                >
                  {users
                    .filter(u => u.role === targetRoleForLogin && u.isActive)
                    .map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.department})
                      </option>
                    ))
                  }
                  {users.filter(u => u.role === targetRoleForLogin && u.isActive).length === 0 && (
                    <option value="">Aucun utilisateur actif pour ce rôle !</option>
                  )}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Mot de passe d'accès *
                  </label>
                  {selectedUserId && (
                    <span className="text-[10px] text-indigo-650 bg-indigo-55 px-1.5 py-0.5 rounded font-black border border-indigo-100">
                      Indice: <span className="font-mono">{users.find(u => u.id === selectedUserId)?.password || 'admin123'}</span>
                    </span>
                  )}
                </div>
                <input
                  type="password"
                  placeholder="Saisir le mot de passe"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    setLoginError('');
                  }}
                  className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono bg-slate-50 text-slate-900 font-bold"
                  autoFocus
                  required
                />
              </div>

              {loginError && (
                <div className="p-2 border border-rose-220 bg-rose-50 text-rose-700 text-xs font-semibold rounded leading-relaxed animate-shake">
                  ⚠️ {loginError}
                </div>
              )}

              {/* Big, extremely clear, impossible-to-miss Connection Button directly inside the form block */}
              <button
                type="submit"
                disabled={!selectedUserId}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-sm hover:shadow transition-all disabled:opacity-50 cursor-pointer text-center flex items-center justify-center gap-1.5 hover:scale-[1.01]"
              >
                <span>Se connecter en tant que {rolesList.find(r => r.value === targetRoleForLogin)?.label || targetRoleForLogin}</span>
              </button>

              <button
                type="button"
                onClick={() => setLoginModalOpen(false)}
                className="w-full py-2 border border-slate-250 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-semibold cursor-pointer transition-colors text-center"
              >
                Annuler
              </button>

              <p className="text-[10px] text-slate-400 leading-snug text-center pt-2 border-t border-slate-100">
                💡 <strong>Info acteur :</strong> Vous pouvez basculer d'un profil à un autre de manière transparente pour simuler les différents acteurs.
              </p>
            </div>

          </form>
        </div>
      )}

    </div>
  );
};
