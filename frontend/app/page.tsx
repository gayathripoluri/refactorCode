"use client"

import { useRef, useState, useEffect } from "react"
import axios from "axios"
import ReactMarkdown from "react-markdown"
import DiffViewer from "react-diff-viewer-continued"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [code, setCode] = useState("")
  const [fileName, setFileName] = useState<string | null>(null)
  const [result, setResult] = useState("")
  const [explanation, setExplanation] = useState("")
  const [refactorLoading, setRefactorLoading] = useState(false)
  const [explainLoading, setExplainLoading] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)
  const [codeLength, setCodeLength] = useState(0)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark"
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute("data-theme", savedTheme)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
  }

  const copyToClipboard = (text: string, index: string) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const triggerFilePicker = () => {
    fileInputRef.current?.click()
  }

  const handleRefactor = async () => {
    setRefactorLoading(true)
    setExplanation("")

    try {
      const response = await axios.post(
        "http://localhost:5000/api/refactor",
        { code }
      )

      setResult(response.data.refactoredCode)

      setExplainLoading(true)
      const explainResponse = await axios.post(
        "http://localhost:5000/api/refactor/explain",
        {
          originalCode: code,
          refactoredCode: response.data.refactoredCode
        }
      )

      setExplanation(explainResponse.data.explanation)
    } catch (error) {
      console.error(error)
      setExplanation("An error occurred while refactoring. Please try again.")
    } finally {
      setRefactorLoading(false)
      setExplainLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    const text = await file.text()
    setCode(text)
    setCodeLength(text.length)
  }

  const handleClear = () => {
    setCode("")
    setResult("")
    setExplanation("")
    setFileName(null)
    setCodeLength(0)
  }

  const detectLanguage = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase()
    const langMap: { [key: string]: string } = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      java: "java",
      cs: "csharp",
      cpp: "cpp",
      c: "c",
      go: "go",
      rb: "ruby",
      php: "php",
      rs: "rust",
      swift: "swift"
    }
    return langMap[ext || ""] || "javascript"
  }

  return (
    <div style={{ backgroundColor: "var(--background)", color: "var(--foreground)" } as React.CSSProperties}>
      <div className="min-h-screen" style={{ background: theme === "dark" ? "linear-gradient(135deg, #0f172a 0%, #1a1f3a 50%, #0f172a 100%)" : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)" }}>
        
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md border-b" style={{ borderColor: "var(--border-color)", backgroundColor: theme === "dark" ? "rgba(15, 23, 42, 0.8)" : "rgba(248, 250, 252, 0.8)" }}>
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                ✨
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  CodeRefactor AI
                </h1>
                <p className="text-xs" style={{ opacity: 0.6 }}>Intelligent Code Enhancement</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              style={{ backgroundColor: "var(--card-bg)", color: "var(--foreground)", borderColor: "var(--border-color)" }}
              className="px-4 py-2 rounded-lg transition font-medium border hover:bg-opacity-80 flex items-center gap-2"
            >
              {theme === "dark" ? "☀️" : "🌙"}
              <span className="text-sm">{theme === "dark" ? "Light" : "Dark"}</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 md:px-8 py-12">
          
          {/* Welcome Section */}
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ lineHeight: "1.2" }}>
              Transform Your Code with AI
            </h2>
            <p className="text-lg" style={{ opacity: 0.7, maxWidth: "600px" }}>
              Automatically refactor, optimize, and improve your code using advanced AI. Remove code smells, apply SOLID principles, and enhance readability in seconds.
            </p>
          </div>

          {/* Editor Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            
            {/* Input Panel */}
            <div style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }} className="rounded-2xl border p-6 shadow-lg transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold">Source Code</h3>
                  {codeLength > 0 && <p className="text-xs mt-1" style={{ opacity: 0.6 }}>{codeLength} characters</p>}
                </div>
              </div>
              
              <button
                type="button"
                onClick={triggerFilePicker}
                style={{ backgroundColor: "var(--primary-color)", color: "white" }}
                className="w-full px-4 py-3 rounded-lg text-sm font-semibold transition mb-4 hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>📁</span>
                <span>Upload Code File</span>
              </button>
              <input
                ref={fileInputRef}
                id="codeFile"
                type="file"
                accept=".js,.ts,.jsx,.tsx,.py,.java,.cs,.cpp,.c,.go,.rb,.php,.rs,.swift"
                onChange={handleFileUpload}
                className="hidden"
              />

              {fileName && (
                <div className="mb-3 p-3 rounded-lg" style={{ backgroundColor: "var(--secondary-bg)", borderLeft: "3px solid var(--primary-color)" }}>
                  <p className="text-xs" style={{ opacity: 0.7 }}>File Loaded</p>
                  <p className="font-semibold text-sm">{fileName}</p>
                </div>
              )}

              <textarea
                style={{ backgroundColor: "var(--tertiary-bg)", color: "var(--foreground)", borderColor: "var(--border-color)" }}
                className="w-full h-80 p-4 border rounded-xl font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 resize-none transition"
                placeholder="Paste your code or upload a file..."
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  setCodeLength(e.target.value.length)
                }}
              />

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleRefactor}
                  disabled={!code.trim() || refactorLoading}
                  style={{ backgroundColor: !code.trim() || refactorLoading ? "var(--border-color)" : "var(--success-color)", color: "white" }}
                  className="flex-1 px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
                >
                  {refactorLoading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      <span>Refactor Now</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleClear}
                  style={{ backgroundColor: "var(--secondary-bg)", color: "var(--foreground)" }}
                  className="px-6 py-3 rounded-lg font-semibold transition hover:opacity-80 active:scale-95"
                >
                  ↻ Clear
                </button>
              </div>
            </div>

            {/* Output Preview Panel */}
            {result && (
              <div style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }} className="rounded-2xl border p-6 shadow-lg transition-all duration-300 hover:shadow-2xl flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Refactored Code</h3>
                  <button
                    onClick={() => copyToClipboard(result, "refactored")}
                    style={{
                      backgroundColor: copiedIndex === "refactored" ? "var(--success-color)" : "var(--secondary-bg)",
                      color: "var(--foreground)"
                    }}
                    className="text-xs px-3 py-2 rounded-lg transition active:scale-95"
                  >
                    {copiedIndex === "refactored" ? "✓ Copied" : "📋 Copy"}
                  </button>
                </div>
                <div style={{ backgroundColor: "var(--tertiary-bg)", borderColor: "var(--border-color)" }} className="flex-1 rounded-xl border p-4 overflow-x-auto">
                  <SyntaxHighlighter
                    language={fileName ? detectLanguage(fileName) : "javascript"}
                    style={vscDarkPlus}
                    showLineNumbers={true}
                    wrapLongLines={true}
                    lineNumberStyle={{ color: "#666", minWidth: "40px" }}
                  >
                    {result}
                  </SyntaxHighlighter>
                </div>
              </div>
            )}
          </div>

          {/* Explanation Section */}
          {(result || refactorLoading || explainLoading) && (
            <div style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }} className="rounded-2xl border p-6 shadow-lg transition-all duration-300 hover:shadow-2xl mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span>🤖</span>
                  <span>AI Analysis & Recommendations</span>
                </h3>
                {result && (
                  <button
                    onClick={() => copyToClipboard(explanation, "explanation")}
                    style={{
                      backgroundColor: copiedIndex === "explanation" ? "var(--success-color)" : "var(--secondary-bg)",
                      color: "var(--foreground)"
                    }}
                    className="text-xs px-3 py-2 rounded-lg transition active:scale-95"
                  >
                    {copiedIndex === "explanation" ? "✓ Copied" : "📋 Copy"}
                  </button>
                )}
              </div>
              <div style={{ backgroundColor: "var(--tertiary-bg)", color: "var(--foreground)" }} className="p-6 rounded-xl min-h-40">
                {refactorLoading ? (
                  <div className="flex items-center gap-3">
                    <span className="animate-spin text-2xl">⏳</span>
                    <div>
                      <p className="font-semibold">Analyzing your code...</p>
                      <p className="text-sm" style={{ opacity: 0.6 }}>Applying AI-powered optimizations</p>
                    </div>
                  </div>
                ) : explainLoading ? (
                  <div className="flex items-center gap-3">
                    <span className="animate-spin text-2xl">✨</span>
                    <div>
                      <p className="font-semibold">Generating insights...</p>
                      <p className="text-sm" style={{ opacity: 0.6 }}>Preparing recommendations</p>
                    </div>
                  </div>
                ) : explanation ? (
                  <div className="prose prose-sm" style={{ color: "var(--foreground)" }}>
                    <ReactMarkdown
                      components={{
                        p: (props) => <p className="mb-3" {...props} />,
                        li: (props) => <li className="ml-4 mb-2" {...props} />,
                        strong: (props) => <strong className="font-semibold text-blue-400" {...props} />
                      }}
                    >
                      {explanation}
                    </ReactMarkdown>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Diff Section */}
          {result && (
            <div style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }} className="rounded-2xl border p-6 shadow-lg transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-xl font-semibold mb-6">Change Comparison</h3>
              <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border-color)" }}>
                <DiffViewer
                  oldValue={code}
                  newValue={result}
                  splitView
                  hideLineNumbers={false}
                  showDiffOnly={false}
                  leftTitle="Original"
                  rightTitle="Refactored"
                />
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t mt-20" style={{ borderColor: "var(--border-color)" }}>
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 text-center" style={{ opacity: 0.6 }}>
            <p className="text-sm">
              CodeRefactor AI • Powered by Advanced Language Models • Transform Your Code Today
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}