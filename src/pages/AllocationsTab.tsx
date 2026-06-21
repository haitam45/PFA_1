/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Allocation, EquipmentState } from '../types';
import { RotateCcw, Calendar, UserCheck, AlertTriangle, X, ShieldAlert, BadgeInfo } from 'lucide-react';

export const AllocationsTab: React.FC = () => {
  const { currentRole, allocations, restituteEquipment, equipments } = useApp();

  // Active / History subtab filter
  const [activeSubTab, setActiveSubTab] = useState<'Active' | 'History'>('Active');
  
  // Restitution state
  const [restitutingAlloc, setRestitutingAlloc] = useState<Allocation | null>(null);
  const [returnState, setReturnState] = useState<EquipmentState>('Excellent');
  const [returnNotes, setReturnNotes] = useState('');

  // Filtering
  const activeAllocations = allocations.filter(a => a.status === 'En cours');
  const completedAllocations = allocations.filter(a => a.status === 'Clôturée');

  const handleRestitutionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restitutingAlloc) return;

    restituteEquipment(
      restitutingAlloc.equipmentId,
      returnState,
      returnNotes || 'Bordereau de restitution validé sans réserve.'
    );

    setRestitutingAlloc(null);
    setReturnState('Excellent');
    setReturnNotes('');
  };

  const getTargetLabel = (type: string) => {
    switch (type) {
      case 'Utilisateur': return 'Employé';
      case 'Service': return 'Département';
      case 'Salle': return 'Salle / Local';
      default: return 'Cible';
    }
  };

  const canModify = currentRole === 'ADMINISTRATEUR' || currentRole === 'GESTIONNAIRE';

  return (
    <div className="space-y-6" id="allocations_component_panel">
      
      {/* EXPLANATORY HERO */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <span>Enregistrements des Affectations & Restitutions</span>
            <span className="text-xs font-normal text-slate-500 bg-slate-150 px-2 py-0.5 rounded">
              {activeAllocations.length} dotation(s) active(s)
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Tracer le cycle d'hébergement matériel, valider les retours physiques et alimenter l'inventaire réactif.</p>
        </div>

        {/* SUBTAB TOGGLER */}
        <div className="flex bg-slate-150 p-1 rounded-lg border border-slate-200 self-start sm:self-center">
          <button
            onClick={() => setActiveSubTab('Active')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeSubTab === 'Active' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Affectations actives ({activeAllocations.length})
          </button>
          <button
            onClick={() => setActiveSubTab('History')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeSubTab === 'History' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Historique / Retours ({completedAllocations.length})
          </button>
        </div>
      </div>

      {/* ACTIVE ALLOCATIONS LIST */}
      {activeSubTab === 'Active' ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {activeAllocations.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <UserCheck className="h-10 w-10 mx-auto text-slate-300" />
              <p className="font-semibold text-slate-600 mt-3">Aucune affectation en cours</p>
              <p className="text-xs text-slate-400 mt-1">
                Allez dans l'onglet <strong>Équipements</strong> pour attribuer du matériel disponible à un bénéficiaire.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto text-[13px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Équipement Affecté</th>
                    <th className="py-3 px-4">Type Cible</th>
                    <th className="py-3 px-4">Bénéficiaire final</th>
                    <th className="py-3 px-4">Date de début</th>
                    <th className="py-3 px-4">Responsable de Saisie</th>
                    <th className="py-3 px-4">Observations</th>
                    {canModify && <th className="py-3 px-4 text-right">Action Restitution</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeAllocations.map((alloc) => (
                    <tr key={alloc.id} className="hover:bg-slate-50/50">
                      
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        <div className="font-semibold">{alloc.equipmentModel}</div>
                        <div className="text-[10px] font-mono text-indigo-700 mt-0.5 bg-indigo-50 border border-indigo-100 rounded inline-block px-1">
                          {alloc.equipmentCode}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          alloc.beneficiaryType === 'Utilisateur' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' : 
                          alloc.beneficiaryType === 'Service' ? 'bg-sky-50 text-sky-700 border border-sky-150' : 
                          'bg-amber-50 text-amber-700 border border-amber-150'
                        }`}>
                          {getTargetLabel(alloc.beneficiaryType)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {alloc.beneficiaryName}
                      </td>

                      <td className="py-3.5 px-4 text-slate-550 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5 font-mono text-xs">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>{alloc.allocatedDate}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 font-medium whitespace-nowrap">
                        {alloc.responsableName}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs text-slate-600 font-medium truncate">
                        {alloc.notes || <span className="text-slate-350 italic">Aucune note</span>}
                      </td>

                      {canModify && (
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => { setRestitutingAlloc(alloc); setReturnState('Excellent'); setReturnNotes(''); }}
                            className="inline-flex items-center space-x-1 px-3 py-1 rounded bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-600 hover:text-white hover:border-rose-600 text-xs font-semibold cursor-pointer transition-colors"
                          >
                            <RotateCcw className="h-3 w-3" />
                            <span>Décharger (Retour)</span>
                          </button>
                        </td>
                      )}

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* HISTORICAL ARCHIVE OF COMPLETED ALLOCATIONS */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {completedAllocations.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              Aucun retour d'équipement archivé pour le moment.
            </div>
          ) : (
            <div className="overflow-x-auto text-[13px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Équipement</th>
                    <th className="py-3 px-4">Bénéficiaire Archivé</th>
                    <th className="py-3 px-4">Période d'Affectation</th>
                    <th className="py-3 px-4">Bilan de Restitution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {completedAllocations.map((alloc) => (
                    <tr key={alloc.id} className="hover:bg-slate-50/50">
                      
                      <td className="py-3 py-4">
                        <div className="font-semibold text-slate-700">{alloc.equipmentModel}</div>
                        <div className="text-[10px] font-mono text-slate-400">{alloc.equipmentCode}</div>
                      </td>

                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {alloc.beneficiaryName} ({getTargetLabel(alloc.beneficiaryType)})
                      </td>

                      <td className="py-3 px-4 text-slate-500 font-mono text-xs whitespace-nowrap">
                        Du <span className="font-semibold">{alloc.allocatedDate}</span> au <span className="font-semibold">{alloc.returnedDate}</span>
                      </td>

                      <td className="py-3 px-4 max-w-sm text-slate-600 leading-tight">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 mr-2 border border-slate-200">
                          Fiche close
                        </span>
                        <span>{alloc.notes}</span>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* RESTITUTION DIALOG WINDOW OVERLAY */}
      {restitutingAlloc && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                <RotateCcw className="h-4.5 w-4.5 text-indigo-505" />
                <span>Enregistrement de retour matériel</span>
              </h3>
              <button onClick={() => setRestitutingAlloc(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleRestitutionSubmit} className="p-5 space-y-4">
              <div className="bg-indigo-50 border border-indigo-100 text-indigo-800 p-3 rounded-lg text-xs leading-relaxed flex items-start gap-2">
                <BadgeInfo className="h-4.5 w-4.5 text-indigo-500 shrink-0 mt-0.5" />
                <span>
                  Veuillez inspecter physiquement l'équipement pour attester de son bon état d'usage. S'il est indiqué comme <strong>En panne ou Hors-service</strong>, un ticket de maintenance se créera automatiquement.
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Équipement restitué :</span>
                <span className="text-xs font-bold text-slate-800">{restitutingAlloc.equipmentModel}</span>
                <span className="text-[11px] font-mono text-indigo-650 ml-2 bg-indigo-50 px-1.5 py-0.5 rounded">
                  {restitutingAlloc.equipmentCode}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Bénéficiaire doté :</span>
                <span className="text-xs font-bold text-slate-700">{restitutingAlloc.beneficiaryName}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Contrôle physique de l'état du matériel *</label>
                <select
                  value={returnState}
                  onChange={(e) => setReturnState(e.target.value as EquipmentState)}
                  className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Excellent">Excellent état (Aucune rayure)</option>
                  <option value="Bon">Bon état (Usure normale)</option>
                  <option value="Moyen">État Moyen (Fonctionnel mais marqué)</option>
                  <option value="En panne">En Panne (Nécessite réparation)</option>
                  <option value="Hors-service">Hors service (Inutilisable dégradé)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Observations ou anomalies détectées *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="ex: Restitué complet avec bloc secteur d'origine. Plasturgie propre."
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setRestitutingAlloc(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-150 cursor-pointer"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  Confirmer le déchargement
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
