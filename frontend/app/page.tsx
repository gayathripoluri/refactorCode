"use client"

import { useRef, useState } from "react"
import axios from "axios"
import ReactMarkdown from "react-markdown"
import DiffViewer from "react-diff-viewer-continued"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000"

const diffViewerStyles = {
  variables: {
    dark: {
      diffViewerBackground: "#0f172a",
      diffViewerColor: "#e2e8f0",
      diffViewerTitleBackground: "#1e293b",
      diffViewerTitleColor: "#cbd5e1",
      diffViewerTitleBorderColor: "#334155",
      addedBackground: "rgba(16, 185, 129, 0.15)",
      addedColor: "#6ee7b7",
      removedBackground: "rgba(244, 63, 94, 0.15)",
      removedColor: "#fda4af",
      wordAddedBackground: "rgba(16, 185, 129, 0.35)",
      wordRemovedBackground: "rgba(244, 63, 94, 0.35)",
      addedGutterBackground: "rgba(16, 185, 129, 0.08)",
      removedGutterBackground: "rgba(244, 63, 94, 0.08)",
      gutterBackground: "#0f172a",
      gutterBackgroundDark: "#0b1220",
      highlightBackground: "rgba(99, 102, 241, 0.1)",
      highlightGutterBackground: "rgba(99, 102, 241, 0.15)",
      codeFoldGutterBackground: "#1e293b",
      codeFoldBackground: "#1e293b",
      emptyLineBackground: "#0f172a",
      gutterColor: "#64748b",
      addedGutterColor: "#6ee7b7",
      removedGutterColor: "#fda4af",
      codeFoldContentColor: "#94a3b8"
    }
  }
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.5 6.5l2 2M15.5 15.5l2 2M6.5 17.5l2-2M15.5 8.5l2-2" />
    </svg>
  )
}

function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 16V4M12 4l-4 4M12 4l4 4" />
      <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  )
}

function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  )
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function SpinnerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="animate-spin" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={3} strokeOpacity={0.25} />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
    </svg>
  )
}

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [code, setCode] = useState("")
  const [fileName, setFileName] = useState<string | null>(null)
  const [result, setResult] = useState("")
  const [explanation, setExplanation] = useState("")
  const [refactorLoading, setRefactorLoading] = useState(false)
  const [explainLoading, setExplainLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const triggerFilePicker = () => {
    fileInputRef.current?.click()
  }

  const handleRefactor = async () => {
    setRefactorLoading(true)
    setExplanation("")

    try {
      const response = await axios.post(
        `${API_BASE}/api/refactor`,
        { code }
      )

      setResult(response.data.refactoredCode)

      setExplainLoading(true)
      const explainResponse = await axios.post(
        `${API_BASE}/api/refactor/explain`,
        {
          originalCode: code,
          refactoredCode: response.data.refactoredCode
        }
      )

      setExplanation(explainResponse.data.explanation)
    } catch (error) {
      console.error(error)
      setExplanation("An error occurred while refactoring.")
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
  }

  const handleClear = () => {
    setCode("")
    setResult("")
    setExplanation("")
    setFileName(null)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[28rem] w-[56rem] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[22rem] w-[22rem] rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-10 border-b border-white/5 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/30">
            <SparklesIcon className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-none">AI Code Refactor Tool</p>
            <p className="truncate text-xs text-slate-400">Clean up messy code in seconds</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h1 className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl lg:text-5xl">
            Refactor your code, instantly.
          </h1>
          <p className="mt-3 text-sm text-slate-400 sm:text-base">
            Paste or upload code and get a refactored version with a clear explanation of what changed.
          </p>
        </div>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-xl shadow-black/20 backdrop-blur-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={triggerFilePicker}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-100 ring-1 ring-white/10 transition hover:bg-white/10"
            >
              <UploadIcon className="h-4 w-4" />
              Upload source code
            </button>
            <input
              ref={fileInputRef}
              id="codeFile"
              type="file"
              accept=".js,.ts,.jsx,.tsx,.py,.java,.cs,.cpp,.c,.go,.rb,.php,.rs,.swift"
              onChange={handleFileUpload}
              className="hidden"
            />
            {fileName ? (
              <span className="truncate text-sm text-slate-400">
                Loaded file: <span className="text-slate-200">{fileName}</span>
              </span>
            ) : null}
          </div>

          <textarea
            className="mt-4 h-48 w-full resize-y rounded-xl border border-white/10 bg-slate-950/60 p-4 font-mono text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 sm:h-56"
            placeholder="Paste messy code or upload a file above..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleRefactor}
              disabled={!code.trim() || refactorLoading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none sm:flex-1"
            >
              {refactorLoading ? (
                <>
                  <SpinnerIcon className="h-4 w-4" />
                  Refactoring...
                </>
              ) : (
                "Refactor Code"
              )}
            </button>

            <button
              onClick={handleClear}
              className="inline-flex items-center justify-center rounded-lg bg-white/5 px-6 py-2.5 text-sm font-medium text-slate-200 ring-1 ring-white/10 transition hover:bg-white/10"
            >
              Clear
            </button>
          </div>
        </section>

        {result && (
          <section className="mt-8 animate-fade-in-up sm:mt-10">
            <h2 className="mb-3 text-xl font-semibold sm:text-2xl">Side-by-side Diff</h2>
            <div className="overflow-x-auto rounded-xl border border-white/10 shadow-xl shadow-black/20">
              <DiffViewer
                oldValue={code}
                newValue={result}
                splitView
                useDarkTheme
                styles={diffViewerStyles}
                hideLineNumbers={false}
                showDiffOnly={false}
                leftTitle="Original"
                rightTitle="Refactored"
              />
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between rounded-t-xl border border-b-0 border-white/10 bg-white/[0.03] px-4 py-2.5">
                <h2 className="text-sm font-semibold text-slate-300">Refactored Code</h2>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-white/10 hover:text-slate-200"
                >
                  {copied ? (
                    <>
                      <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <CopyIcon className="h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto rounded-b-xl border border-white/10 bg-slate-900/60 p-4 font-mono text-sm text-emerald-400">
                {result}
              </pre>
            </div>
          </section>
        )}

        <section className="mt-8 sm:mt-10">
          <h2 className="mb-3 text-xl font-semibold sm:text-2xl">AI Explanation</h2>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-slate-200 shadow-xl shadow-black/20 backdrop-blur-sm sm:p-6 sm:text-base">
            {refactorLoading ? (
              <span className="inline-flex items-center gap-2 text-slate-400">
                <SpinnerIcon className="h-4 w-4" />
                Refactoring in progress...
              </span>
            ) : explainLoading ? (
              <span className="inline-flex items-center gap-2 text-slate-400">
                <SpinnerIcon className="h-4 w-4" />
                Generating explanation...
              </span>
            ) : explanation ? (
              <div className="markdown-body">
                <ReactMarkdown>{explanation}</ReactMarkdown>
              </div>
            ) : (
              <span className="text-slate-500">Explanation will appear here after refactoring.</span>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
