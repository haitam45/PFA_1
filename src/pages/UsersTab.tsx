/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Role } from '../types';
import { Plus, Users, UserCheck, ShieldAlert, Mail, MapPin, Briefcase, ToggleLeft, ToggleRight, X } from 'lucide-react';

export const UsersTab: React.FC = () => {
  const { currentRole, users, setUsers, addUser, updateUser } = useApp();

  // Dialog toggles
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // New user form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<Role>('BENEFICIAIRE');
  const [formDept, setFormDept] = useState('Marketing & Digital');
  const [formRoom, setFormRoom] = useState('Bureau ');
  const [formPassword, setFormPassword] = useState('user123');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;

    if (editingUser) {
      updateUser({
        ...editingUser,
        name: formName,
        email: formEmail,
        role: formRole,
        department: formDept,
        room: formRoom,
        password: formPassword,
      });
    } else {
      addUser({
        name: formName,
        email: formEmail,
        role: formRole,
        department: formDept,
        room: formRoom || 'Atelier',
        isActive: true,
        password: formPassword,
      });
    }

    setIsAddOpen(false);
    setEditingUser(null);
    setFormName('');
    setFormEmail('');
    setFormRole('BENEFICIAIRE');
    setFormDept('Marketing & Digital');
    setFormRoom('Bureau ');
    setFormPassword('user123');
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, isActive: !u.isActive, isPending: false };
      }
      return u;
    }));
  };

  const approveUser = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, isActive: true, isPending: false };
      }
      return u;
    }));
  };

  const openEditModal = (u: User) => {
    setEditingUser(u);
    setFormName(u.name);
    setFormEmail(u.email);
    setFormRole(u.role);
    setFormDept(u.department);
    setFormRoom(u.room);
    setFormPassword(u.password || '');
    setIsAddOpen(true);
  };

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'ADMINISTRATEUR': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'GESTIONNAIRE': return 'bg-emerald-100 text-emerald-800 border-emerald-205';
      case 'TECHNICIEN': return 'bg-amber-100 text-amber-800 border-amber-205';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const canModify = currentRole === 'ADMINISTRATEUR' || currentRole === 'TECHNICIEN';
  const hasAccess = currentRole === 'ADMINISTRATEUR' || currentRole === 'TECHNICIEN';

  return (
    <div className="space-y-6" id="users_tab_panel">
      
      {/* HEADER ACTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200">
        <div>
          <h2 className="text-base font-semibold text-slate-905 flex items-center gap-2">
            <span>Annuaire & Habilitations du Personnel</span>
            <span className="text-xs font-normal text-slate-500 bg-slate-150 px-2 py-0.5 rounded">
              {users.length} comptes enregistrés
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Gérer les profils d'affectation, attribuer les rôles fonctionnels et activer/désactiver les comptes utilisateurs.</p>
        </div>
        
        {canModify && (
          <button 
            type="button"
            onClick={() => {
              setEditingUser(null);
              setFormName('');
              setFormEmail('');
              setFormRole('BENEFICIAIRE');
              setFormDept('Marketing & Digital');
              setFormRoom('Bureau ');
              setFormPassword('user123');
              setIsAddOpen(true);
            }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Enregistrer un Collaborateur</span>
          </button>
        )}
      </div>

      {/* WARNING IF NOT ADMIN */}
      {!canModify && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3.5 rounded-lg text-xs leading-relaxed flex items-start gap-2">
          <Briefcase className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
          <span>
            <strong>Privilèges Requis :</strong> Seul un <strong>Administrateur</strong> a les droits d'écriture requis pour ajouter des utilisateurs ou basculer leur statut opérationnel. (Basculez de rôle dans le header pour tester).
          </span>
        </div>
      )}

      {/* USER TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto text-[13px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Nom de l'Employé / ID</th>
                <th className="py-3 px-4">Adresse Email</th>
                <th className="py-3 px-4">Département d'Appartenance</th>
                <th className="py-3 px-4">Bureau / Localisation</th>
                <th className="py-3 px-4">Rôle Système</th>
                <th className="py-3 px-4">Code d'accès / MDP</th>
                <th className="py-3 px-4">Statut Opérationnel</th>
                {canModify && <th className="py-3 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className={`${!u.isActive ? 'bg-slate-50/50 text-slate-400' : 'hover:bg-slate-50/25'}`}>
                  
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 bg-slate-100 rounded-full text-slate-600 shrink-0">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <div className={`${!u.isActive ? 'line-through text-slate-400' : ''}`}>{u.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono font-normal">{u.id}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 font-mono text-xs">
                    <div className="flex items-center space-x-1.5">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <span>{u.email}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {u.department}
                  </td>

                  <td className="py-3.5 px-4 text-slate-605 font-medium whitespace-nowrap">
                    <div className="flex items-center space-x-1 px-1.5">
                      <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                      <span>{u.room}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${getRoleBadge(u.role)}`}>
                      {u.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-xs font-semibold text-indigo-750">
                    {hasAccess ? (u.password || '—') : <span className="text-slate-400 italic">private private</span>}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-xs">
                    {hasAccess ? (
                      u.isPending ? (
                        <span className="inline-flex items-center space-x-1 text-amber-600 font-bold bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse animate-duration-1000" />
                          <span>En attente</span>
                        </span>
                      ) : u.isActive ? (
                        <span className="inline-flex items-center space-x-1 text-emerald-705 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Compte Actif</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-slate-400 italic">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-350" />
                          <span>Désactivé</span>
                        </span>
                      )
                    ) : (
                      <span className="text-slate-400 italic">private private</span>
                    )}
                  </td>

                  {canModify && (
                    <td className="py-0.5 px-4 text-right whitespace-nowrap space-x-2">
                      {u.isPending && (
                        <button
                          type="button"
                          onClick={() => approveUser(u.id)}
                          className="inline-flex items-center px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          Approuver
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => openEditModal(u)}
                        className="inline-flex items-center px-2 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-650 hover:text-white rounded text-xs font-bold cursor-pointer transition-colors"
                      >
                        Éditer
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleUserStatus(u.id)}
                        className={`inline-flex items-center space-x-1.5 px-2 py-1 rounded cursor-pointer text-xs font-semibold border ${
                          u.isActive 
                            ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100' 
                            : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {u.isActive ? 'Désactiver' : 'Réactiver'}
                      </button>
                    </td>
                  )}

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW COLLABORATOR MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/50 p-4 font-sans">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 text-sm">
                {editingUser ? `Modifier l'acteur : ${editingUser.name}` : "Enregistrer un nouveau collaborateur"}
              </h3>
              <button 
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingUser(null);
                }} 
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nom complet *</label>
                <input 
                  type="text" 
                  required
                  placeholder="ex: Rachid El Alami"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Adresse email @entreprise.ma *</label>
                <input 
                  type="email" 
                  required
                  placeholder="ex: r.elalami@entreprise.ma"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Département *</label>
                  <select
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
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
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Bureau / Cabinet *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="ex: Bureau 101"
                    value={formRoom}
                    onChange={(e) => setFormRoom(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Attribution de rôle système *</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as Role)}
                  className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  <option value="BENEFICIAIRE">Bénéficiaire (Utilisateur de base)</option>
                  <option value="TECHNICIEN">Technicien Hardware</option>
                  <option value="GESTIONNAIRE">Gestionnaire du parc</option>
                  <option value="ADMINISTRATEUR">Administrateur système</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center justify-between">
                  <span>Mot de passe d'accès *</span>
                  <span className="text-[10px] text-slate-400 font-mono font-normal">Requis pour l'acteur</span>
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="ex: admin123, securepass"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsAddOpen(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-150 cursor-pointer"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-indigo-650 hover:bg-indigo-750 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-colors"
                >
                  {editingUser ? "Enregistrer les modifications" : "Valider l'utilisateur"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
