import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  fa: {
    translation: {
      // Authentication
      auth: {
        title: "ورود یا ثبت‌نام",
        mobileNumber: "شماره موبایل",
        mobileNumberPlaceholder: "9xxxxxxxxx",
        login: "ورود",
        register: "ثبت‌نام",
        invalidMobile: "شماره موبایل نامعتبر است",
        requiredField: "این فیلد الزامی است",
      },
      // OTP
      otp: {
        title: "تایید کد",
        description: "کد ارسال شده به شماره {{mobile}} را وارد کنید",
        verify: "تایید",
        resend: "ارسال مجدد",
        invalidCode: "کد وارد شده نامعتبر است",
      },
      // Watch Pairing
      watchPairing: {
        title: "اتصال ساعت",
        description: "کد زیر را در ساعت هوشمند وارد کنید",
        codeEntered: "وارد کردم",
        regenerate: "تولید مجدد کد",
      },
      // Dashboard
      dashboard: {
        title: "داشبورد",
        heartRate: "ضربان قلب",
        bloodOxygen: "اکسیژن خون",
        battery: "باتری",
        gps: "موقعیت مکانی",
        bpm: "ضربه در دقیقه",
        percent: "درصد",
        active: "فعال",
        inactive: "غیرفعال",
        statusExcellent: "عالی",
        statusGood: "خوب",
        statusWarning: "هشدار",
        statusCritical: "بحرانی",
        statusActive: "فعال",
      },
      // Profile
      profile: {
        title: "پروفایل",
        firstName: "نام",
        lastName: "نام خانوادگی",
        editProfile: "ویرایش پروفایل",
        save: "ذخیره",
      },
      // Watch Owner
      watchOwner: {
        title: "اطلاعات مالک ساعت",
        birthYear: "سال تولد",
        illnesses: "بیماری‌ها",
        illnessName: "نام بیماری",
        illnessDescription: "توضیحات",
        addIllness: "افزودن بیماری",
        removeIllness: "حذف",
      },
      // Caregivers
      caregivers: {
        title: "مراقبین",
        addCaregiver: "افزودن مراقب",
        role: "نقش",
        doctor: "پزشک",
        nurse: "پرستار",
        family: "خانواده",
        edit: "ویرایش",
        delete: "حذف",
        confirmDelete: "آیا از حذف این مراقب اطمینان دارید؟",
        cancel: "انصراف",
        confirm: "تایید",
        chat: "گفتگو",
      },
      // Medications
      medications: {
        title: "داروها",
        medicationName: "نام دارو",
        cycle: "دوره مصرف (ساعت)",
        description: "توضیحات",
        addMedication: "افزودن دارو",
        removeMedication: "حذف",
        viewOnly: "فقط مشاهده",
        doctorOnly: "فقط پزشک می‌تواند ویرایش کند",
      },
      // Notifications
      notifications: {
        title: "اعلان‌ها",
        fallDetected: "تشخیص سقوط",
        didYouFall: "آیا افتادید؟",
        yes: "بله",
        no: "خیر",
        iWillFollowUp: "پیگیری می‌کنم",
        elderFellNoResponse: "{{name}} سقوط کرده و هنوز پاسخ نداده است",
        elderResponded: "{{name}} پاسخ داد: {{response}}",
        someoneFollowingUp: "{{name}} در حال پیگیری است",
        markAsRead: "علامت‌گذاری به عنوان خوانده شده",
        unread: "خوانده نشده",
        read: "خوانده شده",
      },
      // Chat
      chat: {
        title: "گفتگو",
        typingPlaceholder: "پیام خود را بنویسید...",
        send: "ارسال",
        online: "آنلاین",
        offline: "آفلاین",
      },
      // Common
      common: {
        loading: "در حال بارگذاری...",
        error: "خطا",
        success: "موفق",
        back: "بازگشت",
        next: "بعدی",
        skip: "رد شدن",
        done: "تمام",
        logout: "خروج",
        cancel: "انصراف",
        delete: "حذف",
      },
      // Tour
      tour: {
        welcome: "خوش آمدید!",
        welcomeDesc: "بیایید به شما کمک کنیم تا با برنامه آشنا شوید",
        dashboardStep: "داشبورد شما",
        dashboardDesc: "اینجا وضعیت سلامت فرد سالمند را مشاهده می‌کنید",
        menuStep: "منوی اصلی",
        menuDesc: "از اینجا می‌توانید به تمام بخش‌ها دسترسی پیدا کنید",
      },
    },
  },
  en: {
    translation: {
      // Authentication
      auth: {
        title: "Login or Sign Up",
        mobileNumber: "Mobile Number",
        mobileNumberPlaceholder: "9xxxxxxxxx",
        login: "Login",
        register: "Register",
        invalidMobile: "Invalid mobile number",
        requiredField: "This field is required",
      },
      // OTP
      otp: {
        title: "Verify Code",
        description: "Enter the code sent to {{mobile}}",
        verify: "Verify",
        resend: "Resend",
        invalidCode: "Invalid code entered",
      },
      // Watch Pairing
      watchPairing: {
        title: "Pair Watch",
        description: "Enter this code on your smartwatch",
        codeEntered: "I've Entered It",
        regenerate: "Generate New Code",
      },
      // Dashboard
      dashboard: {
        title: "Dashboard",
        heartRate: "Heart Rate",
        bloodOxygen: "Blood Oxygen",
        battery: "Battery",
        gps: "GPS Location",
        bpm: "BPM",
        percent: "Percent",
        active: "Active",
        inactive: "Inactive",
        statusExcellent: "Excellent",
        statusGood: "Good",
        statusWarning: "Warning",
        statusCritical: "Critical",
        statusActive: "Active",
      },
      // Profile
      profile: {
        title: "Profile",
        firstName: "First Name",
        lastName: "Last Name",
        editProfile: "Edit Profile",
        save: "Save",
      },
      // Watch Owner
      watchOwner: {
        title: "Watch Owner Information",
        birthYear: "Birth Year",
        illnesses: "Illnesses",
        illnessName: "Illness Name",
        illnessDescription: "Description",
        addIllness: "Add Illness",
        removeIllness: "Remove",
      },
      // Caregivers
      caregivers: {
        title: "Caregivers",
        addCaregiver: "Add Caregiver",
        role: "Role",
        doctor: "Doctor",
        nurse: "Nurse",
        family: "Family",
        edit: "Edit",
        delete: "Delete",
        confirmDelete: "Are you sure you want to delete this caregiver?",
        cancel: "Cancel",
        confirm: "Confirm",
        chat: "Chat",
      },
      // Medications
      medications: {
        title: "Medications",
        medicationName: "Medication Name",
        cycle: "Cycle (hours)",
        description: "Description",
        addMedication: "Add Medication",
        removeMedication: "Remove",
        viewOnly: "View Only",
        doctorOnly: "Only doctors can edit",
      },
      // Notifications
      notifications: {
        title: "Notifications",
        fallDetected: "Fall Detected",
        didYouFall: "Did you fall?",
        yes: "Yes",
        no: "No",
        iWillFollowUp: "I Will Follow Up",
        elderFellNoResponse: "{{name}} has fallen and has not yet responded",
        elderResponded: "{{name}} responded: {{response}}",
        someoneFollowingUp: "{{name}} is following up",
        markAsRead: "Mark as Read",
        unread: "Unread",
        read: "Read",
      },
      // Chat
      chat: {
        title: "Chat",
        typingPlaceholder: "Type your message...",
        send: "Send",
        online: "Online",
        offline: "Offline",
      },
      // Common
      common: {
        loading: "Loading...",
        error: "Error",
        success: "Success",
        back: "Back",
        next: "Next",
        skip: "Skip",
        done: "Done",
        logout: "Logout",
        cancel: "Cancel",
        delete: "Delete",
      },
      // Tour
      tour: {
        welcome: "Welcome!",
        welcomeDesc: "Let us help you get familiar with the app",
        dashboardStep: "Your Dashboard",
        dashboardDesc: "Here you can see the elderly person's health status",
        menuStep: "Main Menu",
        menuDesc: "From here you can access all sections",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "fa",
  fallbackLng: "fa",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
