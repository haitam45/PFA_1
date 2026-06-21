/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, User, Category, Equipment, Allocation, Maintenance, ActivityLog, EquipmentState, EquipmentStatus, Notification } from '../types';
import { PRESET_USERS, PRESET_CATEGORIES, PRESET_EQUIPMENTS, PRESET_ALLOCATIONS, PRESET_MAINTENANCES, PRESET_LOGS } from '../initialData';

interface AppContextProps {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  currentUser: User;
  setCurrentUser: (usr: User) => void;
  
  isLoggedIn: boolean;
  loginUser: (usr: User) => void;
  logoutUser: () => void;

  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  categories: Category[];
  equipments: Equipment[];
  allocations: Allocation[];
  maintenances: Maintenance[];
  logs: ActivityLog[];
  notifications: Notification[];
  
  addEquipment: (eq: Omit<Equipment, 'id'>) => void;
  updateEquipment: (eq: Equipment) => void;
  deleteEquipment: (id: string) => void;
  
  allocateEquipment: (equipmentId: string, beneficiaryId: string, beneficiaryType: 'Utilisateur' | 'Service' | 'Salle', beneficiaryName: string, notes: string) => void;
  restituteEquipment: (equipmentId: string, finalState: EquipmentState, notes: string) => void;
  
  declareFailure: (equipmentId: string, description: string) => void;
  updateMaintenance: (maintenanceId: string, diagnostics: string, solution?: string, cost?: number) => void;
  closeMaintenance: (maintenanceId: string, finalState: EquipmentState, solution: string, cost: number) => void;

  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (user: User) => void;

  addNotification: (title: string, message: string, recipientRole: Role | 'ALL', type: Notification['type'], eqCode?: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const PRESET_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    title: 'Alerte Diagnostic requis',
    message: 'L\'imprimante HP LaserJet Pro (INV-IMP-001) est en panne mécanique. Veuillez vérifier à l\'atelier.',
    recipientRole: 'TECHNICIEN',
    isRead: false,
    type: 'breakdown',
    equipmentCode: 'INV-IMP-001'
  },
  {
    id: 'notif-2',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    title: 'Retour d\'équipement acté',
    message: 'L\'ordinateur portable Dell XPS 15 (INV-ORD-001) a été retourné au stock principal.',
    recipientRole: 'ADMINISTRATEUR',
    isRead: false,
    type: 'restitution',
    equipmentCode: 'INV-ORD-001'
  },
  {
    id: 'notif-3',
    timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
    title: 'Nouveau matériel assigné',
    message: 'Le MacBook Pro 14" M3 (INV-ORD-002) vous a été affecté à votre bureau.',
    recipientRole: 'BENEFICIAIRE',
    isRead: false,
    type: 'allocation',
    equipmentCode: 'INV-ORD-002'
  }
];

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('pfa_users');
    const loaded: User[] = saved ? JSON.parse(saved) : PRESET_USERS;
    return loaded.map(u => {
      if (!u.password) {
        if (u.role === 'ADMINISTRATEUR') return { ...u, password: 'admin123' };
        if (u.role === 'GESTIONNAIRE') return { ...u, password: 'gest123' };
        if (u.role === 'TECHNICIEN') return { ...u, password: 'tech123' };
        return { ...u, password: 'user123' };
      }
      return u;
    });
  });

  // Track fully dynamic authenticated user profile
  const [currentUser, setCurrentUserState] = useState<User>(() => {
    const savedUsers = localStorage.getItem('pfa_users');
    let parsedUsers: User[] = savedUsers ? JSON.parse(savedUsers) : PRESET_USERS;
    parsedUsers = parsedUsers.map(u => {
      if (!u.password) {
        if (u.role === 'ADMINISTRATEUR') return { ...u, password: 'admin123' };
        if (u.role === 'GESTIONNAIRE') return { ...u, password: 'gest123' };
        if (u.role === 'TECHNICIEN') return { ...u, password: 'tech123' };
        return { ...u, password: 'user123' };
      }
      return u;
    });
    const savedId = localStorage.getItem('pfa_current_user_id');
    const match = parsedUsers.find((u: User) => u.id === savedId);
    return match || parsedUsers[0];
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('pfa_is_logged_in') === 'true';
  });

  const loginUser = (usr: User) => {
    setCurrentUserState(usr);
    setIsLoggedIn(true);
    localStorage.setItem('pfa_is_logged_in', 'true');
    localStorage.setItem('pfa_current_user_id', usr.id);
    addLog('Modification', `Connexion de l'acteur : ${usr.name} (${usr.role})`);
  };

  const logoutUser = () => {
    addLog('Modification', `Déconnexion de l'acteur : ${currentUser.name} (${currentUser.role})`);
    setIsLoggedIn(false);
    localStorage.removeItem('pfa_is_logged_in');
  };

  const currentRole = currentUser.role;

  const [equipments, setEquipments] = useState<Equipment[]>(() => {
    const saved = localStorage.getItem('pfa_equipments');
    return saved ? JSON.parse(saved) : PRESET_EQUIPMENTS;
  });

  const [allocations, setAllocations] = useState<Allocation[]>(() => {
    const saved = localStorage.getItem('pfa_allocations');
    return saved ? JSON.parse(saved) : PRESET_ALLOCATIONS;
  });

  const [maintenances, setMaintenances] = useState<Maintenance[]>(() => {
    const saved = localStorage.getItem('pfa_maintenances');
    return saved ? JSON.parse(saved) : PRESET_MAINTENANCES;
  });

  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('pfa_logs');
    return saved ? JSON.parse(saved) : PRESET_LOGS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('pfa_notifications');
    return saved ? JSON.parse(saved) : PRESET_NOTIFICATIONS;
  });

  const categories = PRESET_CATEGORIES;

  // Persist to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('pfa_current_user_id', currentUser.id);
      localStorage.setItem('pfa_current_role', currentUser.role);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('pfa_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('pfa_equipments', JSON.stringify(equipments));
  }, [equipments]);

  useEffect(() => {
    localStorage.setItem('pfa_allocations', JSON.stringify(allocations));
  }, [allocations]);

  useEffect(() => {
    localStorage.setItem('pfa_maintenances', JSON.stringify(maintenances));
  }, [maintenances]);

  useEffect(() => {
    localStorage.setItem('pfa_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('pfa_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Helper helper to write action logs
  const addLog = (
    actionType: ActivityLog['actionType'],
    description: string,
    equipmentId?: string,
    equipmentCode?: string
  ) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      operatorName: currentUser.name,
      operatorRole: currentUser.role,
      actionType,
      description,
      equipmentId,
      equipmentCode,
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Helper helper to create notifications to users/roles
  const addNotification = (
    title: string,
    message: string,
    recipientRole: Role | 'ALL',
    type: Notification['type'],
    equipmentCode?: string
  ) => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      title,
      message,
      recipientRole,
      isRead: false,
      type,
      equipmentCode,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const setCurrentRole = (role: Role) => {
    const matchingUser = users.find(u => u.role === role && u.isActive) || users.find(u => u.role === role);
    if (matchingUser) {
      setCurrentUserState(matchingUser);
      addLog('Modification', `Changement de rôle vers : ${role} (Utilisateur : ${matchingUser.name})`);
    }
  };

  const setCurrentUser = (usr: User) => {
    setCurrentUserState(usr);
    addLog('Modification', `Changement de profil d'acteur vers : ${usr.name} (${usr.role})`);
  };

  // EQUIPMENTS OPERATIONS
  const addEquipment = (eq: Omit<Equipment, 'id'>) => {
    const newId = `eq-${Date.now()}`;
    const newEq: Equipment = { ...eq, id: newId };
    setEquipments(prev => [newEq, ...prev]);
    addLog(
      'Création',
      `Ajout du nouvel équipement ${newEq.brand} ${newEq.model} (${newEq.codeInventaire}) au stock principal.`,
      newId,
      newEq.codeInventaire
    );
  };

  const updateEquipment = (eq: Equipment) => {
    setEquipments(prev => prev.map(item => (item.id === eq.id ? eq : item)));
    addLog(
      'Modification',
      `Mise à jour des fiches techniques de l'équipement (${eq.codeInventaire}) : ${eq.brand} ${eq.model}.`,
      eq.id,
      eq.codeInventaire
    );
  };

  const deleteEquipment = (id: string) => {
    const target = equipments.find(item => item.id === id);
    if (!target) return;
    setEquipments(prev => prev.filter(item => item.id !== id));
    addLog(
      'Suppression',
      `Retrait définitif de l'équipement ${target.brand} ${target.model} (${target.codeInventaire}) du catalogue.`,
      id,
      target.codeInventaire
    );
  };

  // ALLOCATION OPERATIONS
  const allocateEquipment = (
    equipmentId: string,
    beneficiaryId: string,
    beneficiaryType: 'Utilisateur' | 'Service' | 'Salle',
    beneficiaryName: string,
    notes: string
  ) => {
    const targetEq = equipments.find(e => e.id === equipmentId);
    if (!targetEq) return;
    const codeInv = targetEq.codeInventaire;
    const nameModel = `${targetEq.brand} ${targetEq.model}`;

    // 1. Update Equipment status
    setEquipments(prev =>
      prev.map(item => {
        if (item.id === equipmentId) {
          return { ...item, status: 'Affecté' as const };
        }
        return item;
      })
    );

    // 2. Add New Allocation
    const newAlloc: Allocation = {
      id: `alloc-${Date.now()}`,
      equipmentId,
      equipmentCode: codeInv,
      equipmentModel: nameModel,
      beneficiaryId,
      beneficiaryType,
      beneficiaryName,
      allocatedDate: new Date().toISOString().split('T')[0],
      responsableName: currentUser.name,
      notes,
      status: 'En cours',
    };

    setAllocations(prev => [newAlloc, ...prev]);
    addLog(
      'Affectation',
      `Affectation du matériel ${nameModel} (${codeInv}) à la cible [${beneficiaryType}] : ${beneficiaryName}.`,
      equipmentId,
      codeInv
    );

    // Auto-create Notifications for target roles
    addNotification(
      'Nouvelle affectation',
      `L'équipement ${nameModel} (${codeInv}) a été affecté à [${beneficiaryType}] ${beneficiaryName}.`,
      'ADMINISTRATEUR',
      'allocation',
      codeInv
    );
    addNotification(
      'Nouvelle affectation',
      `L'équipement ${nameModel} (${codeInv}) a été affecté à [${beneficiaryType}] ${beneficiaryName}.`,
      'GESTIONNAIRE',
      'allocation',
      codeInv
    );
    addNotification(
      'Nouveau matériel attribué',
      `L'ordinateur/équipement ${nameModel} (${codeInv}) vous a été affecté par ${currentUser.name}.`,
      'BENEFICIAIRE',
      'allocation',
      codeInv
    );
  };

  const restituteEquipment = (equipmentId: string, finalState: EquipmentState, notes: string) => {
    const targetEq = equipments.find(e => e.id === equipmentId);
    if (!targetEq) return;
    const codeInv = targetEq.codeInventaire;
    const nameModel = `${targetEq.brand} ${targetEq.model}`;

    // 1. Mark existing allocation for this equipment as "Clôturée"
    setAllocations(prev =>
      prev.map(alloc => {
        if (alloc.equipmentId === equipmentId && alloc.status === 'En cours') {
          return {
            ...alloc,
            status: 'Clôturée' as const,
            returnedDate: new Date().toISOString().split('T')[0],
            notes: alloc.notes ? `${alloc.notes} | Retour: ${notes}` : notes,
          };
        }
        return alloc;
      })
    );

    // 2. Bring equipment back to "Disponible" or "En maintenance" depending on its final condition
    const isFaulty = finalState === 'En panne' || finalState === 'Hors-service';
    const nextStatus = isFaulty ? ('En maintenance' as const) : ('Disponible' as const);

    setEquipments(prev =>
      prev.map(item => {
        if (item.id === equipmentId) {
          return {
            ...item,
            status: nextStatus,
            state: finalState,
            location: isFaulty ? 'Atelier Hardware' : 'Magasin Principal',
          };
        }
        return item;
      })
    );

    addLog(
      'Restitution',
      `Restitution du matériel ${nameModel} (${codeInv}). Condition constatée: ${finalState}. Statut réorienté: ${nextStatus}.`,
      equipmentId,
      codeInv
    );

    // Create custom notification parameters
    addNotification(
      'Restitution d\'équipement',
      `L'équipement ${nameModel} (${codeInv}) a été restitué par son bénéficiaire (État : ${finalState}).`,
      'ADMINISTRATEUR',
      'restitution',
      codeInv
    );
    addNotification(
      'Restitution d\'équipement',
      `L'équipement ${nameModel} (${codeInv}) a été restitué par son bénéficiaire (État : ${finalState}).`,
      'GESTIONNAIRE',
      'restitution',
      codeInv
    );
    addNotification(
      'Déchargement de matériel',
      `Le déchargement de l'équipement ${nameModel} (${codeInv}) a été validé avec succès.`,
      'BENEFICIAIRE',
      'restitution',
      codeInv
    );

    // 3. If faulty, automatically schedule a maintenance ticket
    if (isFaulty) {
      const newMaint: Maintenance = {
        id: `maint-${Date.now()}`,
        equipmentId,
        equipmentCode: codeInv,
        equipmentModel: nameModel,
        reportedDate: new Date().toISOString().split('T')[0],
        failureDescription: `Déclaré défaillant lors de la restitution : ${notes}`,
        status: 'Déclarée',
        technicianName: 'En attente d\'attribution',
      };
      setMaintenances(prev => [newMaint, ...prev]);
      addLog(
        'Panne',
        `Création automatique d'une fiche de maintenance suite à restitution défaillante de (${codeInv}).`,
        equipmentId,
        codeInv
      );

      addNotification(
        'Alerte Panne à traiter',
        `L'équipement ${nameModel} (${codeInv}) retourné défaillant nécessite un diagnostic d'atelier.`,
        'TECHNICIEN',
        'breakdown',
        codeInv
      );
    }
  };

  // MAINTENANCE OPERATIONS
  const declareFailure = (equipmentId: string, description: string) => {
    const targetEq = equipments.find(e => e.id === equipmentId);
    if (!targetEq) return;
    const codeInv = targetEq.codeInventaire;
    const nameModel = `${targetEq.brand} ${targetEq.model}`;

    // 1. Close active allocation of this item if it was assigned
    setAllocations(prev =>
      prev.map(alloc => {
        if (alloc.equipmentId === equipmentId && alloc.status === 'En cours') {
          return {
            ...alloc,
            status: 'Clôturée' as const,
            returnedDate: new Date().toISOString().split('T')[0],
            notes: alloc.notes ? `${alloc.notes} | Cloturé pour panne: ${description}` : `Cloturé pour panne: ${description}`,
          };
        }
        return alloc;
      })
    );

    // 2. Set equipment to faulty status
    setEquipments(prev =>
      prev.map(item => {
        if (item.id === equipmentId) {
          return {
            ...item,
            status: 'En maintenance' as const,
            state: 'En panne' as const,
            location: 'Atelier Hardware',
          };
        }
        return item;
      })
    );

    // 3. Spawn a maintenance record
    const newMaint: Maintenance = {
      id: `maint-${Date.now()}`,
      equipmentId,
      equipmentCode: codeInv,
      equipmentModel: nameModel,
      reportedDate: new Date().toISOString().split('T')[0],
      failureDescription: description,
      status: 'Déclarée',
      technicianName: 'En attente d\'attribution',
    };

    setMaintenances(prev => [newMaint, ...prev]);
    addLog(
      'Panne',
      `Signalement d'incident sur le matériel ${nameModel} (${codeInv}) pour motif : ${description}`,
      equipmentId,
      codeInv
    );

    // Auto-create Notifications
    addNotification(
      'Signalement d\'incident',
      `Incident déclaré par ${currentUser.name} sur ${nameModel} (${codeInv}) : ${description}`,
      'ADMINISTRATEUR',
      'breakdown',
      codeInv
    );
    addNotification(
      'Signalement d\'incident',
      `Incident déclaré par ${currentUser.name} sur ${nameModel} (${codeInv}) : ${description}`,
      'GESTIONNAIRE',
      'breakdown',
      codeInv
    );
    addNotification(
      'Panne à diagnostiquer',
      `Un incident requiert votre diagnostic à l'atelier sur le matériel ${nameModel} (${codeInv}).`,
      'TECHNICIEN',
      'breakdown',
      codeInv
    );
  };

  const updateMaintenance = (maintenanceId: string, diagnostics: string, solution?: string, cost?: number) => {
    setMaintenances(prev =>
      prev.map(m => {
        if (m.id === maintenanceId) {
          return {
            ...m,
            diagnostics,
            solution: solution || m.solution,
            cost: cost !== undefined ? cost : m.cost,
            status: 'En cours' as const,
            technicianName: currentUser.name, // technician taking responsibility
          };
        }
        return m;
      })
    );
  };

  const closeMaintenance = (
    maintenanceId: string,
    finalState: EquipmentState,
    solution: string,
    cost: number
  ) => {
    const targetMaint = maintenances.find(m => m.id === maintenanceId);
    if (!targetMaint) return;
    const eqId = targetMaint.equipmentId;
    const codeInv = targetMaint.equipmentCode;
    const nameModel = targetMaint.equipmentModel;

    // 1. Update Maintenance ticket
    setMaintenances(prev =>
      prev.map(m => {
        if (m.id === maintenanceId) {
          return {
            ...m,
            solution,
            cost,
            finalState,
            status: 'Clôturée' as const,
            endDate: new Date().toISOString().split('T')[0],
            technicianName: m.technicianName === 'En attente d\'attribution' ? currentUser.name : m.technicianName,
          };
        }
        return m;
      })
    );

    // 2. Set equipment to its final condition and status based on outcome
    const isStillBroken = finalState === 'En panne' || finalState === 'Hors-service';
    const nextStatus = isStillBroken ? ('Mis au rebut' as const) : ('Disponible' as const);
    const nextLocation = isStillBroken ? 'Zone de recyclage / Rebut' : 'Magasin Principal';

    setEquipments(prev =>
      prev.map(item => {
        if (item.id === eqId) {
          return {
            ...item,
            status: nextStatus,
            state: finalState,
            location: nextLocation,
            comment: `Sortie de maintenance le ${new Date().toISOString().split('T')[0]}. Solution: ${solution}.`,
          };
        }
        return item;
      })
    );

    addLog(
      'Maintenance',
      `Résolution et clôture de la fiche maintenance relative à ${nameModel} (${codeInv}). Coût: ${cost} DH, Solution appliquée: ${solution}, État final: ${finalState}.`,
      eqId,
      codeInv
    );

    // Spawn rich closing notifications
    addNotification(
      'Maintenance résolue',
      `L'équipement ${nameModel} (${codeInv}) est remis en service. Solution appliquée : ${solution} (Coût : ${cost} DH).`,
      'ADMINISTRATEUR',
      'maintenance',
      codeInv
    );
    addNotification(
      'Maintenance résolue',
      `L'équipement ${nameModel} (${codeInv}) est remis en service. Solution appliquée : ${solution} (Coût : ${cost} DH).`,
      'GESTIONNAIRE',
      'maintenance',
      codeInv
    );
    addNotification(
      'Matériel de retour d\'atelier',
      `L'appareil ${nameModel} (${codeInv}) a été réparé et remis au magasin disponible pour dotation.`,
      'BENEFICIAIRE',
      'maintenance',
      codeInv
    );
  };

  // USERS OPERATIONS
  const addUser = (usr: Omit<User, 'id'>) => {
    const newId = `user-${Date.now()}`;
    const newUser: User = { ...usr, id: newId };
    setUsers(prev => [...prev, newUser]);
    addLog('Modification', `Ajout du compte de l'utilisateur ${newUser.name} [Département: ${newUser.department}] au registre.`);
  };

  const updateUser = (usr: User) => {
    setUsers(prev => prev.map(item => (item.id === usr.id ? usr : item)));
    addLog('Modification', `Modification du compte ou des droits administratifs de ${usr.name}.`);
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        setCurrentUser,
        isLoggedIn,
        loginUser,
        logoutUser,
        users,
        setUsers,
        categories,
        equipments,
        allocations,
        maintenances,
        logs,
        notifications,
        addEquipment,
        updateEquipment,
        deleteEquipment,
        allocateEquipment,
        restituteEquipment,
        declareFailure,
        updateMaintenance,
        closeMaintenance,
        addUser,
        updateUser,
        addNotification,
        markNotificationAsRead,
        clearAllNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
