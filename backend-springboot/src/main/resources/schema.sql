-- ====================================================================
-- SCRIPT DE CREATION DES TABLES DU SYSTEME DE GESTION DU PARC INFORMATIQUE
-- compatible avec MySQL, MariaDB et PostgreSQL
-- placement recommandé : src/main/resources/schema.sql
-- ====================================================================

-- 1. Table des catégories d'équipements
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    icon VARCHAR(100) NOT NULL,
    description TEXT
);

-- 2. Table des utilisateurs (membres / acteurs du système)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL, -- ADMINISTRATEUR, GESTIONNAIRE, TECHNICIEN, BENEFICIAIRE
    department VARCHAR(255) NOT NULL,
    room VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    password VARCHAR(255) NOT NULL DEFAULT 'user123'
);

-- 3. Table des équipements (matériels informatiques)
CREATE TABLE IF NOT EXISTS equipments (
    id VARCHAR(255) PRIMARY KEY,
    code_inventaire VARCHAR(255) NOT NULL UNIQUE,
    serial_number VARCHAR(255) NOT NULL,
    category_id VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    purchase_date VARCHAR(50) NOT NULL, -- Date d'achat au format YYYY-MM-DD
    purchase_price DECIMAL(12, 2) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    warranty_months INT NOT NULL DEFAULT 12,
    status VARCHAR(50) NOT NULL, -- Disponible, Affecté, En maintenance, Mis au rebut
    state VARCHAR(50) NOT NULL, -- Excellent, Bon, Moyen, En panne, Hors-service
    location VARCHAR(255) NOT NULL,
    comment TEXT,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- 4. Table des affectations (allocations)
CREATE TABLE IF NOT EXISTS allocations (
    id VARCHAR(255) PRIMARY KEY,
    equipment_id VARCHAR(255) NOT NULL,
    equipment_code VARCHAR(255) NOT NULL,
    equipment_model VARCHAR(255) NOT NULL,
    beneficiary_id VARCHAR(255) NOT NULL, -- ID de l'user, ou nom de salle, ou nom de département
    beneficiary_type VARCHAR(50) NOT NULL, -- Utilisateur, Service, Salle
    beneficiary_name VARCHAR(255) NOT NULL,
    allocated_date VARCHAR(50) NOT NULL, -- Date d'affectation YYYY-MM-DD
    returned_date VARCHAR(50), -- Date de restitution effective
    responsable_name VARCHAR(255) NOT NULL,
    notes TEXT,
    status VARCHAR(50) NOT NULL, -- En cours, Clôturée
    FOREIGN KEY (equipment_id) REFERENCES equipments(id) ON DELETE CASCADE
);

-- 5. Table des maintenances
CREATE TABLE IF NOT EXISTS maintenances (
    id VARCHAR(255) PRIMARY KEY,
    equipment_id VARCHAR(255) NOT NULL,
    equipment_code VARCHAR(255) NOT NULL,
    equipment_model VARCHAR(255) NOT NULL,
    reported_date VARCHAR(50) NOT NULL, -- Date de signalement YYYY-MM-DD
    failure_description TEXT NOT NULL,
    diagnostics TEXT,
    solution TEXT,
    cost DECIMAL(12, 2),
    status VARCHAR(50) NOT NULL, -- Déclarante, En cours, Clôturée
    technician_name VARCHAR(255) NOT NULL,
    end_date VARCHAR(50), -- Date de fin effective
    final_state VARCHAR(50), -- État de l'équipement à la clôture (Excellent, Bon, etc.)
    FOREIGN KEY (equipment_id) REFERENCES equipments(id) ON DELETE CASCADE
);

-- 6. Table des journaux d'activité (Logs)
CREATE TABLE IF NOT EXISTS activity_logs (
    id VARCHAR(255) PRIMARY KEY,
    timestamp VARCHAR(50) NOT NULL,
    operator_name VARCHAR(255) NOT NULL,
    operator_role VARCHAR(100) NOT NULL,
    action_type VARCHAR(100) NOT NULL, -- Création, Modification, Affectation, Restitution, Panne, Maintenance...
    description TEXT NOT NULL,
    equipment_id VARCHAR(255),
    equipment_code VARCHAR(255)
);

-- 7. Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(255) PRIMARY KEY,
    timestamp VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    recipient_role VARCHAR(100) NOT NULL, -- ADMINISTRATEUR, GESTIONNAIRE, TECHNICIEN, BENEFICIAIRE, ALL
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    type VARCHAR(50) NOT NULL, -- allocation, restitution, breakdown, maintenance, system
    equipment_code VARCHAR(255)
);
