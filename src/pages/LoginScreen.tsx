/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role, User } from '../types';
import { Shield, Users, Wrench, Laptop, Lock, Eye, EyeOff, GraduationCap, X } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { users, loginUser, addUser } = useApp();
  
  // Login workflow states
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Registration workflow states
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDept, setRegDept] = useState('Marketing & Digital');
  const [regRoom, setRegRoom] = useState('Bureau ');
  const [regSuccess, setRegSuccess] = useState(false);
  const [createdRegUser, setCreatedRegUser] = useState<any>(null);

  // Role details metadata for premium visuals
  const rolesMetadata: { value: Role; label: string; icon: React.ReactNode; color: string; hoverColor: string; description: string; badgeColor: string }[] = [
    {
      value: 'ADMINISTRATEUR',
      label: 'Administrateur',
      icon: <Shield className="h-6 w-6" />,
      color: 'border-indigo-200 bg-indigo-50/50 text-indigo-800',
      hoverColor: 'hover:border-indigo-400 hover:bg-indigo-50/80',
      description: 'Supervision globale, gestion des membres, nomenclatures de référence, journaux d\'audit et statistiques.',
      badgeColor: 'bg-indigo-600 text-white',
    },
    {
      value: 'GESTIONNAIRE',
      label: 'Gestionnaire du parc',
      icon: <Users className="h-6 w-6" />,
      color: 'border-emerald-250 bg-emerald-50/50 text-emerald-800',
      hoverColor: 'hover:border-emerald-400 hover:bg-emerald-50/80',
      description: 'Ajout de nouveaux matériels, suivi d\'affectation des machines, logistique du stock, et retour d\'équipement.',
      badgeColor: 'bg-emerald-600 text-white',
    },
    {
      value: 'TECHNICIEN',
      label: 'Technicien de maintenance',
      icon: <Wrench className="h-6 w-6" />,
      color: 'border-amber-250 bg-amber-50/30 text-amber-800',
      hoverColor: 'hover:border-amber-400 hover:bg-amber-50/60',
      description: 'Diagnostic technique des pannes, mise à jour des rapports d\'atelier, et clôture des fiches d\'intervention.',
      badgeColor: 'bg-amber-600 text-white',
    },
    {
      value: 'BENEFICIAIRE',
      label: 'Bénéficiaire',
      icon: <Laptop className="h-6 w-6" />,
      color: 'border-slate-250 bg-slate-50/50 text-slate-800',
      hoverColor: 'hover:border-slate-400 hover:bg-slate-100',
      description: 'Consultation personnelle du catalogue affecté, alertes instantanées de dotation, et déclaration directe d\'incident.',
      badgeColor: 'bg-slate-600 text-white',
    },
  ];

  // Pick first user when a role is clicked
  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    const matchingUsers = users.filter(u => u.role === role && u.isActive);
    if (matchingUsers.length > 0) {
      setSelectedUserId(matchingUsers[0].id);
    } else {
      setSelectedUserId('');
    }
    setPassword('');
    setErrorMsg('');
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      setErrorMsg("Veuillez sélectionner un collaborateur.");
      return;
    }

    const matchedUser = users.find(u => u.id === selectedUserId);
    if (!matchedUser) {
      setErrorMsg("Profil introuvable.");
      return;
    }

    const correctPassword = matchedUser.password || '';
    if (password !== correctPassword) {
      setErrorMsg("Mot de passe incorrect pour " + matchedUser.name + ".");
      return;
    }

    // Success login session
    loginUser(matchedUser);
  };

  // Find currently selected user for helper hints
  const activeSelectedUser = users.find(u => u.id === selectedUserId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans selection:bg-indigo-650 selection:text-white" id="pfa_login_gate_screen">
      
      {/* Header banner */}
      <header className="bg-white border-b border-slate-200 py-3.5 px-6 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded text-white font-black text-sm tracking-tight w-9 h-9 flex items-center justify-center">
              GP
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-950 tracking-tight leading-none">ParcManager v2.4</h1>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mt-0.5">Système de Gestion du Parc Technologique</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-750 border border-indigo-150 uppercase tracking-wider">
            SESSION ACADÉMIQUE 2026/2027
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* LHS: Content and Info */}
          <div className="md:col-span-5 space-y-5 text-left hidden md:block">
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold text-indigo-600 uppercase tracking-widest block bg-indigo-50/60 px-2.5 py-1 rounded inline-block">
                Contrôle d'accès sécurisé
              </span>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                Authentification par <span className="text-indigo-650 underline decoration-indigo-300">Profils d'Acteurs</span>
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Cette plateforme centralise l'inventaire matériel, le suivi dynamique des affectations et l'enregistrement rigoureux des diagnostics de maintenance en atelier.
              </p>
            </div>

            <div className="space-y-3.5 pt-2 border-t border-slate-200">
              <div className="flex gap-3">
                <div className="text-indigo-600 font-bold text-xs shrink-0 mt-0.5">✓</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 leading-snug">Saisie & Traçabilité Complète</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Suivi des fiches techniques, dates de garantie et du cycle de vie.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-indigo-600 font-bold text-xs shrink-0 mt-0.5">✓</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 leading-snug">Alertes Instantanées par Rôle</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Notifications temps réel filtrées pour les administrateurs, techniciens et gestions.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-indigo-600 font-bold text-xs shrink-0 mt-0.5">✓</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 leading-snug">Garantie de Fiabilité</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Modélisation de données optimale assurant la persistance et l'intégrité de vos informations.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RHS: Login Interactive Card */}
          <div className="md:col-span-7 bg-white rounded-2xl border border-slate-250 shadow-xl overflow-hidden p-6 space-y-6">
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-950">Se connecter à l'application</h3>
                <span className="text-[10px] text-slate-400 font-mono font-medium">Portail d'acteurs</span>
              </div>
              <p className="text-xs text-slate-500">Pour continuer, veuillez d'abord sélectionner votre rôle professionnel ci-dessous :</p>
            </div>

            {/* Grid of Role selection buttons */}
            <div className="grid grid-cols-2 gap-3" id="login_role_selector_grid">
              {rolesMetadata.map((role) => {
                const isSelected = selectedRole === role.value;
                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => handleRoleSelect(role.value)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? role.color + ' border-2 scale-[1.02] ring-3 ring-indigo-100 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 ' + role.hoverColor
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? role.badgeColor : 'bg-slate-100 text-slate-600'}`}>
                        {role.icon}
                      </div>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold tracking-tight text-slate-900 leading-none">{role.label}</h4>
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-1 font-medium">{role.value.toLowerCase()}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* If a Role is selected: show specific user selector & password input */}
            {selectedRole ? (
              <form onSubmit={handleConnect} className="space-y-4 pt-4 border-t border-slate-150 animate-fade-in" id="login_validated_inputs_form">
                
                {/* 1. Select the dynamic user actor */}
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-450 uppercase tracking-widest mb-1.5">
                    Sélectionner l'acteur pour le rôle {selectedRole.toLowerCase()} :
                  </label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => {
                      setSelectedUserId(e.target.value);
                      setErrorMsg('');
                    }}
                    required
                    className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-semibold bg-white text-slate-800"
                  >
                    {users
                      .filter(u => u.role === selectedRole && u.isActive)
                      .map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name} — ({u.department || 'Sans département'})
                        </option>
                      ))
                    }
                    {users.filter(u => u.role === selectedRole && u.isActive).length === 0 && (
                      <option value="">Aucun membre actif enregistré pour ce rôle !</option>
                    )}
                  </select>
                </div>

                {/* 2. Password block */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[10px] font-extrabold text-slate-450 uppercase tracking-widest">
                      Code d'accès secret :
                    </label>
                    {activeSelectedUser && (
                      <span className="text-[10px] text-indigo-750 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded-full font-bold">
                        Indice mot de passe : <span className="font-mono font-black">{activeSelectedUser.password || 'admin123'}</span>
                      </span>
                    )}
                  </div>
                  
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Saisissez le mot de passe confidentiel"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrorMsg('');
                      }}
                      className="w-full text-xs p-3 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono bg-slate-50 text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-3 border border-rose-220 bg-rose-50 text-rose-800 text-xs font-semibold rounded-lg leading-relaxed animate-shake flex gap-2 items-center">
                    <span>⚠️</span>
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!selectedUserId}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-xs font-bold mt-2 cursor-pointer shadow-sm disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="h-4 w-4" />
                  <span>S'authentifier en tant que {rolesMetadata.find(r => r.value === selectedRole)?.label}</span>
                </button>

              </form>
            ) : (
              <div className="text-center p-8 border border-dashed border-slate-200 bg-slate-50/50 rounded-xl">
                <Laptop className="h-8 w-8 text-slate-300 mx-auto mb-2 animate-bounce" />
                <p className="text-xs text-slate-500 font-medium">Veuillez d'abord sélectionner un bouton de rôle professionnel pour afficher les options d'authentification.</p>
              </div>
            )}

            {/* Request Authentication trigger */}
            <div className="flex justify-center pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsRegisterOpen(true);
                  setRegSuccess(false);
                  setRegName('');
                  setRegEmail('');
                  setRegPassword('');
                }}
                className="text-xs text-indigo-650 hover:text-indigo-800 font-bold flex items-center gap-1.5 transition-all cursor-pointer py-1.5 px-3 rounded-lg hover:bg-indigo-50"
              >
                <Users className="h-4 w-4" />
                <span>Nouveau Bénéficiaire ? Demander une authentification</span>
              </button>
            </div>

          </div>

        </div>
      </main>

      {/* REGISTRATION REQUEST MODAL */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/55 p-4 font-sans backdrop-blur-3xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200">
            
            {/* Header banner */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-4 flex items-center justify-between text-white">
              <h3 className="font-extrabold text-xs flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Requête d'Authentification</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setIsRegisterOpen(false)} 
                className="text-white/80 hover:text-white cursor-pointer focus:outline-none"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {regSuccess ? (
              <div className="p-5 text-center space-y-4">
                <div className="w-14 h-14 bg-amber-50 border border-amber-200 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <span className="text-xl animate-spin">⏳</span>
                </div>
                <h4 className="text-base font-extrabold text-slate-800">Demande Soumise avec succès !</h4>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-2 text-xs text-slate-650">
                  <div>
                    <span className="font-bold text-slate-400 block text-[9px] uppercase">Nom complet :</span>
                    <span className="font-extrabold text-slate-800">{createdRegUser?.name}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 block text-[9px] uppercase">Adresse Email :</span>
                    <span className="font-bold text-slate-800 font-mono">{createdRegUser?.email}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 block text-[9px] uppercase">Mot de passe fourni :</span>
                    <span className="font-bold text-indigo-700 font-mono">{createdRegUser?.password}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 leading-relaxed text-[10px] font-semibold text-amber-705">
                    ⏳ Votre compte est à présent enregistré. Veuillez attendre la confirmation d'un Administrateur ou d'un Technicien pour l'activer.
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRegisterOpen(false)}
                    className="px-5 py-2.5 bg-slate-850 hover:bg-slate-950 text-white font-extrabold text-xs rounded-lg cursor-pointer transition-colors w-full"
                  >
                    Fermer et Attendre la Validation
                  </button>
                </div>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!regName || !regEmail || !regPassword) return;

                  const newId = `user-${Date.now()}`;
                  const newUser = {
                    id: newId,
                    name: regName,
                    email: regEmail,
                    role: 'BENEFICIAIRE' as const,
                    department: regDept,
                    room: regRoom || 'Bureau En attente',
                    isActive: false, // Wait confirmation!
                    isPending: true, // Pending status!
                    password: regPassword,
                  };

                  addUser({
                    name: regName,
                    email: regEmail,
                    role: 'BENEFICIAIRE',
                    department: regDept,
                    room: regRoom || 'Bureau En attente',
                    isActive: false,
                    isPending: true,
                    password: regPassword,
                  });

                  setCreatedRegUser(newUser);
                  setRegSuccess(true);
                }}
                className="p-5 space-y-3.5"
              >
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Ajouter un nouveau bénéficiaire en fournissant les informations d'authentification ci-dessous.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nom complet *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nom Prénom, ex: Haitam Figuigui"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-505 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Adresse email *</label>
                  <input
                    type="email"
                    required
                    placeholder="ex: h.figuigui@entreprise.ma"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-505 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Département de rattachement</label>
                  <select
                    value={regDept}
                    onChange={(e) => setRegDept(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 bg-white rounded-lg focus:ring-2 focus:ring-indigo-505 focus:outline-none font-medium text-slate-700"
                  >
                    <option value="Direction Informatique">Direction Informatique</option>
                    <option value="Moyens Généraux / Logistique">Moyens Généraux / Logistique</option>
                    <option value="Support Technique">Support Technique</option>
                    <option value="Marketing & Digital">Marketing & Digital</option>
                    <option value="Finance & Comptabilité">Finance & Comptabilité</option>
                    <option value="Recherche & Développement">Recherche & Développement</option>
                    <option value="Ressources Humaines">Ressources Humaines</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Bureau / Localisation</label>
                  <input
                    type="text"
                    placeholder="ex: Bureau 105"
                    value={regRoom}
                    onChange={(e) => setRegRoom(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-505 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Mot de passe de connexion désiré *</label>
                  <input
                    type="password"
                    required
                    placeholder="Saisissez votre mot de passe secret"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-505 focus:outline-none font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsRegisterOpen(false)}
                    className="px-3.5 py-1.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors shadow-xs"
                  >
                    Soumettre la Demande
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* App footer */}
      <footer className="bg-white border-t border-slate-200 py-3 px-6 shrink-0" id="academic_login_footer">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <div className="flex items-center space-x-2">
            <span>
              <strong>ParcManager v2.4</strong> — Solution professionnelle sécurisée de gestion de parc d'équipements technologiques.
            </span>
          </div>
          <div className="flex space-x-3 text-slate-400 font-mono">
            <span>React TypeScript</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
