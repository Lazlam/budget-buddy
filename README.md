# Budget Buddy

**Budget Buddy** is a modern, responsive, and fully localized personal finance dashboard. It empowers users to track their expenses, set visual budgets, and get personalized financial advice using real-time AI and live global exchange rates.

**[View Live Demo](https://budget-buddy-3b46.vercel.app)**



**Dashboard Screenshot
<img width="1918" height="866" alt="Screenshot 2026-03-07 134423" src="https://github.com/user-attachments/assets/e7364eb0-3029-45ce-a974-f51bdc1701b0" />**

## Key Features

* **Live Currency Conversion:** Global state management via React Context combined with an external Exchange Rate API allows users to instantly view their entire financial dashboard in EUR, USD, GBP, JPY, AUD, or CAD.
* **AI Money Advisor:** Integrated with Google's Gemini 2.5 Flash API to analyze user spending data, generate contextual financial insights, and provide a conversational chatbot interface for budgeting advice.
* **Interactive Data Visualization:** Utilizes Recharts for dynamic pie charts (spending by category) and bar charts (6-month income vs. expense trends).
* **Smart Budgeting:** Set monthly limits for different categories. Visual progress bars dynamically change color (Green -> Yellow -> Red) as users approach or exceed their limits.
* **Bilingual Localization:** Fully translated English and Greek interfaces using `react-i18next`.
* **Blazing Fast Data Fetching:** Implements `@tanstack/react-query` for optimized, cached, and background-refreshing data fetching from Supabase.

## Tech Stack

* **Frontend:** React (Vite), Tailwind CSS, Framer Motion (Animations)
* **Backend/Database:** Supabase (PostgreSQL)
* **State Management:** React Context API, React Query
* **APIs:** Google Generative AI (Gemini), ExchangeRate-API
* **Routing:** React Router
* **Localization:** i18next
* **Deployment:** Vercel

## Getting Started

To run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone [https://github.com/Lazlam/budget-buddy.git](https://github.com/Lazlam/budget-buddy.git)
cd budget-buddy/budget-app
```
### 2. Install dependencies
```bash
npm install
```
### 3. Set up Environment Variables
Create a .env file in the root of the project and add your API keys. (Note: You will need to generate your own keys from Supabase and Google AI Studio).

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key

### 4. Start the development server
```bash
npm run dev
```
### Project Structure Highlights
src/contexts/: Contains the CurrencyContext for app-wide live exchange rate state.

src/components/ai/: Contains the logic for structuring user financial data to feed into the Gemini LLM prompt.

src/i18n.js: Configures English and Greek language dictionaries.

src/pages/: Main dashboard, budget, transaction, and AI views.

---
*Designed and built by Labros Lazarakis

