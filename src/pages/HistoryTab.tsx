/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ActivityLog } from '../types';
import { Activity, Clock, Search, Shield, Filter, RefreshCw } from 'lucide-react';

export const HistoryTab: React.FC = () => {
  const { logs } = useApp();

  const [search, setSearch] = useState('');
  const [selectedAction, setSelectedAction] = useState('All');

  const filteredLogs = logs.filter(log => {
    const term = search.toLowerCase();
    const matchSearch = 
      log.description.toLowerCase().includes(term) ||
      log.operatorName.toLowerCase().includes(term) ||
      (log.equipmentCode && log.equipmentCode.toLowerCase().includes(term));

    const matchAction = selectedAction === 'All' || log.actionType === selectedAction;

    return matchSearch && matchAction;
  });

  const getActionStyles = (action: ActivityLog['actionType']) => {
    switch (action) {
      case 'Création': return 'bg-emerald-100 text-emerald-850 border-emerald-250';
      case 'Affectation': return 'bg-blue-150 text-blue-800 border-blue-200';
      case 'Restitution': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Panne': return 'bg-amber-100 text-amber-800 border-amber-250';
      case 'Maintenance': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Suppression': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6" id="history_tab_panel">
      
      {/* HEADER ACTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200">
        <div>
          <h2 className="text-base font-semibold text-slate-909 flex items-center gap-2">
            <span>Journal d'Audit & Traçabilité (Mouvements)</span>
            <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {filteredLogs.length} évènements enregistrés
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Consigner et dater toutes les opérations d'inventaire, d'allocations de matériels et de résolutions d'interventions.
          </p>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 gap-4 flex flex-col sm:flex-row sm:items-center">
        
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input 
            type="text" 
            placeholder="Rechercher par description, opérateur, code inventaire..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        {/* Action picker */}
        <div className="w-full sm:w-64">
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          >
            <option value="All">Tous types d'opération</option>
            <option value="Création">Création / Enregistrement</option>
            <option value="Modification">Modification technique / Droits</option>
            <option value="Affectation">Affectation (Mise en service)</option>
            <option value="Restitution">Restitution (Retour stock)</option>
            <option value="Panne">Déclaration de pannes</option>
            <option value="Maintenance">Maintenance & Clôture d'intervention</option>
            <option value="Suppression">Suppression définitive</option>
          </select>
        </div>

      </div>

      {/* LOG TIMELINE RENDER */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Activity className="h-10 w-10 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-600 mt-2">Aucun évènement correspondant</p>
            <p className="text-xs text-slate-400 mt-1">Ajustez vos filtres d'historique.</p>
          </div>
        ) : (
          <div className="relative border-l border-slate-200 pl-6 ml-4 space-y-6">
            {filteredLogs.map((log) => {
              const formattedTime = new Date(log.timestamp).toLocaleString('fr-FR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              });

              return (
                <div key={log.id} className="relative group">
                  
                  {/* Circle locator */}
                  <span className="absolute -left-[31px] top-1.5 flex items-center justify-center w-5 h-5 bg-white border border-slate-300 rounded-full group-hover:border-indigo-500 transition-colors">
                    <Clock className="h-3 w-3 text-slate-400 group-hover:text-indigo-600" />
                  </span>
                  
                  {/* Container card */}
                  <div className="bg-slate-50/50 hover:bg-slate-50 p-4 border border-slate-200 rounded-xl transition-all">
                    
                    {/* Event header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getActionStyles(log.actionType)}`}>
                          {log.actionType}
                        </span>
                        {log.equipmentCode && (
                          <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-120/40 rounded px-1.5">
                            {log.equipmentCode}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 font-mono font-medium">{formattedTime}</span>
                      </div>
                      
                      <div className="text-[11px] text-slate-500 font-medium whitespace-nowrap bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded">
                        Par: <strong>{log.operatorName}</strong> ({log.operatorRole})
                      </div>
                    </div>

                    {/* Event body */}
                    <p className="text-xs text-slate-700 font-medium leading-relaxed mt-2.5">
                      {log.description}
                    </p>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
