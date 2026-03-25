"use client"

import { useRef, useState } from "react"
import axios from "axios"
import ReactMarkdown from "react-markdown"
import DiffViewer from "react-diff-viewer-continued"

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [code, setCode] = useState("")
  const [fileName, setFileName] = useState<string | null>(null)
  const [result, setResult] = useState("")
  const [explanation, setExplanation] = useState("")
  const [refactorLoading, setRefactorLoading] = useState(false)
  const [explainLoading, setExplainLoading] = useState(false)

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

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-4xl font-bold mb-6">
        AI Code Refactor Tool
      </h1>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={triggerFilePicker}
          className="w-max bg-blue-600 px-4 py-2 rounded text-sm font-medium hover:bg-blue-500"
        >
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
          <div className="text-sm text-gray-300">
            Loaded file: <span className="text-white">{fileName}</span>
          </div>
        ) : null}

        <textarea
          className="w-full h-48 p-4 bg-gray-900 text-white border border-gray-700 rounded-xl font-mono"
          placeholder="Paste messy code or upload a file above..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRefactor}
            disabled={!code.trim() || refactorLoading}
            className="mt-2 bg-green-500 px-6 py-2 rounded disabled:opacity-60"
          >
            {refactorLoading ? "Refactoring..." : "Refactor Code"}
          </button>

          <button
            onClick={handleClear}
            className="mt-2 bg-gray-700 px-6 py-2 rounded"
          >
            Clear
          </button>
        </div>
      </div>

      {result && (
        <section className="mt-10">
          <h2 className="text-2xl mb-2">Side-by-side Diff</h2>

          <div className="rounded-xl overflow-hidden border border-gray-700">
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

          <div className="mt-10">
            <h2 className="text-2xl mb-2">Refactored Code</h2>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-xl overflow-x-auto font-mono">
              {result}
            </pre>
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-2xl mb-2">AI Explanation</h2>
        <div className="bg-gray-900 p-6 rounded-xl text-gray-200 whitespace-pre-wrap">
          {refactorLoading ? (
            "Refactoring in progress..."
          ) : explainLoading ? (
            "Generating explanation..."
          ) : explanation ? (
            <ReactMarkdown>{explanation}</ReactMarkdown>
          ) : (
            "Explanation will appear here after refactoring."
          )}
        </div>
      </section>
    </div>
  )
}