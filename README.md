<div align="center">

# VisarDevKit

### AI-Powered Developer Toolkit

**7 intelligent code tools, one sleek interface — supercharge your development workflow with Google Gemini.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Genkit](https://img.shields.io/badge/Genkit-1.13-orange)](https://firebase.google.com/docs/genkit)
[![Gemini](https://img.shields.io/badge/Gemini-2.0%20Flash-4285F4?logo=google)](https://ai.google.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-App%20Hosting-FFCA28?logo=firebase)](https://firebase.google.com/docs/app-hosting)

</div>

---

## ✨ Overview

**VisarDevKit** is a futuristic, AI-powered web application built with Next.js and Google Gemini. It provides seven specialized tools that help developers write better code faster — from adding comments and extracting dependencies, to comparing snippets and generating tests. All tools are powered by the Gemini 2.0 Flash model via the Genkit AI framework and accessible through a single, beautifully themed interface.

---

## 🚀 Features

| # | Tool | Description |
|---|------|-------------|
| 1 | 🤖 **Comment Enhancer** | Automatically adds smart, concise inline comments to uncommented code to improve readability and maintainability. |
| 2 | 🔀 **Code Comparator** | Compares two code snippets side-by-side and produces an AI-generated summary of their functional and logical differences. |
| 3 | 🔄 **Style Converter** | Converts code between naming conventions (e.g., `snake_case` → `camelCase`) or formatting styles (compact → readable). |
| 4 | 📄 **Pseudocode Generator** | Translates code logic into plain-language pseudocode — ideal for tutorials, documentation, or onboarding. |
| 5 | 🧪 **Unit Test Generator** | Generates a 10-question multiple-choice quiz to test a developer's understanding of a given code snippet. |
| 6 | ✏️ **Rename Suggestion** | Suggests meaningful, descriptive names for poorly named variables or functions, with an explanation for each suggestion. |
| 7 | 📦 **Dependency Extractor** | Analyzes a code snippet and returns only the required import/require statements needed for it to run. |

All tools also support **Copy to Clipboard** with a toast confirmation notification.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3, `tailwindcss-animate` |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives) |
| **AI Runtime** | [Google Genkit](https://firebase.google.com/docs/genkit) + `@genkit-ai/googleai` |
| **AI Model** | Gemini 2.0 Flash (`googleai/gemini-2.0-flash`) |
| **Schema Validation** | [Zod](https://zod.dev/) |
| **Forms** | React Hook Form + `@hookform/resolvers` |
| **Charts** | Recharts |
| **Fonts** | Space Grotesk (UI), Source Code Pro (code) |
| **Deployment** | Firebase App Hosting |

---

## 📁 Project Structure

```
VISAR-Dev-Kit/
├── docs/
│   └── blueprint.md          # Original feature & design specification
├── src/
│   ├── ai/
│   │   ├── genkit.ts          # Genkit + Gemini model configuration
│   │   ├── dev.ts             # Genkit development entry point
│   │   └── flows/             # Server-side AI flow definitions (one per tool)
│   │       ├── enhance-code-comments.ts
│   │       ├── code-comparator.ts
│   │       ├── style-converter.ts
│   │       ├── pseudocode-generator.ts
│   │       ├── unit-test-generator.ts
│   │       ├── rename-suggestion.ts
│   │       └── dependency-extractor.ts
│   ├── app/
│   │   ├── layout.tsx         # Root layout (fonts, metadata, Toaster)
│   │   ├── page.tsx           # Home page entry point
│   │   └── globals.css        # Global styles & CSS variables
│   ├── components/
│   │   ├── features/          # One React component per tool + PageContent
│   │   ├── common/            # Shared UI (FeatureCard, OutputCard, etc.)
│   │   └── ui/                # shadcn/ui component library
│   ├── hooks/                 # Custom React hooks (e.g., use-toast)
│   └── lib/
│       ├── gemini.ts          # API key resolution utility
│       └── utils.ts           # Tailwind class utilities
├── apphosting.yaml            # Firebase App Hosting configuration
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🔑 API Key Handling

VisarDevKit uses a priority-based system to resolve the Gemini API key at runtime:

1. **URL query parameter** — `?apikey=YOUR_KEY` (highest priority, client-side)
2. **Settings dialog** — Click the ⚙️ gear icon in the top-right corner to paste your key directly into the UI. It is stored only in memory and never persisted.
3. **Environment variable** — `GEMINI_API_KEY` in your `.env` file (server-side fallback)

If no valid key is found, the app displays an error: _"Gemini API key not found."_

---

## ⚙️ Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/RootDeveloperDS/VISAR-Dev-Kit.git
cd VISAR-Dev-Kit

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Then edit .env and add your Gemini API key:
# GEMINI_API_KEY=your_api_key_here

# 4. Start the development server
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser.

> **Tip:** You can also pass your key directly in the URL:  
> `http://localhost:9002?apikey=YOUR_GEMINI_KEY`

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Next.js dev server with Turbopack on port **9002** |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run Next.js ESLint checks |
| `npm run typecheck` | Run TypeScript type checking without emitting files |
| `npm run genkit:dev` | Start the Genkit developer UI |
| `npm run genkit:watch` | Start the Genkit developer UI in watch mode |

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| **Background** | Very dark purple `#17051C` |
| **Primary** | Electric purple `#BE29EC` |
| **Accent** | Fuchsia `#F02CEB` |
| **Body / Headline font** | Space Grotesk |
| **Code font** | Source Code Pro |
| **Effects** | Subtle glowing borders and button animations |
| **Theme** | Dark mode only |

---

## ☁️ Deployment

The project is configured for **Firebase App Hosting** via `apphosting.yaml`. To deploy:

```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login and deploy
firebase login
firebase deploy
```

The `apphosting.yaml` limits the backend to **1 instance** by default. Adjust `maxInstances` to scale for higher traffic.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request with your proposed changes.

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push to your branch: `git push origin feature/my-feature`
5. Open a pull request

---

## 📄 License

This project is private. All rights reserved.
