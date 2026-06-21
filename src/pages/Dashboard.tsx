/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Laptop, Monitor, Printer, Network, Keyboard, AlertTriangle, CheckCircle, Clock, ShieldCheck, DollarSign } from 'lucide-react';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
  setSelectedEqIdForMaint?: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const { equipments, allocations, maintenances, categories } = useApp();

  // DYNAMIC CHART STATISTICS CALCULATIONS
  const brandMetrics = React.useMemo(() => {
    const brandsMap: { [key: string]: { count: number; value: number; maintenanceCost: number } } = {};
    
    // Sum prices
    equipments.forEach(eq => {
      const b = eq.brand || 'Autre';
      if (!brandsMap[b]) {
        brandsMap[b] = { count: 0, value: 0, maintenanceCost: 0 };
      }
      brandsMap[b].count += 1;
      brandsMap[b].value += (eq.purchasePrice || 0);
    });

    // Sum maintenance costs
    maintenances.forEach(m => {
      const eq = equipments.find(e => e.codeInventaire === m.equipmentCode || e.id === m.equipmentId);
      const b = eq ? (eq.brand || 'Autre') : 'Autre';
      if (!brandsMap[b]) {
        brandsMap[b] = { count: 0, value: 0, maintenanceCost: 0 };
      }
      brandsMap[b].maintenanceCost += (m.cost || 0);
    });

    return Object.entries(brandsMap).map(([name, data]) => ({
      name,
      ...data
    })).sort((a, b) => b.value - a.value);
  }, [equipments, maintenances]);

  const [activeChartTab, setActiveChartTab] = React.useState<'value' | 'maintenance'>('value');
  const [hoveredBarIndex, setHoveredBarIndex] = React.useState<number | null>(null);

  // find max value for chart scaling
  const maxChartValue = React.useMemo(() => {
    if (brandMetrics.length === 0) return 1000;
    const vals = brandMetrics.map(item => activeChartTab === 'value' ? item.value : item.maintenanceCost);
    const max = Math.max(...vals);
    return max > 0 ? max : 1000;
  }, [brandMetrics, activeChartTab]);

  // CALCULATE METRICS
  const totalCount = equipments.length;
  const availableCount = equipments.filter(e => e.status === 'Disponible').length;
  const allocatedCount = equipments.filter(e => e.status === 'Affecté').length;
  const maintenanceCount = equipments.filter(e => e.status === 'En maintenance').length;
  const junkCount = equipments.filter(e => e.status === 'Mis au rebut').length;

  const totalValue = equipments.reduce((acc, eq) => acc + (eq.purchasePrice || 0), 0);
  
  // Categorized breakdown count
  const catCounts = categories.map(cat => {
    const count = equipments.filter(eq => eq.categoryId === cat.id).length;
    const value = equipments.filter(eq => eq.categoryId === cat.id).reduce((acc, eq) => acc + eq.purchasePrice, 0);
    return { ...cat, count, value };
  });

  // State breakdown counts
  const stateCounts = {
    Excellent: equipments.filter(e => e.state === 'Excellent').length,
    Bon: equipments.filter(e => e.state === 'Bon').length,
    Moyen: equipments.filter(e => e.state === 'Moyen').length,
    'En panne': equipments.filter(e => e.state === 'En panne').length,
    'Hors-service': equipments.filter(e => e.state === 'Hors-service').length,
  };

  // Get active maintenance tickets
  const activeMaintenances = maintenances.filter(m => m.status !== 'Clôturée');

  // helper icon mapper
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Laptop': return <Laptop className="h-5 w-5" />;
      case 'Monitor': return <Monitor className="h-5 w-5" />;
      case 'Printer': return <Printer className="h-5 w-5" />;
      case 'Network': return <Network className="h-5 w-5" />;
      default: return <Keyboard className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-4" id="dashboard_tab_panel">
      
      {/* SECTION 1: METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        
        {/* Total Assets */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Équipements Totaux</p>
            <h3 className="text-xl font-bold font-display text-slate-900 mt-1">{totalCount}</h3>
            <p className="text-[10px] text-slate-400 mt-1">Éléments enregistrés</p>
          </div>
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded">
            <Laptop className="h-5 w-5" />
          </div>
        </div>

        {/* Stock Disponible */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Stock Disponible</p>
            <h3 className="text-xl font-bold font-display text-emerald-600 mt-1">{availableCount}</h3>
            <p className="text-[10px] text-slate-400 mt-1">Prêts pour affectation</p>
          </div>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        {/* Matériel Affecté */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Matériel Affecté</p>
            <h3 className="text-xl font-bold font-display text-blue-600 mt-1">{allocatedCount}</h3>
            <p className="text-[10px] text-slate-400 mt-1">En service actif</p>
          </div>
          <div className="p-2 bg-blue-50 text-blue-600 rounded">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        {/* En Maintenance */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">En Maintenance</p>
            <h3 className="text-xl font-bold font-display text-amber-600 mt-1">{maintenanceCount}</h3>
            <p className="text-[10px] text-slate-400 mt-1">{activeMaintenances.length} ticket(s) en cours</p>
          </div>
          <div className="p-2 bg-amber-50 text-amber-600 rounded">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>

        {/* Total Price Value */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Valeur du Parc</p>
            <h3 className="text-lg font-bold font-display text-slate-900 mt-1">{totalValue.toLocaleString()} DH</h3>
            <p className="text-[10px] text-slate-400 mt-1">Cumul achat matériel</p>
          </div>
          <div className="p-2 bg-slate-100 text-slate-700 rounded">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* SECTION GRAPH: VALEUR ET MAINTENANCE COMPARES */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs" id="dashboard_interactive_brand_chart">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-150 gap-3">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span className="p-1 px-2 bg-indigo-50 text-indigo-700 rounded text-xs font-mono font-bold">📊 ANALYTIQUE</span>
              <span>Distribution Financière et Globale par Marque</span>
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Survolez les colonnes pour inspecter les coûts, effectifs de parc et ratios de maintenance.</p>
          </div>
          
          <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => { setActiveChartTab('value'); setHoveredBarIndex(null); }}
              className={`px-3 py-1 text-[11px] font-bold rounded cursor-pointer transition-all ${
                activeChartTab === 'value'
                  ? 'bg-indigo-600 text-white shadow-3xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Valeur du Stock (DH)
            </button>
            <button
              onClick={() => { setActiveChartTab('maintenance'); setHoveredBarIndex(null); }}
              className={`px-3 py-1 text-[11px] font-bold rounded cursor-pointer transition-all ${
                activeChartTab === 'maintenance'
                  ? 'bg-indigo-600 text-white shadow-3xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Coûts de Maintenance (DH)
            </button>
          </div>
        </div>

        {brandMetrics.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-slate-400 text-xs italic">
            Aucune donnée de marque à afficher. Veuillez ajouter des équipements.
          </div>
        ) : (
          <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Visual Bar graph columns */}
            <div className="md:col-span-8 space-y-2">
              {/* Chart Stage */}
              <div className="relative h-48 w-full border-b border-l border-slate-200 flex items-end justify-around px-2 pt-4">
                
                {/* Horizontal guide lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pl-1">
                  <div className="w-full border-t border-dashed border-slate-100 h-0" />
                  <div className="w-full border-t border-dashed border-slate-100 h-0" />
                  <div className="w-full border-t border-dashed border-slate-100 h-0" />
                  <div className="w-full border-t border-dashed border-slate-100 h-0" />
                  <div className="w-full border-t border-dashed border-slate-100 h-0" />
                </div>

                {/* Bars */}
                {brandMetrics.map((item, index) => {
                  const currentValue = activeChartTab === 'value' ? item.value : item.maintenanceCost;
                  const ratio = maxChartValue > 0 ? (currentValue / maxChartValue) * 100 : 0;
                  // Handle safe styling
                  const heightPct = isNaN(ratio) ? '0%' : `${Math.max(ratio, 4)}%`;
                  const isHovered = hoveredBarIndex === index;

                  return (
                    <div 
                      key={item.name}
                      onMouseEnter={() => setHoveredBarIndex(index)}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                      className="relative flex flex-col items-center justify-end h-full w-full max-w-[50px] group cursor-pointer"
                    >
                      {/* Interactive hover value overlay */}
                      {isHovered && (
                        <div className="absolute -top-7 px-2 py-1 bg-slate-900 text-white text-[9px] font-bold font-mono rounded shadow-xs z-20 whitespace-nowrap animate-bounce leading-none">
                          {currentValue.toLocaleString()} DH
                        </div>
                      )}

                      {/* Bar Pillar */}
                      <div 
                        className={`w-full rounded-t transition-all duration-350 relative overflow-hidden ${
                          isHovered 
                            ? 'bg-gradient-to-t from-indigo-700 to-indigo-500 shadow-md scale-x-[1.12]' 
                            : 'bg-gradient-to-t from-indigo-600 to-indigo-400'
                        }`}
                        style={{ height: heightPct }}
                      >
                        {/* Shimmer loading effect */}
                        <div className="absolute inset-x-0 top-0 h-1 bg-white/20" />
                      </div>

                      {/* X Axis label for brand */}
                      <div className="absolute -bottom-6 text-[10px] font-extrabold text-slate-700 font-mono tracking-tight whitespace-nowrap text-center">
                        {item.name}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="h-6" /> {/* Spacer underneath for labels */}
            </div>

            {/* Side breakdown and legends */}
            <div className="md:col-span-4 bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3.5 self-stretch flex flex-col justify-center">
              <h5 className="text-[11px] font-extrabold uppercase text-slate-400 tracking-widest leading-none">
                {activeChartTab === 'value' ? "Récapitulatif Financier" : "Frais de Réparation"}
              </h5>
              
              <div className="space-y-2.5">
                {brandMetrics.slice(0, 4).map((item, index) => {
                  const currentValue = activeChartTab === 'value' ? item.value : item.maintenanceCost;
                  return (
                    <div 
                      key={item.name}
                      className={`p-2 rounded-lg border transition-all ${
                        hoveredBarIndex === index 
                          ? 'border-indigo-300 bg-white shadow-3xs translate-x-1' 
                          : 'border-slate-200 bg-white/60'
                      }`}
                      onMouseEnter={() => setHoveredBarIndex(index)}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                        <span className="flex items-center gap-1.5 font-bold">
                          <span className="w-2 h-2 rounded-full bg-indigo-600" />
                          {item.name}
                        </span>
                        <span className="font-mono text-slate-900">{currentValue.toLocaleString()} DH</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-medium font-mono">
                        <span>{item.count} équipement(s)</span>
                        <span>Mnt : {item.maintenanceCost.toLocaleString()} DH</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* SECTION 2: CHARTS & HEALTH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Visual Charts (SVG/Bento Bar-graph style) */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 lg:col-span-7 space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Répartition par Catégorie de Matériel</h4>
            <p className="text-xs text-slate-500 mt-1">Taux d'occupation et densité d'équipements par famille technique</p>
          </div>

          <div className="space-y-4">
            {catCounts.map((cat) => {
              const pct = totalCount > 0 ? (cat.count / totalCount) * 100 : 0;
              return (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2.5 font-medium text-slate-700">
                      <div className="text-slate-400">{getCategoryIcon(cat.icon)}</div>
                      <span>{cat.name}</span>
                    </div>
                    <div className="font-mono text-slate-500">
                      <strong>{cat.count} elements </strong> 
                      <span className="text-slate-400">({pct.toFixed(0)}%)</span>
                      <span className="ml-2 font-semibold text-slate-700">| {cat.value.toLocaleString()} DH</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-indigo-600 rounded-full transition-all duration-500" 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
            <div className="p-2 border-r border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Rebut total</span>
              <span className="text-lg font-bold text-slate-600 block">{junkCount}</span>
            </div>
            <div className="p-2 border-r border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Garantie active</span>
              <span className="text-lg font-bold text-emerald-600 block">
                {equipments.filter(e => {
                  const months = e.warrantyMonths;
                  const purchase = new Date(e.purchaseDate);
                  const expiry = new Date(purchase.setMonth(purchase.getMonth() + months));
                  return expiry > new Date();
                }).length}
              </span>
            </div>
            <div className="p-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Taux Disponibilité</span>
              <span className="text-lg font-bold text-indigo-600 block">
                {totalCount > 0 ? ((availableCount / totalCount) * 100).toFixed(0) : 0}%
              </span>
            </div>
          </div>

        </div>

        {/* State of health list */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 lg:col-span-5 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-900">État de fonctionnement physique</h4>
            <p className="text-xs text-slate-500 mt-1">État constaté lors des inspections périodiques ou des restitutions</p>
          </div>

          {/* Condition indicators */}
          <div className="space-y-3.5">
            {[
              { label: 'Condition Excellente', count: stateCounts.Excellent, color: 'bg-emerald-500', text: 'text-emerald-700 bg-emerald-50' },
              { label: 'Condition Bonne', count: stateCounts.Bon, color: 'bg-teal-500', text: 'text-teal-700 bg-teal-50' },
              { label: 'Condition Moyenne', count: stateCounts.Moyen, color: 'bg-blue-500', text: 'text-blue-700 bg-blue-50' },
              { label: 'En panne déclarée', count: stateCounts['En panne'], color: 'bg-amber-500', text: 'text-amber-700 bg-amber-50' },
              { label: 'Hors service', count: stateCounts['Hors-service'], color: 'bg-rose-500', text: 'text-rose-700 bg-rose-50' },
            ].map((state, idx) => {
              const pct = totalCount > 0 ? (state.count / totalCount) * 100 : 0;
              return (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 font-medium">
                    <span className={`w-2.5 h-2.5 rounded-full ${state.color}`} />
                    <span className="text-slate-600">{state.label}</span>
                  </div>
                  <div className="flex items-center space-x-3.5">
                    <span className="font-mono text-slate-400">{pct.toFixed(0)}%</span>
                    <span className={`px-2.5 py-0.5 rounded font-bold font-mono ${state.text}`}>{state.count}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Academic Context reminder */}
          <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-lg text-xs leading-relaxed text-slate-600 flex items-start space-x-2.5">
            <ShieldCheck className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
            <span>
              <strong>Système de Suivi :</strong> Les états se mettent à jour automatiquement de façon bidirectionnelle à chaque fois qu'un utilisateur ou technicien soumet une action (reconstitution, maintenance, affectation).
            </span>
          </div>

        </div>

      </div>

      {/* SECTION 3: IMMINENT ISSUES & QUICK LINKS */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b border-slate-100 pb-4 gap-2">
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Anomalies et Interventions de Maintenance en attente</h4>
            <p className="text-xs text-gray-500 mt-0.5">Suivi des fiches techniques de pannes déclarées non encore résolues.</p>
          </div>
          <button 
            onClick={() => setActiveTab('maintenance')}
            className="text-xs text-indigo-600 font-semibold hover:underline bg-indigo-50 px-3 py-1.5 rounded cursor-pointer self-start"
          >
            Aller aux fiches de maintenance &rarr;
          </button>
        </div>

        {activeMaintenances.length === 0 ? (
          <div className="py-8 text-center text-slate-400 flex flex-col items-center justify-center space-y-2">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
            <p className="text-xs font-semibold text-slate-700">Aucune panne en cours d'attente</p>
            <p className="text-[11px] text-slate-400">Tous les équipements décrits sont opérationnels ou stockés.</p>
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Équipement</th>
                  <th className="py-2.5 px-3">Date Panne</th>
                  <th className="py-2.5 px-3">Description Incident</th>
                  <th className="py-2.5 px-3">Technicien en Charge</th>
                  <th className="py-2.5 px-3">Statut Ticket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeMaintenances.map((maint) => (
                  <tr key={maint.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{maint.equipmentModel}</div>
                      <div className="font-mono text-[10px] text-slate-400">{maint.equipmentCode}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{maint.reportedDate}</td>
                    <td className="py-3 px-3 max-w-sm font-medium text-slate-600 truncate">{maint.failureDescription}</td>
                    <td className="py-3 px-3 text-slate-700 font-medium">
                      {maint.technicianName === 'En attente d\'attribution' ? (
                        <span className="text-amber-600 italic bg-amber-50 px-2 py-0.5 rounded text-[11px]">Non assigné</span>
                      ) : (
                        <span>{maint.technicianName}</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                        maint.status === 'Déclarée' 
                          ? 'bg-rose-100 text-rose-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {maint.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
