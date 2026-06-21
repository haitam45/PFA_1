/**
 * Service d'accès aux APIs REST JSON et de stockage temporaire (cookies, localStorage)
 * Permet d'assurer la liaison entre le Frontend React et le Backend Spring Boot.
 */

// URL de base du backend Spring Boot
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * 1. Gestion du Stockage Temporaire (Cookies / Session / Cache)
 * Utilisé pour stocker temporairement les jetons de connexion, cookies ou paramètres d'acteur.
 */
export const TemporaryStorage = {
  /**
   * Écrit un cookie de manière temporaire
   * @param name Nom de la clé
   * @param value Valeur à stocker
   * @param daysDur Duration en jours (optionnel)
   */
  setCookie(name: string, value: string, daysDur: number = 1) {
    const date = new Date();
    date.setTime(date.getTime() + (daysDur * 24 * 60 * 60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/; SameSite=Lax";
  },

  /**
   * Récupère la valeur d'un cookie par son nom
   * @param name Nom du cookie
   */
  getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
  },

  /**
   * Efface un cookie spécifié
   */
  eraseCookie(name: string) {
    document.cookie = name + '=; Max-Age=-99999999; path=/; SameSite=Lax';
  }
};

/**
 * 2. Appels API REST (format JSON) correspondants au backend Spring Boot
 */
export const ApiService = {
  // CONFIGURATION DES HEADERS DE BASE EN FORMAT JSON
  getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // 'Authorization': `Bearer ${TemporaryStorage.getCookie('auth_token') || ''}` // Exemple de jeton temporaire JWT en cookie
    };
  },

  /**
   * Gère la réponse brute et extrait le JSON
   */
  async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
    }
    return response.json() as Promise<T>;
  },

  // === ACTEURS / COLLABORATEURS DYNAMIQUES ===
  users: {
    list: async () => {
      const res = await fetch(`${API_BASE_URL}/users`, {
        headers: ApiService.getHeaders()
      });
      return ApiService.handleResponse<any[]>(res);
    },
    get: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        headers: ApiService.getHeaders()
      });
      return ApiService.handleResponse<any>(res);
    },
    create: async (payload: any) => {
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: ApiService.getHeaders(),
        body: JSON.stringify(payload)
      });
      return ApiService.handleResponse<any>(res);
    },
    update: async (id: string, payload: any) => {
      const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: ApiService.getHeaders(),
        body: JSON.stringify(payload)
      });
      return ApiService.handleResponse<any>(res);
    },
    toggleStatus: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/users/${id}/toggle-status`, {
        method: 'PATCH',
        headers: ApiService.getHeaders()
      });
      return ApiService.handleResponse<any>(res);
    },
    delete: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: ApiService.getHeaders()
      });
      return ApiService.handleResponse<any>(res);
    },
    login: async (credentials: { username_or_email: string; password?: string }) => {
      const res = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: ApiService.getHeaders(),
        body: JSON.stringify(credentials)
      });
      const data = await ApiService.handleResponse<any>(res);
      // Stockage temporaire du rôle et de l'utilisateur actif dans les cookies
      TemporaryStorage.setCookie('active_user_id', data.id, 7);
      TemporaryStorage.setCookie('active_user_role', data.role, 7);
      return data;
    }
  },

  // === MATÉRIELS / ÉQUIPEMENTS ===
  equipments: {
    list: async () => {
      const res = await fetch(`${API_BASE_URL}/equipments`, {
        headers: ApiService.getHeaders()
      });
      return ApiService.handleResponse<any[]>(res);
    },
    create: async (payload: any) => {
      const res = await fetch(`${API_BASE_URL}/equipments`, {
        method: 'POST',
        headers: ApiService.getHeaders(),
        body: JSON.stringify(payload)
      });
      return ApiService.handleResponse<any>(res);
    },
    update: async (id: string, payload: any) => {
      const res = await fetch(`${API_BASE_URL}/equipments/${id}`, {
        method: 'PUT',
        headers: ApiService.getHeaders(),
        body: JSON.stringify(payload)
      });
      return ApiService.handleResponse<any>(res);
    },
    delete: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/equipments/${id}`, {
        method: 'DELETE',
        headers: ApiService.getHeaders()
      });
      return ApiService.handleResponse<any>(res);
    }
  },

  // === AFFECTATIONS (ALLOCATIONS) ===
  allocations: {
    list: async () => {
      const res = await fetch(`${API_BASE_URL}/allocations`, {
        headers: ApiService.getHeaders()
      });
      return ApiService.handleResponse<any[]>(res);
    },
    create: async (payload: any) => {
      const res = await fetch(`${API_BASE_URL}/allocations`, {
        method: 'POST',
        headers: ApiService.getHeaders(),
        body: JSON.stringify(payload)
      });
      return ApiService.handleResponse<any>(res);
    },
    update: async (id: string, payload: any) => {
      const res = await fetch(`${API_BASE_URL}/allocations/${id}`, {
        method: 'PUT',
        headers: ApiService.getHeaders(),
        body: JSON.stringify(payload)
      });
      return ApiService.handleResponse<any>(res);
    }
  },

  // === INTÉGRATIONS DE MAINTENANCE ===
  maintenances: {
    list: async () => {
      const res = await fetch(`${API_BASE_URL}/maintenances`, {
        headers: ApiService.getHeaders()
      });
      return ApiService.handleResponse<any[]>(res);
    },
    create: async (payload: any) => {
      const res = await fetch(`${API_BASE_URL}/maintenances`, {
        method: 'POST',
        headers: ApiService.getHeaders(),
        body: JSON.stringify(payload)
      });
      return ApiService.handleResponse<any>(res);
    },
    update: async (id: string, payload: any) => {
      const res = await fetch(`${API_BASE_URL}/maintenances/${id}`, {
        method: 'PUT',
        headers: ApiService.getHeaders(),
        body: JSON.stringify(payload)
      });
      return ApiService.handleResponse<any>(res);
    }
  },

  // === HISTORIQUE DES ACTIONS (LOGS) ===
  logs: {
    list: async () => {
      const res = await fetch(`${API_BASE_URL}/logs`, {
        headers: ApiService.getHeaders()
      });
      return ApiService.handleResponse<any[]>(res);
    },
    create: async (payload: any) => {
      const res = await fetch(`${API_BASE_URL}/logs`, {
        method: 'POST',
        headers: ApiService.getHeaders(),
        body: JSON.stringify(payload)
      });
      return ApiService.handleResponse<any>(res);
    }
  },

  // === NOTIFICATIONS ===
  notifications: {
    list: async () => {
      const res = await fetch(`${API_BASE_URL}/notifications`, {
        headers: ApiService.getHeaders()
      });
      return ApiService.handleResponse<any[]>(res);
    },
    listForRole: async (role: string) => {
      const res = await fetch(`${API_BASE_URL}/notifications/role/${role}`, {
        headers: ApiService.getHeaders()
      });
      return ApiService.handleResponse<any[]>(res);
    },
    create: async (payload: any) => {
      const res = await fetch(`${API_BASE_URL}/notifications`, {
        method: 'POST',
        headers: ApiService.getHeaders(),
        body: JSON.stringify(payload)
      });
      return ApiService.handleResponse<any>(res);
    },
    markRead: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: ApiService.getHeaders()
      });
      return ApiService.handleResponse<any>(res);
    },
    clearAll: async () => {
      const res = await fetch(`${API_BASE_URL}/notifications`, {
        method: 'DELETE',
        headers: ApiService.getHeaders()
      });
      return ApiService.handleResponse<any>(res);
    }
  }
};
