"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import MainInterface from "@/components/main-interface"
import {
  ArrowRight,
  Shield,
  Zap,
  Users,
  Brain,
  Settings,
  CheckCircle,
  Calendar,
  Github,
  Mail,
  ExternalLink,
  Linkedin,
  Twitter,
} from "lucide-react"

export default function HomePage() {
  const [showInterface, setShowInterface] = useState(false)

  if (showInterface) {
    return <MainInterface />
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <nav className="border-b border-gray-800 p-4 fixed w-full top-0 z-50 bg-black">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Assistive Workmate Logo" className="w-8 h-8 rounded-lg" />
            <span className="text-xl font-bold">Assistive Workmate</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="hover:text-gray-300 transition-colors">
              Home
            </a>
            <a href="#about" className="hover:text-gray-300 transition-colors">
              About
            </a>
            <a href="#features" className="hover:text-gray-300 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-gray-300 transition-colors">
              How It Works
            </a>
            <a href="#documentation" className="hover:text-gray-300 transition-colors">
              Documentation
            </a>
            <a href="#team" className="hover:text-gray-300 transition-colors">
              Team
            </a>
            <a href="#future" className="hover:text-gray-300 transition-colors">
              Future
            </a>
            <Button onClick={() => setShowInterface(true)} size="sm" className="bg-white text-black hover:bg-gray-200">
              Launch App
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 border-gray-600 text-gray-300">
            Developed under NxtGenSec • Version 1.0 • 2025
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Assistive Workmate</h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-4">
            Agentic AI Framework for Operating System Automation
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            Specially designed for Windows users - Automate tasks without human intervention using advanced AI
            technology
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setShowInterface(true)}
              size="lg"
              className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6 rounded-lg font-semibold"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-gray-600 text-white hover:bg-gray-800 text-lg px-8 py-6 rounded-lg bg-transparent"
              onClick={() => window.location.hash = '#documentation'}
            >
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">About Assistive Workmate</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-300 mb-6">
                Assistive Workmate (AW) is an innovative framework designed to automate and manage operating system
                (OS)-level tasks through an Agentic AI approach. Unlike conventional automation tools, AW functions as
                an intelligent agent that accepts natural language commands, interprets them, and executes corresponding
                actions directly within the OS environment.
              </p>
              <p className="text-lg text-gray-300 mb-6">
                Born from the frustration of repetitive troubleshooting and system recovery challenges faced by
                cybersecurity students, this project aims to provide a one-step solution for system management, enabling
                users to perform complex configurations, fix issues, and streamline workflows simply by interacting with
                an AI-powered assistant.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>Project Date: August 25, 2025</span>
              </div>
            </div>
            <Card className="p-6 bg-gray-800 border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Key Objectives</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  <span className="text-gray-300">
                    Create an intelligent AI-driven assistant for system-level problem-solving
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  <span className="text-gray-300">
                    Enable natural language communication for both technical and non-technical users
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  <span className="text-gray-300">Eliminate manual troubleshooting through automated processes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  <span className="text-gray-300">Reduce time, cost, and energy for routine system management</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 bg-gray-900 border-gray-700">
              <Brain className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">AI-Powered Automation</h3>
              <p className="text-gray-300">
                Converts natural language queries into executable automation scripts using Google's Gemini API
              </p>
            </Card>
            <Card className="p-6 bg-gray-900 border-gray-700">
              <Settings className="h-12 w-12 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">System-Level Integration</h3>
              <p className="text-gray-300">
                Direct interaction with Windows OS for real-time automation tasks including file management and process
                handling
              </p>
            </Card>
            <Card className="p-6 bg-gray-900 border-gray-700">
              <Shield className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Automated Diagnostics</h3>
              <p className="text-gray-300">
                Automated detection and resolution of common OS-level issues, reducing dependency on manual
                problem-solving
              </p>
            </Card>
            <Card className="p-6 bg-gray-900 border-gray-700">
              <Users className="h-12 w-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">User-Friendly Interface</h3>
              <p className="text-gray-300">
                Simple text-based input mechanism for seamless interaction by both technical and non-technical users
              </p>
            </Card>
            <Card className="p-6 bg-gray-900 border-gray-700">
              <Zap className="h-12 w-12 text-red-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Real-Time Execution</h3>
              <p className="text-gray-300">
                Immediate task execution with transparent step-by-step automation process and progress tracking
              </p>
            </Card>
            <Card className="p-6 bg-gray-900 border-gray-700">
              <CheckCircle className="h-12 w-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Transparency & Control</h3>
              <p className="text-gray-300">
                Users can review automation steps before execution, maintaining full control over system operations
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Workflow Process</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">User Query Input</h4>
                    <p className="text-gray-300">User provides their query in the chat field using natural language</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">AI Processing</h4>
                    <p className="text-gray-300">System sends predefined prompt + user prompt to Gemini API</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Dual Output Generation</h4>
                    <p className="text-gray-300">Gemini provides both user-friendly reply and automation JSON</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Transparency & Choice</h4>
                    <p className="text-gray-300">User can review steps and choose whether to automate the task</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                    5
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Execution</h4>
                    <p className="text-gray-300">System executes automation steps with real-time progress tracking</p>
                  </div>
                </div>
              </div>
            </div>
            <Card className="p-6 bg-gray-800 border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Technical Architecture</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-blue-400">Frontend</h4>
                  <p className="text-sm text-gray-300">React + Next.js + Tailwind CSS</p>
                </div>
                <div>
                  <h4 className="font-medium text-green-400">AI Integration</h4>
                  <p className="text-sm text-gray-300">Google Gemini 2.0 Flash Model</p>
                </div>
                <div>
                  <h4 className="font-medium text-purple-400">Automation Engine</h4>
                  <p className="text-sm text-gray-300">Python + PyAutoGUI + System Commands</p>
                </div>
                <div>
                  <h4 className="font-medium text-yellow-400">Target Platform</h4>
                  <p className="text-sm text-gray-300">Windows 10 and above</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section id="documentation" className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Documentation</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6 bg-gray-800 border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Getting Started</h3>
              <p className="text-gray-300 mb-4">Learn how to set up and start using Assistive Workmate for Windows automation.</p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  <span>System Requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  <span>Installation Guide</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  <span>First Automation</span>
                </li>
              </ul>
            </Card>
            <Card className="p-6 bg-gray-800 border-gray-700">
              <h3 className="text-xl font-semibold mb-4">API Reference</h3>
              <p className="text-gray-300 mb-4">Detailed information about Assistive Workmate's API endpoints and usage.</p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  <span>Chat API</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  <span>Automation Endpoints</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  <span>Error Handling</span>
                </li>
              </ul>
            </Card>
            <Card className="p-6 bg-gray-800 border-gray-700">
              <h3 className="text-xl font-semibold mb-4">User Guide</h3>
              <p className="text-gray-300 mb-4">Comprehensive guide to using all features of Assistive Workmate.</p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  <span>Chat Interface</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  <span>Automation Workflows</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  <span>Troubleshooting</span>
                </li>
              </ul>
            </Card>
            <Card className="p-6 bg-gray-800 border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Developer Guide</h3>
              <p className="text-gray-300 mb-4">Information for developers who want to contribute or extend Assistive Workmate.</p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  <span>Architecture Overview</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  <span>Contributing Guidelines</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  <span>Custom Integrations</span>
                </li>
              </ul>
            </Card>
          </div>
          <div className="text-center mt-12">
            <Button className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-lg font-semibold">
              Download Full Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Development Team</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 bg-gray-900 border-gray-700 text-center hover:bg-gray-800 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/50 group">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
                K
              </div>
              <h3 className="text-xl font-semibold mb-3">Kiran Kumar Reddy Savireddy</h3>
              <p className="text-gray-400 mb-3">CSE (Cybersecurity) • Team Member 1</p>
              <p className="text-sm text-gray-300 mb-6">Lead Developer & System Architecture</p>
              <div className="flex justify-center space-x-4 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-gray-700"
                  onClick={() => window.open("https://linkedin.com/in/kiran", "_blank")}
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-gray-700"
                  onClick={() => window.open("https://twitter.com/kiran", "_blank")}
                >
                  <Twitter className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={() => window.open("https://kiran.nxtgensec.org", "_blank")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Connect
              </Button>
            </Card>
            <Card className="p-8 bg-gray-900 border-gray-700 text-center hover:bg-gray-800 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 hover:border-green-500/50 group">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold shadow-lg group-hover:shadow-green-500/50 transition-all duration-300">
                M
              </div>
              <h3 className="text-xl font-semibold mb-3">Mandapalli Deva Sai Nandini</h3>
              <p className="text-gray-400 mb-3">CSE (Cybersecurity) • Team Member 2</p>
              <p className="text-sm text-gray-300 mb-6">AI Integration & Testing</p>
              <div className="flex justify-center space-x-4 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-gray-700"
                  onClick={() => window.open("https://linkedin.com/in/nandini", "_blank")}
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-gray-700"
                  onClick={() => window.open("https://twitter.com/nandini", "_blank")}
                >
                  <Twitter className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={() => window.open("https://nandini.nxtgensec.org", "_blank")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 hover:scale-105"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Connect
              </Button>
            </Card>
            <Card className="p-8 bg-gray-900 border-gray-700 text-center hover:bg-gray-800 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500/50 group">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300">
                K
              </div>
              <h3 className="text-xl font-semibold mb-3">Kokila Chowdary</h3>
              <p className="text-gray-400 mb-3">CSE (Cybersecurity) • Team Member 3</p>
              <p className="text-sm text-gray-300 mb-6">UI/UX Design & Documentation</p>
              <div className="flex justify-center space-x-4 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-gray-700"
                  onClick={() => window.open("https://linkedin.com/in/kokila", "_blank")}
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-gray-700"
                  onClick={() => window.open("https://twitter.com/kokila", "_blank")}
                >
                  <Twitter className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={() => window.open("https://kokila.nxtgensec.org", "_blank")}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Connect
              </Button>
            </Card>
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-400">
              <strong>Institution:</strong> Madanapalle Institute of Technology & Science (MITS)
            </p>
            <p className="text-gray-400 mt-2">
              <strong>Developed under:</strong> NxtGenSec • <strong>Date:</strong> August 25, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Future Enhancements */}
      <section id="future" className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Future Enhancements</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Cross-Platform Support",
                description: "Expand to Linux and macOS for wider accessibility",
                timeline: "P2 2026",
              },
              {
                title: "Voice-Based Interaction",
                description: "Speech-to-text functionality for hands-free operation",
                timeline: "P3 2026",
              },
              {
                title: "Multi-Agent Collaboration",
                description: "Multiple AI agents working in parallel on different tasks",
                timeline: "P4 2026",
              },
              {
                title: "Advanced System Diagnostics",
                description: "Real-time monitoring with predictive analytics",
                timeline: "P5 2027",
              },
              {
                title: "Enhanced Security",
                description: "Microsoft MCP integration with RBAC and encryption",
                timeline: "P6 2027",
              },
              {
                title: "Cloud Synchronization",
                description: "Cross-device automation preferences and history",
                timeline: "P7 2027",
              },
            ].map((enhancement, index) => (
              <Card key={index} className="p-6 bg-gray-800 border-gray-700">
                <h3 className="text-lg font-semibold mb-3">{enhancement.title}</h3>
                <p className="text-gray-300 mb-4">{enhancement.description}</p>
                <Badge variant="outline" className="border-gray-600 text-gray-400">
                  {enhancement.timeline}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/logo.png" alt="Assistive Workmate Logo" className="w-8 h-8 rounded-lg" />
                <span className="text-xl font-bold">Assistive Workmate</span>
              </div>
              <p className="text-gray-400 text-sm">Agentic AI Framework for Operating System Automation</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#features" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-white">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#documentation" className="hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#documentation" className="hover:text-white">
                    API Reference
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#about" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#team" className="hover:text-white">
                    Team
                  </a>
                </li>
                <li>
                  <a href="#documentation" className="hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="mailto:assistiveworkmate@gmail.com" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-300"
                  onClick={() => window.open("https://github.com/assistiveworkmate", "_blank")}
                >
                  <Github className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-300"
                  onClick={() => window.open("mailto:assistiveworkmate@gmail.com", "_blank")}
                >
                  <Mail className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-300"
                  onClick={() => window.open("https://nxtgensec.org", "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-4">assistiveworkmate@gmail.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Assistive Workmate. Developed under NxtGenSec. All rights reserved.</p>
            <p className="mt-2">Madanapalle Institute of Technology & Science (MITS)</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
