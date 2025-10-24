# Assistive Workmate

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/nxtgensec/awmate)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![AI Powered](https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge&logo=google)](https://ai.google/)

**Agentic AI Framework for Operating System Automation**

Assistive Workmate (AW) is an innovative framework designed to automate and manage operating system (OS)-level tasks through an Agentic AI approach. Unlike conventional automation tools, AW functions as an intelligent agent that accepts natural language commands, interprets them, and executes corresponding actions directly within the OS environment.



## 🌟 Key Features

- **AI-Powered Automation**: Converts natural language queries into executable automation scripts using Google's Gemini API
- **System-Level Integration**: Direct interaction with Windows OS for real-time automation tasks
- **Automated Diagnostics**: Automated detection and resolution of common OS-level issues
- **User-Friendly Interface**: Simple text-based input mechanism for seamless interaction
- **Real-Time Execution**: Immediate task execution with transparent step-by-step automation process
- **Transparency & Control**: Users can review automation steps before execution

## 🚀 Live Demo

Your project is live at: [https://vercel.com/nxtgensec/awmate](https://vercel.com/nxtgensec/awmate)

## 🛠️ Technology Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) with App Router, [React 19](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/)
- **AI Integration**: [Google Gemini 2.0 Flash Model](https://ai.google/)
- **UI Components**: [lucide-react](https://lucide.dev/), [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: React Hooks
- **Build Tool**: PNPM
- **Deployment**: [Vercel](https://vercel.com/)

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [PNPM](https://pnpm.io/) package manager
- Windows 10 or higher (for full automation capabilities)

## 🏁 Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd awmate-rx-main
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

### Development

Start the development server:

```bash
pnpm dev
```

The application will be available at:
- Local: http://localhost:3000
- Network: http://[your-ip]:3000

### Building for Production

```bash
pnpm build
```

### Running Production Build

```bash
pnpm start
```

## 🧠 How It Works

1. **User Query Input**: User provides their query in the chat field using natural language
2. **AI Processing**: System sends predefined prompt + user prompt to Gemini API
3. **Dual Output Generation**: Gemini provides both user-friendly reply and automation JSON
4. **Transparency & Choice**: User can review steps and choose whether to automate the task
5. **Execution**: System executes automation steps with real-time progress tracking

## 🗂️ Project Structure

```
AWMate/
├── app/                    # Next.js app directory
│   ├── api/chat/          # Chat API route
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/                # UI components (shadcn/ui)
│   ├── main-interface.tsx # Main chat interface
│   └── theme-provider.tsx # Theme provider
├── lib/                   # Utility functions
├── public/                # Static assets
└── styles/                # Global styles
```

## 👥 Development Team

This project was developed by:

- **Kiran Kumar Reddy Savireddy** - CSE (Cybersecurity) • Team Member 1
  - Lead Developer & System Architecture
  - [Website](https://kiran.nxtgensec.org)

- **Mandapalli Deva Sai Nandini** - CSE (Cybersecurity) • Team Member 2
  - AI Integration & Testing
  - [Website](https://nandini.nxtgensec.org)

**Institution**: Madanapalle Institute of Technology & Science (MITS)
**Developed under**: NxtGenSec
**Date**: August 25, 2025

## 🚀 Future Enhancements

- Cross-Platform Support (Linux and macOS)
- Voice-Based Interaction
- Multi-Agent Collaboration
- Advanced System Diagnostics
- Enhanced Security with Microsoft MCP integration
- Cloud Synchronization

## 🤝 Contributing

This project is maintained directly through this repository.

## 📄 License

This project is developed under NxtGenSec and is intended for educational purposes. All rights reserved.

## 📧 Contact

- **Email**: assistiveworkmate@gmail.com
- **GitHub**: [assistiveworkmate](https://github.com/assistiveworkmate)
- **Organization**: [NxtGenSec](https://nxtgensec.org)

---

© 2025 Assistive Workmate. Developed under NxtGenSec. All rights reserved.
Madanapalle Institute of Technology & Science (MITS)
