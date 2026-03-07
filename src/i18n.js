import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // --- Auth Screen Translations ---
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
      "success_account_created": "Account created! Please check your email inbox for the confirmation link.",

      
      
      // --- App Interface Translations (Layout & Sidebar) ---
      "dashboard_title": "Dashboard",
      "Dashboard": "Dashboard",
      "Transactions": "Transactions",
      "Budgets": "Budgets",
      "AI Advisor": "AI Advisor",
      "smart_money_tagline": "Smart money management",
      "logout_btn": "Sign Out",

      // --- Dashboard Translations ---
      "overview_text": "Overview",
      "add_transaction_btn": "Add Transaction",
      "income_stat": "Income",
      "expenses_stat": "Expenses",
      "balance_stat": "Balance",
      "balance_positive": "You're in the green!",
      "balance_negative": "Spending more than earning",
      "where_money_goes": "Where Your Money Goes",
      "recent_transactions": "Recent Transactions",
      "monthly_trend": "Monthly Trend",
      "live_rates_title": "Live Exchange Rates",
      "live_rates_subtitle": "Base: 1 Euro (€)",
      "rates_error": "Could not load exchange rates.",

      // --- AI Advisor Translations ---
      "ai_advisor_title": "AI Money Advisor",
      "ai_advisor_subtitle": "Ask anything about your finances",
      "ai_greeting": "Hi! I'm your AI Money Advisor",
      "ai_description": "I can analyze your spending, help you budget, and give personalized tips.",
      "prompt_1": "How am I doing this month?",
      "prompt_2": "Where can I cut spending?",
      "prompt_3": "Help me make a savings plan",
      "prompt_4": "What should my budget be?",
      "ai_input_placeholder": "Ask about your spending, budget tips, savings goals...",
      "ai_error": "Sorry, my AI brain is having trouble connecting right now! Check your API key.",

      // --- Budgets Translations ---
      "budgets_title": "Budgets",
      "limits_text": "limits",
      "set_budget_btn": "Set Budget",
      "total_budgeted": "Total Budgeted",
      "total_spent": "Total Spent",
      "remaining": "Remaining",
      "no_budgets": "No budgets set yet!",
      "set_first_budget_btn": "Set Your First Budget",

      // --- Transactions Translations ---
      "transactions_title": "Transactions",
      "total_transactions": "total transactions",
      "search_transactions": "Search transactions...",
      "all_types": "All Types",
      "type_income": "Income",
      "type_expense": "Expense",
      "all_categories": "All Categories",
      "no_transactions": "No transactions found",
    }
  },
  el: {
    translation: {
      // --- Auth Screen Translations ---
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
      "success_account_created": "Ο λογαριασμός δημιουργήθηκε! Ελέγξτε τα email σας για επιβεβαίωση.",
      
      // --- App Interface Translations (Layout & Sidebar) ---
      "dashboard_title": "Πίνακας Ελέγχου",
      "Dashboard": "Πίνακας Ελέγχου",
      "Transactions": "Συναλλαγές",
      "Budgets": "Προϋπολογισμοί",
      "AI Advisor": "Σύμβουλος AI",
      "smart_money_tagline": "Έξυπνη διαχείριση χρημάτων",
      "logout_btn": "Αποσύνδεση",

      // --- Dashboard Translations ---
      "overview_text": "Επισκόπηση",
      "add_transaction_btn": "Προσθήκη Συναλλαγής",
      "income_stat": "Έσοδα",
      "expenses_stat": "Έξοδα",
      "balance_stat": "Υπόλοιπο",
      "balance_positive": "Είστε σε θετικό έδαφος!",
      "balance_negative": "Ξοδεύετε περισσότερα από όσα κερδίζετε",
      "where_money_goes": "Πού Πάνε τα Χρήματά Σας",
      "recent_transactions": "Πρόσφατες Συναλλαγές",
      "monthly_trend": "Μηνιαία Τάση",
      "live_rates_title": "Ζωντανές Συναλλαγματικές Ισοτιμίες",
      "live_rates_subtitle": "Βάση: 1 Ευρώ (€)",
      "rates_error": "Αδυναμία φόρτωσης ισοτιμιών.",

      // --- AI Advisor Translations ---
      "ai_advisor_title": "Σύμβουλος AI",
      "ai_advisor_subtitle": "Ρωτήστε οτιδήποτε για τα οικονομικά σας",
      "ai_greeting": "Γεια! Είμαι ο AI Οικονομικός σας Σύμβουλος",
      "ai_description": "Μπορώ να αναλύσω τα έξοδά σας, να βοηθήσω με τον προϋπολογισμό και να δώσω εξατομικευμένες συμβουλές.",
      "prompt_1": "Πώς τα πάω αυτόν τον μήνα;",
      "prompt_2": "Πού μπορώ να μειώσω τα έξοδα;",
      "prompt_3": "Βοήθησέ με να φτιάξω ένα πλάνο αποταμίευσης",
      "prompt_4": "Ποιος πρέπει να είναι ο προϋπολογισμός μου;",
      "ai_input_placeholder": "Ρωτήστε για τα έξοδά σας, συμβουλές προϋπολογισμού, στόχους αποταμίευσης...",
      "ai_error": "Συγγνώμη, ο τεχνητός μου εγκέφαλος έχει πρόβλημα σύνδεσης αυτή τη στιγμή! Ελέγξτε το API key σας.",

      // --- Budgets Translations ---
      "budgets_title": "Προϋπολογισμοί",
      "limits_text": "όρια",
      "set_budget_btn": "Ορισμός Προϋπολογισμού",
      "total_budgeted": "Συνολικός Προϋπολογισμός",
      "total_spent": "Συνολικά Έξοδα",
      "remaining": "Υπόλοιπο",
      "no_budgets": "Δεν έχουν οριστεί προϋπολογισμοί ακόμα!",
      "set_first_budget_btn": "Ορίστε τον Πρώτο σας Προϋπολογισμό",

      // --- Transactions Translations ---
      "transactions_title": "Συναλλαγές",
      "total_transactions": "συνολικές συναλλαγές",
      "search_transactions": "Αναζήτηση συναλλαγών...",
      "all_types": "Όλοι οι Τύποι",
      "type_income": "Έσοδα",
      "type_expense": "Έξοδα",
      "all_categories": "Όλες οι Κατηγορίες",
      "no_transactions": "Δεν βρέθηκαν συναλλαγές",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // Default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // React already escapes values to prevent XSS
    }
  });

export default i18n;