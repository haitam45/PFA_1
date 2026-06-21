/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Equipment, EquipmentState, EquipmentStatus } from '../types';
import { Plus, Search, Calendar, Landmark, MapPin, BadgePercent, Trash2, Edit, UserCheck, AlertOctagon, X, Sparkles, Filter, ShoppingCart } from 'lucide-react';

export const EquipmentsTab: React.FC = () => {
  const { 
    currentRole, 
    currentUser,
    equipments, 
    categories, 
    addEquipment, 
    updateEquipment, 
    deleteEquipment,
    allocateEquipment,
    declareFailure,
    users
  } = useApp();

  // FILTER & SEARCH STATES
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedState, setSelectedState] = useState('All');

  // MODAL TOGGLES
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingEq, setEditingEq] = useState<Equipment | null>(null);
  const [allocatingEq, setAllocatingEq] = useState<Equipment | null>(null);
  const [failureEq, setFailureEq] = useState<Equipment | null>(null);

  // BENEFICIARY TRANSACTION STATE (LOUER / ACHETER)
  const [purchasingEq, setPurchasingEq] = useState<Equipment | null>(null);
  const [transactionType, setTransactionType] = useState<'Location' | 'Achat'>('Location');
  const [transactionDuration, setTransactionDuration] = useState('6 mois');
  const [transactionNotes, setTransactionNotes] = useState('');

  // NEW EQUIPMENT FORM STATES
  const [formCode, setFormCode] = useState('');
  const [formSerial, setFormSerial] = useState('');
  const [formCatId, setFormCatId] = useState(categories[0]?.id || '');
  const [formBrand, setFormBrand] = useState('');
  const [formModel, setFormModel] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formPrice, setFormPrice] = useState(1500);
  const [formProvider, setFormProvider] = useState('');
  const [formWarranty, setFormWarranty] = useState(24);
  const [formState, setFormState] = useState<EquipmentState>('Excellent');
  const [formLocation, setFormLocation] = useState('Magasin Principal');
  const [formComment, setFormComment] = useState('');

  // ALLOCATION QUICK FORM STATES
  const [allocType, setAllocType] = useState<'Utilisateur' | 'Service' | 'Salle'>('Utilisateur');
  const [allocUser, setAllocUser] = useState(users[0]?.id || '');
  const [allocTargetName, setAllocTargetName] = useState('');
  const [allocNotes, setAllocNotes] = useState('');

  // FAILURE REPORT FORM STATE
  const [failureDesc, setFailureDesc] = useState('');

  // HANDLERS
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Autogenerate Code Inventaire if empty
    const selectedCategory = categories.find(c => c.id === formCatId);
    const codePrefix = selectedCategory ? `INV-${selectedCategory.code}` : 'INV-MAT';
    const randNum = Math.floor(100 + Math.random() * 900);
    const finalCode = formCode || `${codePrefix}-${randNum}`;

    addEquipment({
      codeInventaire: finalCode.toUpperCase(),
      serialNumber: formSerial || 'S/N-NON-VALIDE',
      categoryId: formCatId,
      brand: formBrand || 'Générique',
      model: formModel || 'Matériel de bureau',
      purchaseDate: formDate,
      purchasePrice: Number(formPrice) || 0,
      provider: formProvider || 'Fournisseur Indéfini',
      warrantyMonths: Number(formWarranty) || 12,
      status: 'Disponible',
      state: formState,
      location: formLocation,
      comment: formComment,
    });

    // Reset
    setIsAddOpen(false);
    resetForm();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEq) return;
    updateEquipment(editingEq);
    setEditingEq(null);
  };

  const handleAllocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocatingEq) return;

    let targetName = '';
    let targetId = '';

    if (allocType === 'Utilisateur') {
      const u = users.find(usr => usr.id === allocUser);
      targetName = u ? u.name : 'Utilisateur Inconnu';
      targetId = allocUser;
    } else {
      targetName = allocTargetName || (allocType === 'Service' ? 'Service Général' : 'Salle Informatique');
      targetId = targetName;
    }

    allocateEquipment(allocatingEq.id, targetId, allocType, targetName, allocNotes);
    setAllocatingEq(null);
    setAllocUser(users[0]?.id || '');
    setAllocTargetName('');
    setAllocNotes('');
  };

  const handleFailureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!failureEq) return;
    declareFailure(failureEq.id, failureDesc || 'Défaillance technique signalée par le gestionnaire.');
    setFailureEq(null);
    setFailureDesc('');
  };

  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchasingEq || !currentUser) return;

    const notesMessage = [
      `Type de transaction : ${transactionType === 'Location' ? 'Location temporaire' : 'Achat définitif'}`,
      transactionType === 'Location' ? `Durée préconisée : ${transactionDuration}` : 'Achat définitif',
      transactionNotes ? `Remarques : ${transactionNotes}` : ''
    ].filter(Boolean).join(' | ');

    allocateEquipment(
      purchasingEq.id,
      currentUser.id,
      'Utilisateur',
      currentUser.name,
      notesMessage
    );

    setPurchasingEq(null);
    setTransactionNotes('');
  };

  const startEdit = (eq: Equipment) => {
    setEditingEq(eq);
  };

  const resetForm = () => {
    setFormCode('');
    setFormSerial('');
    setFormBrand('');
    setFormModel('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormPrice(1500);
    setFormProvider('');
    setFormWarranty(36);
    setFormState('Excellent');
    setFormLocation('Magasin Principal');
    setFormComment('');
  };

  // MULTI-CRITERIA FILTERING
  const filteredEquipments = equipments.filter(eq => {
    const term = search.toLowerCase();
    const matchSearch = 
      eq.brand.toLowerCase().includes(term) ||
      eq.model.toLowerCase().includes(term) ||
      eq.codeInventaire.toLowerCase().includes(term) ||
      eq.serialNumber.toLowerCase().includes(term) ||
      eq.location.toLowerCase().includes(term) ||
      eq.provider.toLowerCase().includes(term);

    const matchCat = selectedCat === 'All' || eq.categoryId === selectedCat;
    const matchStatus = selectedStatus === 'All' || eq.status === selectedStatus;
    const matchState = selectedState === 'All' || eq.state === selectedState;

    return matchSearch && matchCat && matchStatus && matchState;
  });

  const getCatName = (catId: string) => {
    return categories.find(c => c.id === catId)?.name || 'Inconnue';
  };

  // CONDITION COLOR MAPPER
  const getStateColor = (state: EquipmentState) => {
    switch (state) {
      case 'Excellent': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Bon': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Moyen': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'En panne': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Hors-service': return 'bg-rose-100 text-rose-800 border-rose-250';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  // STATUS COLOR MAPPER
  const getStatusColor = (status: EquipmentStatus) => {
    switch (status) {
      case 'Disponible': return 'bg-emerald-500 text-white';
      case 'Affecté': return 'bg-blue-500 text-white';
      case 'En maintenance': return 'bg-amber-500 text-white';
      case 'Mis au rebut': return 'bg-slate-500 text-white';
      default: return 'bg-slate-400 text-white';
    }
  };

  // CHECK ROLES FOR ACTIONS
  const canModify = currentRole === 'ADMINISTRATEUR' || currentRole === 'GESTIONNAIRE';
  const isBeneficiary = currentRole === 'BENEFICIAIRE';

  return (
    <div className="space-y-6" id="equipments_management_panel">
      
      {/* ACTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <span>Base de données d'inventorisation</span>
            <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {filteredEquipments.length} éléments affichés
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Saisie, modification, affectation et suivi technique des immobilisations informatiques.</p>
        </div>
        {canModify && (
          <button 
            type="button"
            onClick={() => { resetForm(); setIsAddOpen(true); }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Enregistrer un Équipement</span>
          </button>
        )}
      </div>

      {/* FILTER PANEL */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
        <div className="flex items-center space-x-2 text-slate-700">
          <Filter className="h-4 w-4 text-slate-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">Recherche multicritère</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Search bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </span>
            <input 
              type="text" 
              placeholder="Code, marque, S/N, fournisseur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          {/* Category filter */}
          <div>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            >
              <option value="All">Toutes les Catégories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            >
              <option value="All">Tous les Statuts d'affectation</option>
              <option value="Disponible">Disponible</option>
              <option value="Affecté">Affecté</option>
              <option value="En maintenance">En maintenance</option>
              <option value="Mis au rebut">Mis au rebut</option>
            </select>
          </div>

          {/* State filter */}
          <div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            >
              <option value="All">Tout état physique</option>
              <option value="Excellent">Excellent</option>
              <option value="Bon">Bon</option>
              <option value="Moyen">Moyen</option>
              <option value="En panne">En panne</option>
              <option value="Hors-service">Hors-service</option>
            </select>
          </div>

        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {filteredEquipments.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Search className="h-10 w-10 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-600 mt-3">Aucun matériel trouvé</p>
            <p className="text-xs text-slate-400 mt-1">Ajustez vos filtres de recherche multicritère.</p>
          </div>
        ) : (
          <div className="overflow-x-auto text-[13px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <th className="py-3 px-4">Code / Marque / Modèle</th>
                  <th className="py-3 px-4">Catégorie / S/N</th>
                  <th className="py-3 px-4">Info d'Acquisition</th>
                  <th className="py-3 px-4">Localisation</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4">État Physique</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEquipments.map((eq) => {
                  const monthsPassed = Math.floor(
                    (new Date().getTime() - new Date(eq.purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 30.5)
                  );
                  const isWarrantyExpired = monthsPassed > eq.warrantyMonths;

                  return (
                    <tr key={eq.id} className="hover:bg-slate-50/50">
                      
                      {/* Code & Model */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50/75 border border-indigo-120/50 rounded px-1.5 py-0.5 inline-block">
                          {eq.codeInventaire}
                        </div>
                        <div className="text-slate-800 font-bold mt-1 text-xs">{eq.brand} - {eq.model}</div>
                        {eq.comment && <div className="text-slate-400 text-[11px] font-medium max-w-xs truncate">{eq.comment}</div>}
                      </td>

                      {/* Category & Serial */}
                      <td className="py-3.5 px-4">
                        <span className="text-slate-700 font-medium block">{getCatName(eq.categoryId)}</span>
                        <span className="text-slate-400 text-[11px] font-mono block">S/N: {eq.serialNumber}</span>
                      </td>

                      {/* Acquisition info */}
                      <td className="py-3.5 px-4 text-[12px] leading-tight space-y-0.5">
                        <div className="text-slate-600 font-medium">{eq.purchasePrice.toLocaleString()} DH</div>
                        <div className="text-slate-400 text-[10px] uppercase font-semibold">Le {eq.purchaseDate}</div>
                        <div>
                          {isWarrantyExpired ? (
                            <span className="text-[10px] font-semibold text-rose-500">Garantie Expirée</span>
                          ) : (
                            <span className="text-[10px] font-semibold text-emerald-600">Sous garantie ({eq.warrantyMonths - monthsPassed} mois restants)</span>
                          )}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                          <span>{eq.location}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(eq.status)}`}>
                          {eq.status}
                        </span>
                      </td>

                      {/* Condition state */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded border font-semibold text-[11px] ${getStateColor(eq.state)}`}>
                          {eq.state}
                        </span>
                      </td>

                      {/* ACTIONS ROW */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-2">

                          {/* Louer / Acheter (Only if Available and role is BENEFICIAIRE) */}
                          {isBeneficiary && eq.status === 'Disponible' && (
                            <button
                              type="button"
                              onClick={() => {
                                setPurchasingEq(eq);
                                setTransactionType('Location');
                                setTransactionNotes('');
                              }}
                              className="p-1 px-3 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white rounded-md font-bold text-xs flex items-center gap-1 cursor-pointer transition-all hover:scale-[1.02]"
                            >
                              <ShoppingCart className="h-3 w-3" />
                              <span>Louer / Acheter</span>
                            </button>
                          )}

                          {/* Affecter (Only if Available and canModify) */}
                          {canModify && eq.status === 'Disponible' && (
                            <button
                              type="button"
                              onClick={() => setAllocatingEq(eq)}
                              title="Affecter l'équipement à un bénéficiaire"
                              className="p-1 px-2.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-md hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <UserCheck className="h-3 w-3" />
                              <span>Affecter</span>
                            </button>
                          )}

                          {/* Déclarer panne (If NOT in maintenance or scrapped) */}
                          {eq.status !== 'En maintenance' && eq.status !== 'Mis au rebut' && (
                            <button
                              type="button"
                              onClick={() => { setFailureEq(eq); setFailureDesc(''); }}
                              title="Signaler un incident"
                              className="p-1 px-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-md hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <AlertOctagon className="h-3 w-3" />
                              <span>Incident</span>
                            </button>
                          )}

                          {/* Edit Details */}
                          {canModify && (
                            <button
                              type="button"
                              onClick={() => startEdit(eq)}
                              title="Corriger la fiche technique"
                              className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-700 cursor-pointer"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                          )}

                          {/* Delete */}
                          {currentRole === 'ADMINISTRATEUR' && (
                            <button
                              type="button"
                              onClick={() => {
                                if(window.confirm(`Retirer définitivement ${eq.brand} ${eq.model} (${eq.codeInventaire}) ?`)) {
                                  deleteEquipment(eq.id);
                                }
                              }}
                              title="Supprimer d'inventaire"
                              className="p-1.5 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD EQUIPMENT */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <span>Enregistrement d'une nouvelle immobilisation</span>
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Catégorie technique *</label>
                  <select 
                    value={formCatId} 
                    onChange={(e) => setFormCatId(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Modèle exact *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="ex: ThinkPad T14 Gen 4"
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Marque *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="ex: Lenovo, Cisco, Dell..."
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Numéro de série S/N</label>
                  <input 
                    type="text" 
                    placeholder="ex: SN-LEN-772910X"
                    value={formSerial}
                    onChange={(e) => setFormSerial(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Code d'inventorisation personnalisé (Optionnel)</label>
                  <input 
                    type="text" 
                    placeholder="Par defaut : Auto-généré (INV-ORD-...)"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Fournisseur</label>
                  <input 
                    type="text" 
                    placeholder="ex: Sagem Maroc, Electroplanet..."
                    value={formProvider}
                    onChange={(e) => setFormProvider(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Date d'achat *</label>
                  <input 
                    type="date" 
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Prix d'acquisition (DH) *</label>
                  <input 
                    type="number" 
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Durée Garantie (Mois) *</label>
                  <input 
                    type="number" 
                    required
                    value={formWarranty}
                    onChange={(e) => setFormWarranty(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Localisation Initiale</label>
                  <input 
                    type="text" 
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">État Initial *</label>
                  <select 
                    value={formState} 
                    onChange={(e) => setFormState(e.target.value as EquipmentState)}
                    className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Bon">Bon</option>
                    <option value="Moyen">Moyen</option>
                    <option value="En panne">En panne</option>
                    <option value="Hors-service">Hors-service</option>
                  </select>
                </div>

              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Commentaires & Remarques complémentaires</label>
                <textarea 
                  rows={2}
                  placeholder="Détail technique additionnel..."
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-150 cursor-pointer"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  Valider la saisie
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDITING EQUIPMENT DETAILS */}
      {editingEq && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 text-sm">Modifier la fiche technique : {editingEq.codeInventaire}</h3>
              <button onClick={() => setEditingEq(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Marque</label>
                  <input 
                    type="text" 
                    required
                    value={editingEq.brand}
                    onChange={(e) => setEditingEq({ ...editingEq, brand: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Modèle exact</label>
                  <input 
                    type="text" 
                    required
                    value={editingEq.model}
                    onChange={(e) => setEditingEq({ ...editingEq, model: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">S/N Numéro de Série</label>
                  <input 
                    type="text" 
                    required
                    value={editingEq.serialNumber}
                    onChange={(e) => setEditingEq({ ...editingEq, serialNumber: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Localisation</label>
                  <input 
                    type="text" 
                    required
                    value={editingEq.location}
                    onChange={(e) => setEditingEq({ ...editingEq, location: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Fournisseur</label>
                  <input 
                    type="text" 
                    value={editingEq.provider}
                    onChange={(e) => setEditingEq({ ...editingEq, provider: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Prix d'acquisition (DH)</label>
                  <input 
                    type="number" 
                    required
                    value={editingEq.purchasePrice}
                    onChange={(e) => setEditingEq({ ...editingEq, purchasePrice: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">État de fonctionnement *</label>
                  <select 
                    value={editingEq.state} 
                    onChange={(e) => setEditingEq({ ...editingEq, state: e.target.value as EquipmentState })}
                    className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Bon">Bon</option>
                    <option value="Moyen">Moyen</option>
                    <option value="En panne">En panne</option>
                    <option value="Hors-service">Hors-service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Statut de Disponibilité *</label>
                  <select 
                    value={editingEq.status} 
                    onChange={(e) => setEditingEq({ ...editingEq, status: e.target.value as EquipmentStatus })}
                    className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Affecté">Affecté</option>
                    <option value="En maintenance">En maintenance</option>
                    <option value="Mis au rebut">Mis au rebut</option>
                  </select>
                </div>

              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Commentaires</label>
                <textarea 
                  rows={2}
                  value={editingEq.comment}
                  onChange={(e) => setEditingEq({ ...editingEq, comment: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setEditingEq(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  Enregistrer les modifications
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ALLOCATING AN EQUIPMENT */}
      {allocatingEq && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 text-sm">Affecter le matériel disponible</h3>
              <button onClick={() => setAllocatingEq(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAllocSubmit} className="p-5 space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Matériel choisi :</span>
                <span className="text-xs font-bold text-slate-800">{allocatingEq.brand} {allocatingEq.model}</span>
                <span className="text-[11px] font-mono text-indigo-600 ml-2 bg-indigo-50 px-1.5 py-0.5 rounded">
                  {allocatingEq.codeInventaire}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Type d'affectataire *</label>
                <div className="flex space-x-2 bg-slate-100 p-1 rounded-lg border border-slate-250">
                  {(['Utilisateur', 'Service', 'Salle'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAllocType(type)}
                      className={`flex-1 py-1 px-2.5 text-xs text-center font-medium rounded-md transition-all cursor-pointer ${
                        allocType === type ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {type === 'Utilisateur' ? 'Employé' : type === 'Service' ? 'Service' : 'Local / Salle'}
                    </button>
                  ))}
                </div>
              </div>

              {allocType === 'Utilisateur' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Sélectionner le bénéficiaire *</label>
                  <select
                    value={allocUser}
                    onChange={(e) => setAllocUser(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.department})</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    {allocType === 'Service' ? 'Nom du service bénéficiaire *' : 'Désignation de la salle bénéficiaire *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={allocType === 'Service' ? 'ex: Département RH, Service Marketing' : 'ex: Salle de réunion A-21, Bureau VIP'}
                    value={allocTargetName}
                    onChange={(e) => setAllocTargetName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Notes, bordereau et observations d'affectation</label>
                <textarea
                  rows={3}
                  required
                  placeholder="ex: Doté pour télétravail hybride. À restituer lors du départ."
                  value={allocNotes}
                  onChange={(e) => setAllocNotes(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setAllocatingEq(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-150 cursor-pointer"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  Valider l'affectation
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: DECLARING FAILURES */}
      {failureEq && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 text-sm text-rose-700 flex items-center gap-1.5">
                <AlertOctagon className="h-4.5 w-4.5" />
                <span>Déclaration d'incident technique</span>
              </h3>
              <button onClick={() => setFailureEq(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleFailureSubmit} className="p-5 space-y-4">
              <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-lg text-[12px] text-rose-800 leading-relaxed">
                <strong>Attention:</strong> Cette action clôturera immédiatement toute affectation en cours sur ce matériel, le basculera en statut <strong>En maintenance</strong> et créera un ticket d'éligibilité pour les ateliers techniques.
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Équipement concerné :</span>
                <span className="text-xs font-bold text-slate-800">{failureEq.brand} {failureEq.model}</span>
                <span className="text-[11px] font-mono text-rose-600 ml-2 bg-rose-50 px-1.5 py-0.5 rounded">
                  {failureEq.codeInventaire}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-display">Description des dysfonctionnements physiques *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="ex: Le port réseau Ethernet clignote rouge, ou la batterie gonfle anormalement..."
                  value={failureDesc}
                  onChange={(e) => setFailureDesc(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setFailureEq(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-150 cursor-pointer"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-rose-650 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  Envoyer à l'atelier
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: RENTAL & PURCHASE FOR BENEFICIARY */}
      {purchasingEq && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-emerald-600 to-indigo-600 p-4 flex items-center justify-between text-white">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <ShoppingCart className="h-4.5 w-4.5" />
                <span>Louer ou Acquérir un équipement</span>
              </h3>
              <button type="button" onClick={() => setPurchasingEq(null)} className="text-white/80 hover:text-white cursor-pointer focus:outline-none">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleTransactionSubmit} className="p-5 space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-650">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Équipement Sélectionné :</span>
                <span className="text-xs font-extrabold text-slate-850">{purchasingEq.brand} {purchasingEq.model}</span>
                <span className="text-[10px] font-mono text-indigo-750 ml-1.5 bg-indigo-50/75 px-1.5 py-0.5 rounded border border-indigo-150 font-bold">
                  {purchasingEq.codeInventaire}
                </span>
                <div className="mt-1.5 pt-1 border-t border-slate-100 flex justify-between">
                  <span><span className="font-semibold">Localisation :</span> {purchasingEq.location}</span>
                  <span className="font-semibold text-emerald-705">{purchasingEq.state}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Formule d'acquisition :</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTransactionType('Location')}
                    className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                      transactionType === 'Location'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold ring-2 ring-indigo-600/10'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold block">Louer</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">Location temporaire</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTransactionType('Achat')}
                    className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                      transactionType === 'Achat'
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-700 font-bold ring-2 ring-emerald-600/10'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold block">Acheter</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">Acquisition définitive</div>
                  </button>
                </div>
              </div>

              {transactionType === 'Location' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Durée de location préconisée :</label>
                  <select
                    value={transactionDuration}
                    onChange={(e) => setTransactionDuration(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  >
                    <option value="1 mois">1 mois</option>
                    <option value="3 mois">3 mois</option>
                    <option value="6 mois">6 mois</option>
                    <option value="12 mois">12 mois (1 an)</option>
                    <option value="24 mois">24 mois (2 ans)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Remarques ou besoins spécifiques (optionnel)</label>
                <textarea
                  rows={2}
                  placeholder="ex: Logiciels installés, besoin de sacoche..."
                  value={transactionNotes}
                  onChange={(e) => setTransactionNotes(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setPurchasingEq(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className={`px-5 py-2 text-white text-xs font-extrabold rounded-lg shadow-sm cursor-pointer transition-colors ${
                    transactionType === 'Location' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  Confirmer l'opération
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
