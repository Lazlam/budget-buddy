import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome_login": "Welcome back! Please sign in.",
      "welcome_signup": "Create your family account.",
      "welcome_forgot": "Reset your password.",
      "email_label": "Email address",
      "password_label": "Password",
      "forgot_password_link": "Forgot password?",
      "sign_in_btn": "Sign In",
      "sign_up_btn": "Sign Up",
      "send_reset_link_btn": "Send Reset Link",
      "or_divider": "Or",
      "back_to_signin": "Back to Sign In",
      "need_account_signup": "Need an account? Sign up",
      "already_have_account_signin": "Already have an account? Sign in",
      "success_reset_link": "Reset link sent! Please check your email inbox.",
      "success_account_created": "Account created! Please check your email inbox for the confirmation link."
    }
  },
  el: {
    translation: {
      "welcome_login": "Καλώς ήρθατε! Παρακαλώ συνδεθείτε.",
      "welcome_signup": "Δημιουργήστε τον οικογενειακό σας λογαριασμό.",
      "welcome_forgot": "Επαναφέρετε τον κωδικό σας.",
      "email_label": "Διεύθυνση Email",
      "password_label": "Κωδικός Πρόσβασης",
      "forgot_password_link": "Ξεχάσατε τον κωδικό;",
      "sign_in_btn": "Σύνδεση",
      "sign_up_btn": "Εγγραφή",
      "send_reset_link_btn": "Αποστολή Συνδέσμου",
      "or_divider": "Ή",
      "back_to_signin": "Επιστροφή στη Σύνδεση",
      "need_account_signup": "Δεν έχετε λογαριασμό; Εγγραφείτε",
      "already_have_account_signin": "Έχετε ήδη λογαριασμό; Συνδεθείτε",
      "success_reset_link": "Ο σύνδεσμος στάλθηκε! Ελέγξτε τα email σας.",
      "success_account_created": "Ο λογαριασμός δημιουργήθηκε! Ελέγξτε τα email σας για επιβεβαίωση."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", 
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;