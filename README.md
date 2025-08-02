# T-Forms: Advanced Online Form Builder

**T-Forms** is an open-source form creation and aggregation app that combines an intuitive UI like Google Forms with high extensibility and maintainability using a modern tech stack. It uses Firebase Auth for user authentication and Firebase Firestore for the database.

## Key Features

- **Various Question Types**
  - Text input
  - Email input (with validation)
  - Single choice (radio buttons)
  - Multiple choice (checkboxes)
  - 5-star rating
- **Mandatory Settings for Each Question**
- **Drag & Drop to Rearrange Questions**
- **Multilingual Support (Japanese & English)**
  - Automatic browser language detection & toggle via globe icon
- **Authentication Features**
  - Firebase Auth (Email/Password, Google Login)
- **Access Control**
  - Only the owner can edit/delete their forms and view results
- **Real-time Saving with Firestore**
- **Graphical Aggregation of Responses**
  - Text/Email: List view
  - Radio/Checkbox: Bar chart
  - Rating: Pie chart
- **CSV/Excel Export**
  - Download all responses as CSV or Excel (.xlsx) with one click from the results page
- **QR Code Sharing**
  - Display and adjust the size of the voting page URL QR code with one click from the form list
- **Real-time Aggregation**
  - Response results are automatically updated with Firestore's onSnapshot
- **Responsive Design**
- **Type-safe & Fully ESLint Compliant**
- **Firebase Hosting Deployment Ready**

## Tech Stack

- React (TypeScript)
- Material-UI (MUI)
- React Router
- Vite
- Zustand
- Recharts
- react-i18next / i18next / i18next-browser-languagedetector
- Firebase (Auth, Firestore, Hosting)
- ESLint / TypeScript ESLint

## Directory Structure

```
t-forms/
├── public/
│   └── locales/      # Translation files for multilingual support
│       ├── en/
│       └── ja/
├── src/
│   ├── components/
│   │   ├── pages/      # Components for each page
│   │   └── ui/         # Reusable UI components (e.g., LanguageSwitcher)
│   ├── store/          # Zustand store
│   ├── types/          # Type definitions
│   ├── App.tsx         # Root and routing
│   ├── i18n.ts         # i18next configuration
│   └── main.tsx        # Entry point
└── ...
```

## Type Definitions (Excerpt)

```typescript
export type QuestionType = 'text' | 'radio' | 'checkbox' | 'email' | 'rating';
export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: Option[];
  isRequired?: boolean;
}
export interface Answer {
  questionId: string;
  text?: string;
  selectedOptions?: string[];
  ratingValue?: number;
}
```

## Graphical Display of Response Aggregation

- **Radio Buttons/Checkboxes:** Bar chart (BarChart)
- **Rating (Stars):** Pie chart (PieChart)
- **Text/Email:** List display

## i18n (Multilingual Support)

- Managed in `public/locales/ja/translation.json` and `public/locales/en/translation.json`
- Automatic browser language detection & toggle via globe icon
- When adding translation keys, add the same key to both language files

## Firestore Security Rules

- forms: Viewable by everyone, editable/deletable and results viewable only by the creator
- responses: Viewable only by the form creator

## Deployment & Optimization

- Vite's automatic code splitting + React.lazy/Suspense for fast initial load
- chunkSizeWarningLimit adjusted
- Can be optimally deployed to Firebase Hosting

## CSV/Excel Export

- Download all responses as CSV or Excel (.xlsx) with one click from the results page
- Checkbox values are output as comma-separated choice labels
- Excel export safely implemented with exceljs + file-saver

## Additional Features & UI Improvements

- **Excel Export**: Now available in the results screen for .xlsx format downloads, using exceljs internally.
- **QR Code Display**: Convert voting page URL to QR code with the "QR Code" button in the form list. Size adjustment is also possible in the dialog.
- **Real-time Aggregation**: Results screen automatically reflects new or updated responses.
- **Accurate Checkbox Value Output**: During export, outputs labels (texts) separated by commas instead of choice IDs.
- **Major UI Improvements**: Separation of login/top, header organization, language switch UI renewal, enhanced error guidance, etc.

## Development & Operation Steps

1. `npm install`
2. Set Firebase configuration in `.env`
3. Start locally with `npm run dev`
4. Build and deploy to production with `npm run build` → `firebase deploy --only hosting`

---
For more detailed design, type definitions, optimization, i18n operation, security, etc., please refer to `CODE_DETAILS.md`.

## Tech Stack

*   **React (TypeScript):** UI construction and state management
*   **Material-UI (MUI):** High-quality UI components
*   **React Router:** SPA routing
*   **Vite:** Development and build environment
*   **Zustand:** Global state management
*   **Recharts:** Graphical display of response results
*   **react-i18next / i18next / i18next-browser-languagedetector:** Multilingual support (with globe icon for language toggle)


## About Multilingual Support (i18n)

This app uses `react-i18next` for multilingual support. The translation files are located in `public/locales/ja/translation.json` and `public/locales/en/translation.json`.

- **How to Add/Modify Translation Keys**
  - Add the same key to the `translation.json` of each language.
  - Example：
    ```json
    {
      "app_title": "T-Forms",
      "create_form": "Create Form",
      ...
    }
    ```
  - Japanese example：
    ```json
    {
      "app_title": "T-Forms",
      "create_form": "フォームを作成",
      ...
    }
    ```
- **Notes**
  - If a key exists in only one language, it will cause warnings or appear untranslated.
  - Always synchronize both `translation.json` files.
  - The initial display language is automatically selected based on the browser's language settings.
  - Language can be switched from the globe icon at the top right of the screen.

---
## Directory Structure

```
t-forms/
├── public/
│   └── locales/      # Translation files for multilingual support
│       ├── en/
│       └── ja/
├── src/
│   ├── components/
│   │   ├── pages/      # Components for each page
│   │   └── ui/         # Reusable UI components (e.g., LanguageSwitcher)
│   ├── store/          # Zustand store
│   ├── types/          # Type definitions
│   ├── App.tsx         # Root and routing
│   ├── i18n.ts         # i18next configuration
│   └── main.tsx        # Entry point
└── ...
```

## Introduction

This section explains how to set up and run T-Forms in the local environment.

### Prerequisites

*   [Node.js](https://nodejs.org/) (Recommended v18.x or later)
*   [npm](https://www.npmjs.com/) (Included with Node.js)


### Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/t-form.git
    cd t-form
    ```

2.  **Install dependencies:**
    Run the following command in the project's root directory to install the required libraries.
    ```bash
    npm install
    ```

3.  **Create Firebase configuration file:**
    Create a `.env` file in the project root and add the following content.
    ```env
    VITE_FIREBASE_API_KEY=...（Get from Firebase console）
    VITE_FIREBASE_AUTH_DOMAIN=...（Same as above）
    VITE_FIREBASE_PROJECT_ID=...（Same as above）
    VITE_FIREBASE_STORAGE_BUCKET=...（Same as above）
    VITE_FIREBASE_MESSAGING_SENDER_ID=...（Same as above）
    VITE_FIREBASE_APP_ID=...（Same as above）
    ```
    ※ The `.env` file is managed by `.gitignore` and will not be committed to Git.

4.  **Set Firestore security rules:**
    Apply the `firestore.rules` file in the Firebase console.
    - At least one question is required when creating a form
    - Viewing and editing responses is only for the form creator

5.  **Start the development server:**
    ```bash
    npm run dev
    ```
    This will start the application in development mode. Open `http://localhost:5173` (or the URL displayed in the console) in your browser to view the application.
    Changes made to files will be reloaded automatically.


### Build and Deploy to Firebase Hosting

1. **Build**
    ```bash
    npm run build
    ```
    This will generate optimized static files in the `dist` directory.


2. **Install Firebase CLI (if not already installed)**
    ```bash
    npm install -g firebase-tools
    ```
    ※ If the `firebase` command is not recognized in Windows/PowerShell, please restart the terminal once, or run the following command again.
    ```powershell
    npm install -g firebase-tools
    ```
    If the problem persists, please check if the npm global path is set correctly.

3. **Firebase login**
    ```bash
    firebase login
    ```

4. **Project initialization (only for the first time)**
    ```bash
    firebase init hosting
    ```
    - Specify `dist` for the public directory
    - Answer "yes" to the single-page app rewrite rules
    - Be careful not to overwrite existing `firebase.json` and `.firebaserc`

5. **Deploy**
    ```bash
    firebase deploy --only hosting
    ```

    After the deployment is complete, the Firebase Hosting URL will be displayed.

    > ⚠️ If you encounter errors like "Uncaught ReferenceError: Cannot access '_m' before initialization" after deployment,
    > try one of the following:
    > 1. Comment out or delete the `manualChunks` setting in `vite.config.ts`, then rebuild and redeploy
    > 2. Delete `node_modules` and `dist`, then run `npm install` → `npm run build` again
    > 3. Update dependencies to the latest version with `npm update`
    etc.


## Usage

1.  **Creating a Form:**
    *   Click the "Create Form" button in the header (only visible when logged in).
    *   The form title is mandatory.
    *   Add questions with the "Add Question" button and fill in the details for each question (mandatory).
    *   Forms cannot be saved with no questions or empty title/question fields.

2.  **Sharing the Form:**
    *   A unique URL is assigned to each created form. Share this URL with the respondents.

3.  **Checking Responses:**
    *   Click the "View Results" button in the form management screen to see the summary of responses.
    *   In text response questions, a "View Response" button appears next to each response, linking to the detailed response page.
    *   Alternatively, use the "View All Responses" button at the top of the summary page to go to the response list page, where individual response details can also be accessed.


## Tech Stack and Architecture

This project is built using **Vite**. The main tech stack is as follows:

*   **React (TypeScript):** For building the UI and managing state.
*   **Vite:** For fast development server and build tool.
*   **Material-UI (MUI):** Material Design compliant UI component library. The theme color is blue.
*   **React Router:** For managing routing within the application.
*   **Zustand:** A simple and fast state management library.
*   **Recharts:** For drawing graphs.
*   **react-i18next / i18next / i18next-browser-languagedetector:** For multilingual support.
*   **Firebase Firestore:** For storing form and response data, with access control via security rules.
*   **ESLint / TypeScript ESLint:** For static code analysis and maintaining code quality.

For more detailed architecture and design philosophy, please refer to `CODE_DETAILS.md`.

## Future Roadmap

## Contribution

Contributions to this project are welcome. Feel free to report bugs, suggest features, or submit pull requests.

1.  Fork the repository
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Create a pull request

## License

This project is licensed under the [MIT License](LICENSE).

## Code Quality Check

### Static Analysis with ESLint

ESLint is used to perform static analysis to maintain the code quality of the project.

1. To analyze the entire codebase, run the following command:

   ```bash
   npm run lint
   ```

2. To automatically fix fixable issues, run the following command:

   ```bash
   npm run lint:fix
   ```

### Type Checking with TypeScript

TypeScript is used to check the type safety of the code.

1. To perform type checking, run the following command:

   ```bash
   npm run type-check
   ```

2. To continuously monitor type checking, run the following command:

   ```bash
   npm run type-check:watch
   ```

These commands help ensure the quality and type safety of the code.
