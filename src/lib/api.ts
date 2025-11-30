// Mock API service following Laravel resource controller conventions
// All endpoints follow the pattern: /resource/{id}

const API_BASE_URL = "https://api.example.com";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock responses
export const api = {
  // Authentication endpoints
  auth: {
    sendOtp: async (mobile: string): Promise<{ success: boolean }> => {
      await delay(800);
      console.log("API: POST /auth/otp", { mobile });
      return { success: true };
    },
    verifyOtp: async (
      mobile: string,
      code: string
    ): Promise<{ success: boolean; isNewUser: boolean; token: string }> => {
      await delay(800);
      console.log("API: POST /auth/verify", { mobile, code });
      return {
        success: code === "123456",
        isNewUser: !localStorage.getItem(`user_${mobile}`),
        token: "mock_token_" + Date.now(),
      };
    },
  },

  // Users resource
  users: {
    index: async (): Promise<any[]> => {
      await delay(500);
      console.log("API: GET /users");
      return [];
    },
    store: async (data: any): Promise<any> => {
      await delay(500);
      console.log("API: POST /users", data);
      return { id: Date.now().toString(), ...data };
    },
    show: async (id: string): Promise<any> => {
      await delay(500);
      console.log(`API: GET /users/${id}`);
      return {
        id,
        firstName: "علی",
        lastName: "احمدی",
        mobile: "09123456789",
      };
    },
    update: async (id: string, data: any): Promise<any> => {
      await delay(500);
      console.log(`API: PUT /users/${id}`, data);
      return { id, ...data };
    },
    destroy: async (id: string): Promise<void> => {
      await delay(500);
      console.log(`API: DELETE /users/${id}`);
    },
  },

  // Watch pairing resource
  watches: {
    generateCode: async (): Promise<{ code: string }> => {
      await delay(500);
      console.log("API: POST /watches/generate-code");
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      return { code };
    },
    pair: async (code: string): Promise<{ success: boolean }> => {
      await delay(800);
      console.log("API: POST /watches/pair", { code });
      return { success: true };
    },
  },

  // Health data resource
  health: {
    index: async (): Promise<any> => {
      await delay(500);
      console.log("API: GET /health");
      return {
        heartRate: {
          value: 72,
          status: "good",
          timestamp: new Date().toISOString(),
        },
        bloodOxygen: {
          value: 98,
          status: "excellent",
          timestamp: new Date().toISOString(),
        },
        battery: {
          value: 75,
          status: "good",
          timestamp: new Date().toISOString(),
        },
        gps: {
          latitude: 35.6892,
          longitude: 51.389,
          status: "active",
          timestamp: new Date().toISOString(),
        },
      };
    },
  },

  // Caregivers resource
  caregivers: {
    index: async (): Promise<any[]> => {
      await delay(500);
      console.log("API: GET /caregivers");
      return [
        {
          id: "1",
          firstName: "دکتر محمد",
          lastName: "رضایی",
          mobile: "09121234567",
          role: "doctor",
        },
      ];
    },
    store: async (data: any): Promise<any> => {
      await delay(500);
      console.log("API: POST /caregivers", data);
      return { id: Date.now().toString(), ...data };
    },
    show: async (id: string): Promise<any> => {
      await delay(500);
      console.log(`API: GET /caregivers/${id}`);
      return { id };
    },
    update: async (id: string, data: any): Promise<any> => {
      await delay(500);
      console.log(`API: PUT /caregivers/${id}`, data);
      return { id, ...data };
    },
    destroy: async (id: string): Promise<void> => {
      await delay(500);
      console.log(`API: DELETE /caregivers/${id}`);
    },
  },

  // Medications resource
  medications: {
    index: async (): Promise<any[]> => {
      await delay(500);
      console.log("API: GET /medications");
      return [];
    },
    store: async (data: any): Promise<any> => {
      await delay(500);
      console.log("API: POST /medications", data);
      return { id: Date.now().toString(), ...data };
    },
    show: async (id: string): Promise<any> => {
      await delay(500);
      console.log(`API: GET /medications/${id}`);
      return { id };
    },
    update: async (id: string, data: any): Promise<any> => {
      await delay(500);
      console.log(`API: PUT /medications/${id}`, data);
      return { id, ...data };
    },
    destroy: async (id: string): Promise<void> => {
      await delay(500);
      console.log(`API: DELETE /medications/${id}`);
    },
  },

  // Notifications resource
  notifications: {
    index: async (): Promise<any[]> => {
      await delay(500);
      console.log("API: GET /notifications");
      return [];
    },
    show: async (id: string): Promise<any> => {
      await delay(500);
      console.log(`API: GET /notifications/${id}`);
      return { id };
    },
    update: async (id: string, data: any): Promise<any> => {
      await delay(500);
      console.log(`API: PUT /notifications/${id}`, data);
      return { id, ...data };
    },
    markAsRead: async (id: string): Promise<void> => {
      await delay(500);
      console.log(`API: POST /notifications/${id}/read`);
    },
  },

  // Messages resource (chat)
  messages: {
    index: async (caregiverId: string): Promise<any[]> => {
      await delay(500);
      console.log(`API: GET /messages?caregiver_id=${caregiverId}`);
      return [];
    },
    store: async (data: any): Promise<any> => {
      await delay(500);
      console.log("API: POST /messages", data);
      return {
        id: Date.now().toString(),
        ...data,
        timestamp: new Date().toISOString(),
      };
    },
  },

  // Illnesses resource
  illnesses: {
    index: async (): Promise<any[]> => {
      await delay(500);
      console.log("API: GET /illnesses");
      return [];
    },
    store: async (data: any): Promise<any> => {
      await delay(500);
      console.log("API: POST /illnesses", data);
      return { id: Date.now().toString(), ...data };
    },
    update: async (id: string, data: any): Promise<any> => {
      await delay(500);
      console.log(`API: PUT /illnesses/${id}`, data);
      return { id, ...data };
    },
    destroy: async (id: string): Promise<void> => {
      await delay(500);
      console.log(`API: DELETE /illnesses/${id}`);
    },
  },
};
