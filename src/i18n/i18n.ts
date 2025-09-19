import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: "Dashboard",
      farms: "Farms",
      batches: "Batches",
      tasks: "Tasks",
      activities: "Activities",
      health: "Health",
      analytics: "Analytics",
      profile: "Profile",
      settings: "Settings",
      logout: "Logout",
      
      // Dashboard
      welcomeBack: "Welcome back",
      farmOverview: "Here's what's happening with your farm today",
      totalBirds: "Total Birds",
      eggsToday: "Eggs Today",
      feedRemaining: "Feed Remaining",
      monthlyRevenue: "Monthly Revenue",
      quickActions: "Quick Actions",
      addNewBatch: "Add New Batch",
      recordActivity: "Record Activity",
      healthCheck: "Health Check",
      viewReports: "View Reports",
      todaysTasks: "Today's Tasks",
      recentAlerts: "Recent Alerts",
      recentActivities: "Recent Activities",
      viewAllTasks: "View All Tasks",
      viewAllActivities: "View All Activities",
      
      // Profile
      myProfile: "My Profile",
      editProfile: "Edit Profile",
      profileCompletion: "Profile Completion",
      completed: "completed",
      personalInformation: "Personal Information",
      contactInformation: "Contact Information",
      fullName: "Full Name",
      email: "Email",
      phone: "Phone",
      address: "Address",
      experienceLevel: "Experience Level",
      beginner: "Beginner",
      intermediate: "Intermediate",
      experienced: "Experienced",
      expert: "Expert",
      notProvided: "Not provided",
      notSet: "Not Set",
      
      // Settings
      systemSettings: "System Settings",
      language: "Language",
      currency: "Currency",
      notifications: "Notifications",
      accountSettings: "Account Settings",
      changePassword: "Change Password",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmPassword: "Confirm Password",
      saveChanges: "Save Changes",
      cancel: "Cancel",
      
      // Forms
      enterYourFullName: "Enter your full name",
      enterYourPhoneNumber: "Enter your phone number",
      enterYourAddress: "Enter your address",
      selectExperienceLevel: "Select experience level",
      enterCurrentPassword: "Enter current password",
      enterNewPassword: "Enter new password",
      confirmNewPassword: "Confirm new password",
      
      // Stats
      totalFarms: "Total Farms",
      totalBatches: "Total Batches",
      activeFarms: "Active farms under management",
      activePoultryBatches: "Active poultry batches",
      totalBirdsCount: "Total birds across all batches",
      daysRemaining: "days remaining",
      efficiency: "efficiency",
      thisWeek: "this week",
      fromLastMonth: "from last month",
      
      // Actions
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      view: "View",
      add: "Add",
      create: "Create",
      update: "Update",
      loading: "Loading",
      error: "Error",
      success: "Success",
      warning: "Warning",
      
      // Messages
      profileUpdatedSuccessfully: "Profile updated successfully",
      failedToUpdateProfile: "Failed to update profile",
      pleaseTryAgainLater: "Please try again later",
      loadingYourProfile: "Loading your profile...",
      failedToLoadProfileData: "Failed to load profile data. Please refresh the page.",
      farmerProfileNotFound: "Farmer profile not found. Please contact support.",
      
      // Currency
      currencyCode: "TZS",
      currencySymbol: "TZS"
    }
  },
  sw: {
    translation: {
      // Navigation
      dashboard: "Dashibodi",
      farms: "Mashamba",
      batches: "Vikundi",
      tasks: "Kazi",
      activities: "Shughuli",
      health: "Afya",
      analytics: "Uchambuzi",
      profile: "Wasifu",
      settings: "Mipangilio",
      logout: "Toka",
      
      // Dashboard
      welcomeBack: "Karibu tena",
      farmOverview: "Hapa kuna kinachoendelea kwenye shamba lako leo",
      totalBirds: "Jumla ya Ndege",
      eggsToday: "Mayai Leo",
      feedRemaining: "Chakula Kilichobaki",
      monthlyRevenue: "Mapato ya Mwezi",
      quickActions: "Vitendo vya Haraka",
      addNewBatch: "Ongeza Kikundi Kipya",
      recordActivity: "Rekodi Shughuli",
      healthCheck: "Uchunguzi wa Afya",
      viewReports: "Ona Ripoti",
      todaysTasks: "Kazi za Leo",
      recentAlerts: "Tahadhari za Hivi Karibuni",
      recentActivities: "Shughuli za Hivi Karibuni",
      viewAllTasks: "Ona Kazi Zote",
      viewAllActivities: "Ona Shughuli Zote",
      
      // Profile
      myProfile: "Wasifu Wangu",
      editProfile: "Hariri Wasifu",
      profileCompletion: "Kukamilika kwa Wasifu",
      completed: "kumekamilika",
      personalInformation: "Taarifa za Kibinafsi",
      contactInformation: "Taarifa za Mawasiliano",
      fullName: "Jina Kamili",
      email: "Barua Pepe",
      phone: "Simu",
      address: "Anwani",
      experienceLevel: "Kiwango cha Uzoefu",
      beginner: "Mwanzo",
      intermediate: "Wastani",
      experienced: "Mwenye Uzoefu",
      expert: "Mtaalamu",
      notProvided: "Hakijatolewa",
      notSet: "Haijawekwa",
      
      // Settings
      systemSettings: "Mipangilio ya Mfumo",
      language: "Lugha",
      currency: "Sarafu",
      notifications: "Arifa",
      accountSettings: "Mipangilio ya Akaunti",
      changePassword: "Badili Nywila",
      currentPassword: "Nywila ya Sasa",
      newPassword: "Nywila Mpya",
      confirmPassword: "Thibitisha Nywila",
      saveChanges: "Hifadhi Mabadiliko",
      cancel: "Ghairi",
      
      // Forms
      enterYourFullName: "Ingiza jina lako kamili",
      enterYourPhoneNumber: "Ingiza nambari yako ya simu",
      enterYourAddress: "Ingiza anwani yako",
      selectExperienceLevel: "Chagua kiwango cha uzoefu",
      enterCurrentPassword: "Ingiza nywila ya sasa",
      enterNewPassword: "Ingiza nywila mpya",
      confirmNewPassword: "Thibitisha nywila mpya",
      
      // Stats
      totalFarms: "Jumla ya Mashamba",
      totalBatches: "Jumla ya Vikundi",
      activeFarms: "Mashamba yanayofanya kazi",
      activePoultryBatches: "Vikundi vya kuku vinavyofanya kazi",
      totalBirdsCount: "Jumla ya ndege katika vikundi vyote",
      daysRemaining: "siku zimebaki",
      efficiency: "ufanisi",
      thisWeek: "wiki hii",
      fromLastMonth: "kutoka mwezi uliopita",
      
      // Actions
      save: "Hifadhi",
      edit: "Hariri",
      delete: "Futa",
      view: "Ona",
      add: "Ongeza",
      create: "Tengeneza",
      update: "Sasisha",
      loading: "Inapakia",
      error: "Hitilafu",
      success: "Mafanikio",
      warning: "Onyo",
      
      // Messages
      profileUpdatedSuccessfully: "Wasifu umesasishwa kwa mafanikio",
      failedToUpdateProfile: "Imeshindwa kusasisha wasifu",
      pleaseTryAgainLater: "Tafadhali jaribu tena baadaye",
      loadingYourProfile: "Inapakia wasifu wako...",
      failedToLoadProfileData: "Imeshindwa kupakia data ya wasifu. Tafadhali onyesha upya ukurasa.",
      farmerProfileNotFound: "Wasifu wa mkulima haujapatikana. Tafadhali wasiliana na msaada.",
      
      // Currency
      currencyCode: "TZS",
      currencySymbol: "TSh"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: 'en', // Default language
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
