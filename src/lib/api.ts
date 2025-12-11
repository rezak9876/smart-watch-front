// Mock API service following Laravel resource controller conventions
// All endpoints follow the pattern: /resource/{id}

import { Permission, getRolePermissions } from "./ability";
import { SetupStatus } from "@/store/authStore";

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
    ): Promise<{
      success: boolean;
      isNewUser: boolean;
      token: string;
      setup_status: SetupStatus;
      permissions: Permission[];
      user: {
        id: string;
        mobile: string;
        firstName?: string;
        lastName?: string;
        role: string;
      };
    }> => {
      await delay(800);
      console.log("API: POST /auth/verify", { mobile, code });
      const isNewUser = !localStorage.getItem(`user_${mobile}`);
      const role = localStorage.getItem(`user_role_${mobile}`) || "elder";
      return {
        success: code === "123456",
        isNewUser,
        token: "mock_token_" + Date.now(),
        setup_status: {
          profile_completed: !isNewUser,
          watch_paired: !isNewUser,
          owner_info_completed: !isNewUser,
          medications_set: !isNewUser,
        },
        permissions: getRolePermissions(role),
        user: {
          id: Date.now().toString(),
          mobile,
          firstName: isNewUser ? undefined : "علی",
          lastName: isNewUser ? undefined : "احمدی",
          role,
        },
      };
    },
    getPermissions: async (): Promise<{ permissions: Permission[] }> => {
      await delay(300);
      const role = localStorage.getItem("user_role") || "elder";
      return { permissions: getRolePermissions(role) };
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
    generateCode: async (): Promise<{ code: string; session_token: string }> => {
      await delay(500);
      console.log("API: POST /watches/generate-code");
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const session_token = "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
      return { code, session_token };
    },
    pair: async (code: string): Promise<{ success: boolean }> => {
      await delay(800);
      console.log("API: POST /watches/pair", { code });
      return { success: true };
    },
    confirmPairing: async (
      session_token: string,
      watch_code: string
    ): Promise<{ success: boolean }> => {
      await delay(800);
      console.log("API: POST /watches/pairing/confirm", { session_token, watch_code });
      return { success: watch_code === "123456" };
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
        {
          id: "2",
          firstName: "زهرا",
          lastName: "محمدی",
          mobile: "09129876543",
          role: "nurse",
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
      if (id === "1") {
        return {
          id: "1",
          firstName: "دکتر محمد",
          lastName: "رضایی",
          mobile: "09121234567",
          role: "doctor",
        };
      }
      return {
        id: "2",
        firstName: "زهرا",
        lastName: "محمدی",
        mobile: "09129876543",
        role: "nurse",
      };
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
      return [
        { id: "1", name: "آسپرین", description: "برای کاهش درد و تب" },
        { id: "2", name: "متفورمین", description: "برای کنترل قند خون" },
      ];
    },
    store: async (data: any): Promise<any> => {
      await delay(500);
      console.log("API: POST /medications", data);
      return { id: Date.now().toString(), ...data };
    },
    show: async (id: string): Promise<any> => {
      await delay(500);
      console.log(`API: GET /medications/${id}`);
      if (id === "1") {
        return { id: "1", name: "آسپرین", description: "برای کاهش درد و تب" };
      }
      return { id: "2", name: "متفورمین", description: "برای کنترل قند خون" };
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

  // Prescriptions resource
  prescriptions: {
    index: async (): Promise<any[]> => {
      await delay(500);
      console.log("API: GET /prescriptions");
      return [
        {
          id: "1",
          items: [
            { medication_id: "1", medication_name: "آسپرین", cycle_hours: 8, total_count: 30 },
            { medication_id: "2", medication_name: "متفورمین", cycle_hours: 12, total_count: null },
          ],
          created_at: new Date().toISOString(),
          doctor_name: "دکتر محمد رضایی",
        },
        {
          id: "2",
          items: [
            { medication_id: "3", medication_name: "لوزارتان", cycle_hours: 24, total_count: 60 },
          ],
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
          doctor_name: "دکتر سارا احمدی",
        },
        {
          id: "3",
          items: [
            { medication_id: "4", medication_name: "امپرازول", cycle_hours: 12, total_count: 14 },
            { medication_id: "5", medication_name: "ویتامین D", cycle_hours: 24, total_count: null },
          ],
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
          doctor_name: "دکتر محمد رضایی",
        },
      ];
    },
    store: async (data: any): Promise<any> => {
      await delay(500);
      console.log("API: POST /prescriptions", data);
      return { id: Date.now().toString(), ...data, created_at: new Date().toISOString() };
    },
    show: async (id: string): Promise<any> => {
      await delay(500);
      console.log(`API: GET /prescriptions/${id}`);
      return {
        id,
        items: [
          { medication_id: "1", medication_name: "آسپرین", cycle_hours: 8, total_count: 30 },
        ],
        created_at: new Date().toISOString(),
        doctor_name: "دکتر محمد رضایی",
      };
    },
    update: async (id: string, data: any): Promise<any> => {
      await delay(500);
      console.log(`API: PUT /prescriptions/${id}`, data);
      return { id, ...data };
    },
    destroy: async (id: string): Promise<void> => {
      await delay(500);
      console.log(`API: DELETE /prescriptions/${id}`);
    },
  },

  // Consumption resource
  consumptions: {
    index: async (): Promise<any[]> => {
      await delay(500);
      console.log("API: GET /consumptions");
      const today = new Date();
      return [
        {
          id: "1",
          prescription_item_id: "1",
          medication_name: "آسپرین",
          scheduled_at: new Date(today.setHours(8, 0, 0, 0)).toISOString(),
          scheduled_time: new Date(today.setHours(8, 0, 0, 0)).toISOString(),
          consumed_at: new Date(today.setHours(8, 15, 0, 0)).toISOString(),
          status: "consumed",
        },
        {
          id: "2",
          prescription_item_id: "1",
          medication_name: "آسپرین",
          scheduled_at: new Date(today.setHours(16, 0, 0, 0)).toISOString(),
          scheduled_time: new Date(today.setHours(16, 0, 0, 0)).toISOString(),
          consumed_at: null,
          status: "pending",
        },
        {
          id: "3",
          prescription_item_id: "2",
          medication_name: "متفورمین",
          scheduled_at: new Date(today.setHours(12, 0, 0, 0)).toISOString(),
          scheduled_time: new Date(today.setHours(12, 0, 0, 0)).toISOString(),
          consumed_at: null,
          status: "missed",
        },
      ];
    },
    store: async (data: any): Promise<any> => {
      await delay(500);
      console.log("API: POST /consumptions", data);
      return { id: Date.now().toString(), ...data, consumed_at: new Date().toISOString() };
    },
    update: async (id: string, data: any): Promise<any> => {
      await delay(500);
      console.log(`API: PUT /consumptions/${id}`, data);
      return { id, ...data };
    },
    getSchedule: async (date: string): Promise<any[]> => {
      await delay(500);
      console.log(`API: GET /consumptions/schedule?date=${date}`);
      const today = new Date();
      return [
        { id: "s1", time: "08:00", medication: "آسپرین", medication_name: "آسپرین", scheduled_time: new Date(today.setHours(8, 0, 0, 0)).toISOString(), status: "consumed", consumed_at: new Date(today.setHours(8, 15, 0, 0)).toISOString() },
        { id: "s2", time: "12:00", medication: "متفورمین", medication_name: "متفورمین", scheduled_time: new Date(today.setHours(12, 0, 0, 0)).toISOString(), status: "missed" },
        { id: "s3", time: "16:00", medication: "آسپرین", medication_name: "آسپرین", scheduled_time: new Date(today.setHours(16, 0, 0, 0)).toISOString(), status: "pending" },
        { id: "s4", time: "20:00", medication: "متفورمین", medication_name: "متفورمین", scheduled_time: new Date(today.setHours(20, 0, 0, 0)).toISOString(), status: "pending" },
      ];
    },
    getStats: async (): Promise<any> => {
      await delay(500);
      console.log("API: GET /consumptions/stats");
      return {
        total: 50,
        consumed: 42,
        missed: 8,
        adherence_rate: 84,
      };
    },
  },

  // Notifications resource
  notifications: {
    index: async (): Promise<any[]> => {
      await delay(500);
      console.log("API: GET /notifications");
      return [
        {
          id: "1",
          type: "fall",
          title: "سقوط تشخیص داده شد",
          message: "آیا سقوط کردید؟",
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          isRead: false,
          actionRequired: true,
        },
        {
          id: "2",
          type: "high_heart_rate",
          title: "ضربان قلب بالا",
          message: "ضربان قلب شما 120 است که بالاتر از حد نرمال است.",
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          isRead: false,
          actionRequired: false,
        },
        {
          id: "3",
          type: "response",
          title: "پاسخ بیمار",
          message: "بیمار پاسخ داد: خیر، سقوط نکردم.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          isRead: true,
          actionRequired: false,
        },
        {
          id: "4",
          type: "follow_up",
          title: "پیگیری",
          message: "دکتر محمد رضایی پیگیری کرد.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          isRead: true,
          actionRequired: false,
        },
        {
          id: "5",
          type: "medication_reminder",
          title: "یادآور دارو",
          message: "زمان مصرف آسپرین فرا رسیده است.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
          isRead: true,
          actionRequired: false,
        },
      ];
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
      return [
        {
          id: "1",
          text: "سلام، حال شما چطور است؟",
          senderId: "caregiver",
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
        {
          id: "2",
          text: "سلام، خوبم ممنون. داروهایم را مصرف کردم.",
          senderId: "user",
          timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        },
        {
          id: "3",
          text: "آفرین! یادتان باشد ساعت ۴ هم باید آسپرین بخورید.",
          senderId: "caregiver",
          timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        },
      ];
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
