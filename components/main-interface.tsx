"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, Play, CheckCircle, XCircle, Clock, Edit, Share, MoreHorizontal, Plus, MessageSquare, Settings } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
}

interface ChatMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  canAutomate?: boolean
  automationSteps?: AutomationStep[]
}

interface AutomationStep {
  id: string
  description: string
  action: string
  status: "pending" | "running" | "completed" | "error"
}

export default function MainInterface() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [currentMessage, setCurrentMessage] = useState("")
  const [automationSteps, setAutomationSteps] = useState<AutomationStep[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAutomating, setIsAutomating] = useState(false)
  const [showLanding, setShowLanding] = useState(false)
  const [showChatHistory, setShowChatHistory] = useState(true)
  const [showAutomationSteps, setShowAutomationSteps] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const automationSuggestions = [
    "Open Notepad and create a new document",
    "Check system performance and memory usage",
    "Create a new folder on Desktop",
    "Launch Chrome and search for cybersecurity",
    "Clean temporary files and optimize system",
    "Take a screenshot and save to Documents",
    "Open Task Manager to check processes",
    "Create a backup of important files",
    "Update Windows system settings",
    "Install software from Microsoft Store",
    "Configure firewall settings",
    "Run disk cleanup utility",
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatSessions, currentSessionId])

  const currentSession = chatSessions.find((session) => session.id === currentSessionId)
  const currentMessages = currentSession?.messages || []

  if (showLanding) {
    window.location.reload()
  }

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    }
    setChatSessions((prev) => [newSession, ...prev])
    setCurrentSessionId(newSession.id)
    setAutomationSteps([])
  }

  const shouldShowAutomation = (message: string) => {
    const automationKeywords = [
      "open",
      "create",
      "launch",
      "start",
      "run",
      "execute",
      "install",
      "download",
      "delete",
      "remove",
      "move",
      "copy",
      "backup",
      "clean",
      "optimize",
      "check",
      "configure",
      "setup",
      "update",
      "upgrade",
      "scan",
      "search",
      "find",
    ]

    const lowerMessage = message.toLowerCase()
    return automationKeywords.some((keyword) => lowerMessage.includes(keyword)) && lowerMessage.length > 10 // Avoid simple greetings
  }

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return

    let sessionId = currentSessionId
    if (!sessionId) {
      createNewChat()
      sessionId = chatSessions[0]?.id || Date.now().toString()
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: currentMessage,
      timestamp: new Date(),
    }

    setChatSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              messages: [...session.messages, userMessage],
              title:
                session.messages.length === 0
                  ? currentMessage.substring(0, 30) + (currentMessage.length > 30 ? "..." : "")
                  : session.title,
            }
          : session,
      ),
    )

    const messageToSend = currentMessage
    setCurrentMessage("")
    setIsLoading(true)

    try {
      if (shouldShowAutomation(messageToSend)) {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: messageToSend }),
        })

        if (!response.ok) {
          throw new Error("Failed to get response")
        }

        const data = await response.json()

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: data.userReply,
          timestamp: new Date(),
          canAutomate: data.automationSteps && data.automationSteps.length > 0,
          automationSteps:
            data.automationSteps?.map((step: any) => ({
              ...step,
              status: "pending" as const,
            })) || [],
        }

        setChatSessions((prev) =>
          prev.map((session) =>
            session.id === sessionId ? { ...session, messages: [...session.messages, assistantMessage] } : session,
          ),
        )
      } else {
        const casualResponses = [
          "Hello! I'm here to help you automate Windows tasks. What would you like me to help you with?",
          "Hi there! I can help you automate various Windows operations. Just describe what you'd like to do.",
          "Hey! I'm your Windows automation assistant. Feel free to ask me to help with any system tasks.",
          "Hello! Ready to help you with Windows automation. What task can I assist you with today?",
        ]

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: casualResponses[Math.floor(Math.random() * casualResponses.length)],
          timestamp: new Date(),
          canAutomate: false,
        }

        setChatSessions((prev) =>
          prev.map((session) =>
            session.id === sessionId ? { ...session, messages: [...session.messages, assistantMessage] } : session,
          ),
        )
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      }
      setChatSessions((prev) =>
        prev.map((session) =>
          session.id === sessionId ? { ...session, messages: [...session.messages, errorMessage] } : session,
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleAutomateTask = (steps: AutomationStep[]) => {
    setAutomationSteps(steps)
    setShowAutomationSteps(true)
    // Ensure chat history is visible when showing automation steps
    if (!showChatHistory) {
      setShowChatHistory(true)
    }
  }

  const executeAutomation = async () => {
    if (automationSteps.length === 0) return

    setIsAutomating(true)

    for (let i = 0; i < automationSteps.length; i++) {
      setAutomationSteps((prev) => prev.map((step, index) => (index === i ? { ...step, status: "running" } : step)))

      try {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        console.log(`Executing: ${automationSteps[i].action}`)
        setAutomationSteps((prev) => prev.map((step, index) => (index === i ? { ...step, status: "completed" } : step)))
      } catch (error) {
        setAutomationSteps((prev) => prev.map((step, index) => (index === i ? { ...step, status: "error" } : step)))
        break
      }
    }

    setIsAutomating(false)
  }

  const getStatusIcon = (status: AutomationStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-400" />
      case "running":
        return <Clock className="h-4 w-4 text-yellow-400 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const handleEditMessage = (messageId: string) => {
    const message = currentMessages.find((m) => m.id === messageId)
    if (message) {
      setCurrentMessage(message.content)
    }
  }

  const handleShareMessage = (messageId: string) => {
    const message = currentMessages.find((m) => m.id === messageId)
    if (message) {
      navigator.clipboard.writeText(message.content)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentMessage(suggestion)
  }

  const handleEditChatSession = (sessionId: string) => {
    const session = chatSessions.find((s) => s.id === sessionId)
    if (session) {
      const newTitle = prompt("Edit chat title:", session.title)
      if (newTitle && newTitle.trim()) {
        setChatSessions((prev) => prev.map((s) => (s.id === sessionId ? { ...s, title: newTitle.trim() } : s)))
      }
    }
  }

  const handleShareChatSession = (sessionId: string) => {
    const session = chatSessions.find((s) => s.id === sessionId)
    if (session) {
      const chatContent = session.messages
        .map((m) => `${m.type === "user" ? "You" : "Assistant"}: ${m.content}`)
        .join("\n\n")
      navigator.clipboard.writeText(`Chat: ${session.title}\n\n${chatContent}`)
      // You could add a toast notification here
    }
  }

  const handleDeleteChatSession = (sessionId: string) => {
    if (confirm("Are you sure you want to delete this chat?")) {
      setChatSessions((prev) => prev.filter((s) => s.id !== sessionId))
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null)
        setAutomationSteps([])
      }
    }
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 to-black text-white flex overflow-hidden">
      {/* Chat History - Left Panel */}
      {showChatHistory && (
        <div className="w-1/5 border-r border-gray-700 flex flex-col bg-gray-900/50 backdrop-blur-sm flex-shrink-0">
          <div className="p-4 border-b border-gray-700 bg-gray-900/80">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Chat History</h2>
              <div className="flex space-x-1">
                <Button onClick={createNewChat} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white h-8 w-8 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={() => setShowChatHistory(false)} 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-3 space-y-3">
              {chatSessions.map((session) => (
                <div
                  key={session.id}
                  className={`group flex flex-col p-4 bg-gray-800/50 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800 transition-all duration-200 ${
                    currentSessionId === session.id ? "ring-2 ring-blue-500 bg-gray-800" : ""
                  }`}
                  onClick={() => setCurrentSessionId(session.id)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-1 min-w-0">
                      <p className="text-base text-white truncate font-medium">{session.title}</p>
                      <p className="text-sm text-gray-300 mt-1">{session.messages.length} messages</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-gray-900 border-gray-700" align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditChatSession(session.id)
                          }}
                          className="text-white hover:bg-gray-800 text-sm"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleShareChatSession(session.id)
                          }}
                          className="text-white hover:bg-gray-800 text-sm"
                        >
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteChatSession(session.id)
                          }}
                          className="text-red-400 hover:bg-gray-800 text-sm"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="text-sm text-gray-400 mt-3">
                    {session.createdAt.toLocaleDateString()} at {session.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              ))}
              {chatSessions.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-3">
                    <MessageSquare className="h-12 w-12 mx-auto" />
                  </div>
                  <p className="text-gray-300 text-base">No chat history yet</p>
                  <p className="text-gray-500 text-sm mt-2">Start a conversation to begin</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Chat Interface - Middle Panel */}
      <div className={`flex-1 flex flex-col h-full bg-gray-900/20 ${showAutomationSteps ? 'w-3/5' : 'w-4/5'}`}>
        <div className="border-b border-gray-800 p-3 overflow-hidden bg-gray-900/30 flex-shrink-0">
          <div className="text-center mb-2">
            <span className="text-xs font-medium text-gray-400">Quick Automation Suggestions</span>
          </div>

          <div className="relative mb-1">
            <div className="flex gap-2 animate-scroll-left justify-center">
              {[...automationSuggestions.slice(0, 6), ...automationSuggestions.slice(0, 6)].map((suggestion, index) => (
                <Badge
                  key={`row1-${index}`}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-800 hover:border-blue-400 transition-all whitespace-nowrap border-gray-700 text-gray-300 hover:text-blue-400 flex-shrink-0 text-xs py-1 px-2"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="flex gap-2 animate-scroll-right justify-center">
              {[...automationSuggestions.slice(6), ...automationSuggestions.slice(6)].map((suggestion, index) => (
                <Badge
                  key={`row2-${index}`}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-800 hover:border-blue-400 transition-all whitespace-nowrap border-gray-700 text-gray-300 hover:text-blue-400 flex-shrink-0 text-xs py-1 px-2"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4 min-h-full">
              {currentMessages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="flex items-start gap-2 max-w-[80%]">
                    <Card
                      className={`p-3 ${message.type === "user" ? "bg-white text-black" : "bg-gray-900 border-gray-700"}`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.canAutomate && message.automationSteps && (
                        <Button
                          onClick={() => handleAutomateTask(message.automationSteps!)}
                          className="mt-2 bg-white text-black hover:bg-gray-200"
                          size="sm"
                        >
                          Automate this task
                        </Button>
                      )}
                    </Card>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-gray-900 border-gray-700">
                        <DropdownMenuItem
                          onClick={() => handleEditMessage(message.id)}
                          className="text-white hover:bg-gray-800 text-xs"
                        >
                          <Edit className="h-3 w-3 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleShareMessage(message.id)}
                          className="text-white hover:bg-gray-800 text-xs"
                        >
                          <Share className="h-3 w-3 mr-2" />
                          Share
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <Card className="bg-gray-900 border-gray-700 p-3">
                    <p className="text-sm text-gray-400">Thinking...</p>
                  </Card>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        <div className="border-t border-gray-800 p-3 flex-shrink-0">
          <div className="flex gap-2">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Describe the task you want to automate..."
              className="flex-1 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-white transition-colors"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || isLoading}
              className="bg-white text-black hover:bg-gray-200 transition-colors"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Automation Steps - Right Panel */}
      {showAutomationSteps && (
        <div className="w-1/5 border-l border-gray-700 flex flex-col bg-gray-900/50 backdrop-blur-sm flex-shrink-0">
          <div className="p-3 border-b border-gray-700 bg-gray-900/80">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Automation Steps</h2>
              <div className="flex space-x-1">
                {automationSteps.length > 0 && (
                  <Button
                    onClick={executeAutomation}
                    disabled={isAutomating}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white transition-colors h-7 px-2"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Execute
                  </Button>
                )}
                <Button 
                  onClick={() => setShowAutomationSteps(false)} 
                  size="sm" 
                  variant="ghost" 
                  className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <XCircle className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-3 space-y-3">
              {automationSteps.length > 0 ? (
                automationSteps.map((step) => (
                  <Card key={step.id} className="p-3 bg-gray-800/50 border border-gray-700 hover:bg-gray-800 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 pt-0.5">
                        {getStatusIcon(step.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium">Step {step.id}</p>
                        <p className="text-sm text-gray-200 mt-1">{step.description}</p>
                        <p className="text-xs text-gray-400 mt-2 font-mono bg-gray-900/50 p-2 rounded truncate">{step.action}</p>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-2">
                    <Settings className="h-8 w-8 mx-auto" />
                  </div>
                  <p className="text-gray-400 text-sm">No automation steps</p>
                  <p className="text-gray-500 text-xs mt-1">Send a task and click "Automate this task"</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        .animate-scroll-left {
          animation: scroll-left 25s linear infinite;
        }
        
        .animate-scroll-right {
          animation: scroll-right 25s linear infinite;
        }
      `}</style>
    </div>
  )
}
