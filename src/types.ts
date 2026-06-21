/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'ADMINISTRATEUR' | 'GESTIONNAIRE' | 'TECHNICIEN' | 'BENEFICIAIRE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  room: string;
  isActive: boolean;
  password?: string;
  isPending?: boolean;
}

export interface Category {
  id: string;
  name: string;
  code: string; // e.g. 'ORD', 'ECR', 'IMP', 'RES', 'ACC'
  icon: string; // Lucide icon name
  description: string;
}

export type EquipmentStatus = 'Disponible' | 'Affecté' | 'En maintenance' | 'Mis au rebut';
export type EquipmentState = 'Excellent' | 'Bon' | 'Moyen' | 'En panne' | 'Hors-service';

export interface Equipment {
  id: string;
  codeInventaire: string; // e.g. 'INV-ORD-001'
  serialNumber: string;
  categoryId: string;
  brand: string;
  model: string;
  purchaseDate: string;
  purchasePrice: number;
  provider: string;
  warrantyMonths: number;
  status: EquipmentStatus;
  state: EquipmentState;
  location: string;
  comment: string;
}

export type AllocationType = 'Utilisateur' | 'Service' | 'Salle';

export interface Allocation {
  id: string;
  equipmentId: string;
  equipmentCode: string;
  equipmentModel: string;
  beneficiaryId: string; // User ID, Service name, or Room name
  beneficiaryType: AllocationType;
  beneficiaryName: string; // E.g. "Jean Dupont", "Service R&D", "Salle de TP 201"
  allocatedDate: string;
  returnedDate?: string;
  responsableName: string;
  notes: string;
  status: 'En cours' | 'Clôturée';
}

export type MaintenanceStatus = 'Déclarée' | 'En cours' | 'Clôturée';

export interface Maintenance {
  id: string;
  equipmentId: string;
  equipmentCode: string;
  equipmentModel: string;
  reportedDate: string;
  failureDescription: string;
  diagnostics?: string;
  solution?: string;
  cost?: number;
  status: MaintenanceStatus;
  technicianName: string;
  endDate?: string;
  finalState?: EquipmentState;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  operatorName: string;
  operatorRole: string;
  actionType: 'Création' | 'Modification' | 'Affectation' | 'Restitution' | 'Panne' | 'Maintenance' | 'Suppression';
  description: string;
  equipmentId?: string;
  equipmentCode?: string;
}

export interface Notification {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  recipientRole: Role | 'ALL'; // Receivers that see this notification
  isRead: boolean;
  type: 'allocation' | 'restitution' | 'breakdown' | 'maintenance' | 'system';
  equipmentCode?: string;
}

