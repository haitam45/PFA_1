/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Maintenance, EquipmentState } from '../types';
import { Wrench, Calendar, DollarSign, Activity, FileText, CheckCircle2, User, AlertTriangle, X, ShieldAlert } from 'lucide-react';

export const MaintenancesTab: React.FC = () => {
  const { currentRole, currentUser, maintenances, updateMaintenance, closeMaintenance } = useApp();

  // Sub-tabs
  const [maintSubTab, setMaintSubTab] = useState<'Active' | 'Closed'>('Active');

  // Edit states
  const [diagnosingMaint, setDiagnosingMaint] = useState<Maintenance | null>(null);
  const [diagText, setDiagText] = useState('');
  
  const [closingMaint, setClosingMaint] = useState<Maintenance | null>(null);
  const [closeSolution, setCloseSolution] = useState('');
  const [closeCost, setCloseCost] = useState(0);
  const [closeFinalState, setCloseFinalState] = useState<EquipmentState>('Excellent');

  // Filtering lists
  const activeTickets = maintenances.filter(m => m.status !== 'Clôturée');
  const closedTickets = maintenances.filter(m => m.status === 'Clôturée');

  // Privileges
  const isTechnicianOrAdmin = currentRole === 'ADMINISTRATEUR' || currentRole === 'TECHNICIEN';

  const handleDiagnoseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosingMaint) return;
    updateMaintenance(diagnosingMaint.id, diagText);
    setDiagnosingMaint(null);
    setDiagText('');
  };

  const handleCloseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!closingMaint) return;
    closeMaintenance(closingMaint.id, closeFinalState, closeSolution, Number(closeCost) || 0);
    setClosingMaint(null);
    setCloseSolution('');
    setCloseCost(0);
    setCloseFinalState('Excellent');
  };

  const handleSelfAssign = (maintId: string) => {
    updateMaintenance(maintId, "Prise en charge technique et diagnostic initial entamé.");
  };

  return (
    <div className="space-y-6" id="maintenance_panel_tab">
      
      {/* HEADER HERO */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <span>Gestion des Pannes & Fiches de Maintenance</span>
            <span className="text-xs font-normal text-slate-500 bg-slate-150 px-2 py-0.5 rounded">
              {activeTickets.length} ticket(s) actif(s)
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Gérer les interventions de dépannage, formuler les diagnostics et renseigner les solutions professionnelles.</p>
        </div>

        <div className="flex bg-slate-150 p-1 rounded-lg border border-slate-200 self-start sm:self-center">
          <button
            onClick={() => setMaintSubTab('Active')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              maintSubTab === 'Active' ? 'bg-white text-indigo-750 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Fiches Actives ({activeTickets.length})
          </button>
          <button
            onClick={() => setMaintSubTab('Closed')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              maintSubTab === 'Closed' ? 'bg-white text-indigo-750 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Fiches Clôturées ({closedTickets.length})
          </button>
        </div>
      </div>

      {/* TICKETS LISTS */}
      {maintSubTab === 'Active' ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {activeTickets.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <CheckCircle2 className="h-10 w-10 mx-auto text-slate-350" />
              <p className="font-semibold text-slate-600 mt-3">Aucune panne ou anomalie active</p>
              <p className="text-xs text-slate-400 mt-1">
                Le parc est stable ! Pour simuler une panne, allez dans l'onglet des <strong>Équipements</strong> et cliquez sur "Incident".
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto text-[13px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Équipement</th>
                    <th className="py-3 px-4">Déclaration</th>
                    <th className="py-3 px-4">Description Dysfonctionnement</th>
                    <th className="py-3 px-4">Dernier Diagnostic</th>
                    <th className="py-3 px-4">Technicien en charge</th>
                    <th className="py-3 px-4">Statut</th>
                    {isTechnicianOrAdmin && <th className="py-3 px-4 text-right">Intervention</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-slate-50/50">
                      
                      <td className="py-3.5 px-4 font-medium">
                        <div className="font-semibold text-slate-800">{ticket.equipmentModel}</div>
                        <div className="text-[10px] font-mono text-zinc-400">{ticket.equipmentCode}</div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5 font-mono text-xs">
                          <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                          <span>{ticket.reportedDate}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs text-slate-600 font-medium leading-relaxed">
                        {ticket.failureDescription}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs text-indigo-900 leading-relaxed italic font-medium">
                        {ticket.diagnostics ? ticket.diagnostics : <span className="text-slate-350">En attente d'observation</span>}
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 font-semibold whitespace-nowrap">
                        {ticket.technicianName === 'En attente d\'attribution' ? (
                          <span className="text-amber-605 italic bg-amber-50 px-2 py-0.5 rounded text-[11px]">Banc libre</span>
                        ) : (
                          <div className="flex items-center space-x-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            <span>{ticket.technicianName}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          ticket.status === 'Déclarée' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ticket.status}
                        </span>
                      </td>

                      {isTechnicianOrAdmin && (
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-1.5">
                            
                            {/* Take responsibility */}
                            {ticket.technicianName === 'En attente d\'attribution' && (
                              <button
                                type="button"
                                onClick={() => handleSelfAssign(ticket.id)}
                                className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[11.5px] font-semibold cursor-pointer"
                              >
                                M'assigner
                              </button>
                            )}

                            {/* Diagnose entry */}
                            {ticket.technicianName !== 'En attente d\'attribution' && (
                              <button
                                type="button"
                                onClick={() => { setDiagnosingMaint(ticket); setDiagText(ticket.diagnostics || ''); }}
                                className="px-2 py-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded text-[11.5px] font-semibold cursor-pointer"
                              >
                                Diagnostiquer
                              </button>
                            )}

                            {/* Complete resolution */}
                            {ticket.technicianName !== 'En attente d\'attribution' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setClosingMaint(ticket);
                                  setCloseSolution(ticket.solution || '');
                                  setCloseCost(ticket.cost || 50);
                                  setCloseFinalState('Excellent');
                                }}
                                className="px-2 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 rounded text-[11.5px] font-bold cursor-pointer transition-colors"
                              >
                                Clôturer
                              </button>
                            )}

                          </div>
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
        /* HISTORICAL REPAIR LOGS */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {closedTickets.length === 0 ? (
            <div className="p-12 text-center text-slate-400 italic text-xs">
              Aucune intervention technique classée pour l'instant.
            </div>
          ) : (
            <div className="overflow-x-auto text-[13px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Équipement dépanné</th>
                    <th className="py-3 px-4 font-mono">Période d'Atelier</th>
                    <th className="py-3 px-4">Diagnostic initial</th>
                    <th className="py-3 px-4">Solution Appliquée</th>
                    <th className="py-3 px-4">Coût</th>
                    <th className="py-3 px-4">Technicien Réparateur</th>
                    <th className="py-3 px-4">État Final</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {closedTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-slate-50/50">
                      
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        <div>{ticket.equipmentModel}</div>
                        <div className="text-[10px] font-mono text-zinc-400">{ticket.equipmentCode}</div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 font-mono text-xs whitespace-nowrap">
                        Du {ticket.reportedDate} au {ticket.endDate}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 max-w-xs font-semibold leading-relaxed">
                        {ticket.diagnostics}
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 max-w-sm font-medium leading-relaxed">
                        {ticket.solution}
                      </td>

                      <td className="py-3.5 px-4 text-emerald-700 font-extrabold font-mono whitespace-nowrap">
                        {ticket.cost ? `${ticket.cost} DH` : 'Négligeable'}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 font-semibold whitespace-nowrap">
                        {ticket.technicianName}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-[11px]">
                          {ticket.finalState || 'Excellent'}
                        </span>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* DIAGNOSTIC FORM MODAL */}
      {diagnosingMaint && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                <Wrench className="h-4.5 w-4.5 text-indigo-505" />
                <span>Renseigner l'examen et diagnostic technique</span>
              </h3>
              <button onClick={() => setDiagnosingMaint(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleDiagnoseSubmit} className="p-5 space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Matériel incriminé :</span>
                <span className="text-xs font-bold text-slate-800 block">{diagnosingMaint.equipmentModel} ({diagnosingMaint.equipmentCode})</span>
                <span className="text-xs font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded mt-1.5 inline-block">
                  Plainte: {diagnosingMaint.failureDescription}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Observations d'ingénierie / Diagnostic de panne *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="ex: Fusible primaire d'alimentation grillé suite à surtension électrique. Poussière importante constatée."
                  value={diagText}
                  onChange={(e) => setDiagText(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setDiagnosingMaint(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-150 cursor-pointer"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  Mettre à jour la fiche
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* RESOLUTION/CLOSE INTERVENTION FORM MODAL */}
      {closingMaint && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-1.5 text-emerald-800">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
                <span>Clôturer l'intervention de maintenance</span>
              </h3>
              <button onClick={() => setClosingMaint(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleCloseSubmit} className="p-5 space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Équipement dépanné :</span>
                <span className="text-xs font-bold text-slate-800 block">{closingMaint.equipmentModel}</span>
                <span className="text-xs font-mono text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.5 rounded mt-1.5 inline-block">
                  {closingMaint.equipmentCode}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Action corrective / Description de la réparation *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="ex: Remplacement du composant régulateur, dépoussiérage à l'air sec, tests de montée en température concluants."
                  value={closeSolution}
                  onChange={(e) => setCloseSolution(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Coût des pièces (DH)</label>
                  <input
                    type="number"
                    required
                    value={closeCost}
                    onChange={(e) => setCloseCost(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">État final certifié *</label>
                  <select
                    value={closeFinalState}
                    onChange={(e) => setCloseFinalState(e.target.value as EquipmentState)}
                    className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Excellent">Excellent (Comme neuf)</option>
                    <option value="Bon">Bon état d'usage</option>
                    <option value="Moyen">État moyen mais fonctionnel</option>
                    <option value="Hors-service">Inutilisable (Prendre au Rebut)</option>
                  </select>
                </div>

              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setClosingMaint(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-150 cursor-pointer"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  Clôturer le ticket
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
