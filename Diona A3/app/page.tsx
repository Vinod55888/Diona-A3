import CriminalRiskAssessmentForm from "@/components/criminal-risk-assessment-form"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-blue-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
            Manitoba Families - Criminal Risk Assessment Unit
          </h1>
          <p className="text-blue-600">Child Protection Branch | 201 - 114 Garry Street, Winnipeg, Manitoba R3C 4V5</p>
        </div>
        <CriminalRiskAssessmentForm />
      </div>
    </main>
  )
}
