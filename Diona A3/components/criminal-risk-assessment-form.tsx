"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import SignatureCanvas from "react-signature-canvas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon, FileSpreadsheet, Printer } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import * as XLSX from "xlsx"

type FormData = {
  firstName: string
  secondName: string
  lastName: string
  dateOfBirth: Date
  gender: string
  otherLastNames: string
  otherFirstNames: string
  currentAddress: string
  currentPhone: string
  birthPlace: string
  identification: string[]
  driverLicense: string
  agencyName: string
  reasonForAssessment: string
  assignedWorker: string
  lastAssessmentDate: string
  submittingDesignate: string
  designatePhone: string
  designateEmail: string
  designateFax: string
  requestDate: Date
}

export default function CriminalRiskAssessmentForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>()
  const [sigPad, setSigPad] = useState<SignatureCanvas | null>(null)
  const [signature, setSignature] = useState<string | null>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [requestDate, setRequestDate] = useState<Date | undefined>(new Date())
  const [identifications, setIdentifications] = useState<string[]>([])
  const [gender, setGender] = useState<string>("male")
  const [reasonForAssessment, setReasonForAssessment] = useState<string[]>([])

  const clearSignature = () => {
    if (sigPad) {
      sigPad.clear()
      setSignature(null)
    }
  }

  const saveSignature = () => {
    if (sigPad) {
      const signatureData = sigPad.toDataURL("image/png")
      setSignature(signatureData)
      toast({
        title: "Signature saved",
        description: "Your signature has been saved successfully.",
      })
    }
  }

  const onSubmit = (data: FormData) => {
    console.log({ ...data, signature, date, identifications, gender, reasonForAssessment })
    toast({
      title: "Form submitted",
      description: "Your form has been submitted successfully.",
    })
  }

  const toggleIdentification = (value: string) => {
    setIdentifications((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value)
      } else {
        return [...prev, value]
      }
    })
  }

  const toggleReasonForAssessment = (value: string) => {
    setReasonForAssessment((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value)
      } else {
        return [...prev, value]
      }
    })
  }

  const exportToExcel = () => {
    // Collect form data
    const formData = {
      Date: date ? format(date, "PPP") : "",
      "First Name": watch("firstName") || "",
      "Second Name": watch("secondName") || "",
      "Last Name": watch("lastName") || "",
      "Date of Birth": watch("dateOfBirth") ? format(watch("dateOfBirth"), "PPP") : "",
      Gender: gender,
      "Other Last Names": watch("otherLastNames") || "",
      "Other First Names": watch("otherFirstNames") || "",
      "Current Address": watch("currentAddress") || "",
      "Current Phone": watch("currentPhone") || "",
      "Birth Place": watch("birthPlace") || "",
      Identification: identifications.join(", "),
      "Driver License": watch("driverLicense") || "",
      "Agency Name": watch("agencyName") || "",
      "Reason For Assessment": reasonForAssessment.join(", "),
      "Assigned Worker": watch("assignedWorker") || "",
      "Last Assessment Date": watch("lastAssessmentDate") || "",
      "Submitting Designate": watch("submittingDesignate") || "",
      "Designate Phone": watch("designatePhone") || "",
      "Designate Email": watch("designateEmail") || "",
      "Designate Fax": watch("designateFax") || "",
      "Request Date": requestDate ? format(requestDate, "PPP") : "",
    }

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet([formData])

    // Create workbook
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Criminal Risk Assessment")

    // Generate Excel file and convert to blob
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })

    // Create download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "Criminal_Risk_Assessment.xlsx"

    // Append to body, click, and remove
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up
    URL.revokeObjectURL(url)

    toast({
      title: "Excel file generated",
      description: "Your form data has been exported to Excel.",
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-600 text-white">
          <CardTitle className="text-xl font-bold">
            CONSENT FOR CRIMINAL RISK ASSESSMENT AND RELEASE OF INFORMATION
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-sm mb-6 space-y-2 bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
            <p>
              As a person who has, or may have, care, custody, control or charge of a child in receipt of services under
              The Child and Family Services Act, I authorize the Criminal Risk Assessment Unit of Manitoba Families'
              Child Protection Branch ("CRAU") to conduct enquiries of the Winnipeg Police Service (WPS), the RCMP and
              other law enforcement agencies necessary to assess the risk that l may endanger the life, health or
              emotional wellbeing of a child.
            </p>
            <p>
              I understand that this information is requested by (CFS Agency) for the purposes of, and in accordance
              with, s. 18.4(1.1) of The Child and Family Services Act, and may include a criminal record, criminal and
              Provincial Act convictions, orders or charges, other involvement/contact with law enforcement (including
              non-conviction information) or other information.
            </p>
            <p className="font-semibold text-blue-800">
              I authorize the disclosure of said information to CRAU and an authorized Child and Family Services Agency
              designate or designates.
            </p>
            <p className="font-semibold text-blue-800">
              I also authorize the disclosure of the personal identifying information set out below to CRAU, the WPS,
              RCMP and other law enforcement agencies for the purpose of completing a Criminal Risk Assessment.
            </p>
            <p>
              I understand that the results of this Criminal Risk Assessment are confidential, and may not be provided
              to me, but may be disclosed in accordance with s.76 of the Child and Family Services Act.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="group">
              <Label htmlFor="date" className="text-blue-700 group-hover:text-blue-800 transition-colors">
                Date:
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal border-blue-200 hover:border-blue-400 transition-colors",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="group">
              <Label htmlFor="signature" className="text-blue-700 group-hover:text-blue-800 transition-colors">
                Signature of person being assessed:
              </Label>
              <div className="border border-blue-200 rounded-md p-2 bg-white hover:border-blue-400 transition-colors">
                <SignatureCanvas
                  ref={(ref) => setSigPad(ref)}
                  penColor="black"
                  canvasProps={{
                    className: "w-full h-24 border border-gray-200 rounded-sm",
                  }}
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearSignature}
                    className="border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    Clear
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={saveSignature}
                    className="border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-b from-gray-50 to-gray-100 p-6 rounded-md border border-gray-200 shadow-sm">
            <h3 className="text-center font-bold mb-6 text-blue-800 text-lg">PLEASE PRINT CLEARLY</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <Label htmlFor="firstName" className="text-blue-700 group-hover:text-blue-800 transition-colors">
                  1. FIRST NAME:
                </Label>
                <Input
                  id="firstName"
                  {...register("firstName", { required: true })}
                  className="bg-white border-blue-200 focus:border-blue-400 hover:border-blue-300 transition-colors"
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">First name is required</p>}
              </div>
              <div className="group">
                <Label htmlFor="secondName" className="text-blue-700 group-hover:text-blue-800 transition-colors">
                  2. SECOND NAME:
                </Label>
                <Input
                  id="secondName"
                  {...register("secondName")}
                  className="bg-white border-blue-200 focus:border-blue-400 hover:border-blue-300 transition-colors"
                />
              </div>
              <div className="group">
                <Label htmlFor="lastName" className="text-blue-700 group-hover:text-blue-800 transition-colors">
                  3. LAST NAME:
                </Label>
                <Input
                  id="lastName"
                  {...register("lastName", { required: true })}
                  className="bg-white border-blue-200 focus:border-blue-400 hover:border-blue-300 transition-colors"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">Last name is required</p>}
              </div>
              <div className="group">
                <Label htmlFor="dateOfBirth" className="text-blue-700 group-hover:text-blue-800 transition-colors">
                  4. DATE OF BIRTH:
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-white border-blue-200 hover:border-blue-400 transition-colors",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => {
                        setDate(date)
                        setValue("dateOfBirth", date as Date)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="group">
                <Label className="text-blue-700 group-hover:text-blue-800 transition-colors">5. GENDER:</Label>
                <RadioGroup
                  defaultValue="male"
                  className="flex space-x-4 mt-2"
                  onValueChange={setGender}
                  value={gender}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" className="text-blue-600" />
                    <Label htmlFor="male">MALE</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" className="text-blue-600" />
                    <Label htmlFor="female">FEMALE</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="group">
                <Label htmlFor="otherLastNames" className="text-blue-700 group-hover:text-blue-800 transition-colors">
                  6. OTHER LAST NAMES USED:
                </Label>
                <Input
                  id="otherLastNames"
                  {...register("otherLastNames")}
                  className="bg-white border-blue-200 focus:border-blue-400 hover:border-blue-300 transition-colors"
                />
              </div>
              <div className="group">
                <Label htmlFor="otherFirstNames" className="text-blue-700 group-hover:text-blue-800 transition-colors">
                  7. OTHER FIRST NAMES USED/ALSO GOES BY:
                </Label>
                <Input
                  id="otherFirstNames"
                  {...register("otherFirstNames")}
                  className="bg-white border-blue-200 focus:border-blue-400 hover:border-blue-300 transition-colors"
                />
              </div>
              <div className="md:col-span-2 group">
                <Label htmlFor="currentAddress" className="text-blue-700 group-hover:text-blue-800 transition-colors">
                  8. CURRENT ADDRESS (include postal code):
                </Label>
                <Input
                  id="currentAddress"
                  {...register("currentAddress", { required: true })}
                  className="bg-white border-blue-200 focus:border-blue-400 hover:border-blue-300 transition-colors"
                />
                {errors.currentAddress && <p className="text-red-500 text-sm mt-1">Address is required</p>}
              </div>
              <div className="group">
                <Label htmlFor="currentPhone" className="text-blue-700 group-hover:text-blue-800 transition-colors">
                  9. CURRENT PH#s:
                </Label>
                <Input
                  id="currentPhone"
                  {...register("currentPhone")}
                  className="bg-white border-blue-200 focus:border-blue-400 hover:border-blue-300 transition-colors"
                />
              </div>
              <div className="group">
                <Label htmlFor="birthPlace" className="text-blue-700 group-hover:text-blue-800 transition-colors">
                  10. City/Province or Country of Birth:
                </Label>
                <Input
                  id="birthPlace"
                  {...register("birthPlace")}
                  className="bg-white border-blue-200 focus:border-blue-400 hover:border-blue-300 transition-colors"
                />
              </div>
            </div>

            <div className="mt-8">
              <p className="font-semibold mb-4 text-blue-800">
                *PLEASE NOTE: Subject's name must be identified with TWO PIECES OF IDENTIFICATION (MB D/L & photo ID is
                preferable):
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center space-x-2 group hover:bg-blue-50 p-2 rounded-md transition-colors">
                  <Checkbox
                    id="birthCertificate"
                    checked={identifications.includes("birthCertificate")}
                    onCheckedChange={() => toggleIdentification("birthCertificate")}
                    className="text-blue-600 border-blue-300"
                  />
                  <Label htmlFor="birthCertificate" className="group-hover:text-blue-700 transition-colors">
                    Birth Certificate
                  </Label>
                </div>
                <div className="flex items-center space-x-2 group hover:bg-blue-50 p-2 rounded-md transition-colors">
                  <Checkbox
                    id="socialInsurance"
                    checked={identifications.includes("socialInsurance")}
                    onCheckedChange={() => toggleIdentification("socialInsurance")}
                    className="text-blue-600 border-blue-300"
                  />
                  <Label htmlFor="socialInsurance" className="group-hover:text-blue-700 transition-colors">
                    Social Insurance Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2 group hover:bg-blue-50 p-2 rounded-md transition-colors">
                  <Checkbox
                    id="healthCard"
                    checked={identifications.includes("healthCard")}
                    onCheckedChange={() => toggleIdentification("healthCard")}
                    className="text-blue-600 border-blue-300"
                  />
                  <Label htmlFor="healthCard" className="group-hover:text-blue-700 transition-colors">
                    Manitoba Health Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2 group hover:bg-blue-50 p-2 rounded-md transition-colors">
                  <Checkbox
                    id="treatyCard"
                    checked={identifications.includes("treatyCard")}
                    onCheckedChange={() => toggleIdentification("treatyCard")}
                    className="text-blue-600 border-blue-300"
                  />
                  <Label htmlFor="treatyCard" className="group-hover:text-blue-700 transition-colors">
                    Treaty Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2 group hover:bg-blue-50 p-2 rounded-md transition-colors">
                  <Checkbox
                    id="otherID"
                    checked={identifications.includes("otherID")}
                    onCheckedChange={() => toggleIdentification("otherID")}
                    className="text-blue-600 border-blue-300"
                  />
                  <Label htmlFor="otherID" className="group-hover:text-blue-700 transition-colors">
                    Other (specify ID):
                  </Label>
                </div>
              </div>
              <div className="group">
                <Label htmlFor="driverLicense" className="text-blue-700 group-hover:text-blue-800 transition-colors">
                  MB Driver's License with Photo - licence number (section 4d on licence):
                </Label>
                <Input
                  id="driverLicense"
                  {...register("driverLicense")}
                  className="bg-white border-blue-200 focus:border-blue-400 hover:border-blue-300 transition-colors"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-600 text-white">
          <CardTitle className="text-xl font-bold">AGENCY INFORMATION</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-sm mb-6 space-y-2 bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
            <p className="font-bold text-blue-800">
              IT IS IMPORTANT THAT THE CFS AGENCY DESIGNATE READS AND UNDERSTANDS THE FOLLOWING:
            </p>
            <p>
              The identifying information supplied on page 1 will be researched through the Canadian Police Information
              Centre (CPIC) and Winnipeg Police Service Records Management System (NICHE). The research will NOT include
              a vulnerable sector search or information in respect of pardons, which information may impact the results
              of a risk assessment. Criminal Convictions are strictly confidential and cannot be shared without written
              authorization of the person involved. Personal Information is governed under Section 8 of the Privacy Act
              (Federal Statute).
            </p>
            <p className="font-bold text-blue-800">
              PLEASE NOTE that record information is based on NAME AND DATE OF BIRTH SEARCH ONLY and does not
              necessarily indicate subject involvement.
            </p>
            <p>
              Verification can only be provided through the submission of fingerprints to the local law enforcement
              agency for the area in which the person being assessed resides. In the case of dispute regarding the
              identity of the person being assessed, that person is advised to attend any RCMP Detachment; Winnipeg
              Police Service, 245 Smith Street, Winnipeg, Manitoba; Brandon Police Service, 1340 10th Street, Brandon,
              Manitoba; or local Police Agency. A fee for service is required.
            </p>
          </div>

          <div className="bg-gradient-to-b from-gray-50 to-gray-100 p-6 rounded-md border border-gray-200 shadow-sm">
            <p className="font-bold mb-6 text-blue-800 text-center">
              NOTE – SECTIONS MARKED WITH AN ASTERISK (*) ARE REQUIRED
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <Label htmlFor="agencyName" className="text-blue-700 group-hover:text-blue-800 transition-colors">
                  *NAME OF AGENCY SUBMITTING REQUEST:
                </Label>
                <Input
                  id="agencyName"
                  {...register("agencyName", { required: true })}
                  className="bg-white border-blue-200 focus:border-blue-400 hover:border-blue-300 transition-colors"
                  required
                />
                {errors.agencyName && <p className="text-red-500 text-sm mt-1">Agency name is required</p>}
              </div>

              <div className="group">
                <Label className="text-blue-700 group-hover:text-blue-800 transition-colors">
                  *REASON FOR RISK ASSESSMENT:
                </Label>
                <div className="mt-2 space-y-2">
                  <p className="text-sm font-medium text-blue-700">With or Without Consent:</p>
                  <div className="flex items-center space-x-2 group hover:bg-blue-50 p-2 rounded-md transition-colors">
                    <Checkbox
                      id="childProtection"
                      checked={reasonForAssessment.includes("childProtection")}
                      onCheckedChange={() => toggleReasonForAssessment("childProtection")}
                      className="text-blue-600 border-blue-300"
                    />
                    <Label htmlFor="childProtection" className="group-hover:text-blue-700 transition-colors">
                      Child Protection Concerns
                    </Label>
                  </div>

                  <p className="text-sm font-medium text-blue-700">Must have consent:</p>
                  <div className="flex items-center space-x-2 group hover:bg-blue-50 p-2 rounded-md transition-colors">
                    <Checkbox
                      id="placeOfSafety"
                      checked={reasonForAssessment.includes("placeOfSafety")}
                      onCheckedChange={() => toggleReasonForAssessment("placeOfSafety")}
                      className="text-blue-600 border-blue-300"
                    />
                    <Label htmlFor="placeOfSafety" className="group-hover:text-blue-700 transition-colors">
                      Place of Safety
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 group hover:bg-blue-50 p-2 rounded-md transition-colors">
                    <Checkbox
                      id="kinship"
                      checked={reasonForAssessment.includes("kinship")}
                      onCheckedChange={() => toggleReasonForAssessment("kinship")}
                      className="text-blue-600 border-blue-300"
                    />
                    <Label htmlFor="kinship" className="group-hover:text-blue-700 transition-colors">
                      Kinship or Customary Care Agreement
                    </Label>
                  </div>
                </div>
              </div>

              <div className="group">
                <Label htmlFor="assignedWorker" className="text-blue-700 group-hover:text-blue-800 transition-colors">
                  *ASSIGNED WORKER:
                </Label>
                <Input
                  id="assignedWorker"
                  {...register("assignedWorker", { required: true })}
                  className="bg-white border-blue-200 focus:border-blue-400 hover:border-blue-300 transition-colors"
                  required
                />
                {errors.assignedWorker && <p className="text-red-500 text-sm mt-1">Assigned worker is required</p>}
              </div>

              <div className="group">
                <Label
                  htmlFor="lastAssessmentDate"
                  className="text-blue-700 group-hover:text-blue-800 transition-colors"
                >
                  DATE OF LAST CRIMINAL RISK ASSESSMENT (if known):
                </Label>
                <Input
                  id="lastAssessmentDate"
                  {...register("lastAssessmentDate")}
                  className="bg-white border-blue-200 focus:border-blue-400 hover:border-blue-300 transition-colors"
                />
              </div>

              <div className="group">
                <Label
                  htmlFor="submittingDesignate"
                  className="text-blue-700 group-hover:text-blue-800 transition-colors"
                >
                  *SUBMITTING DESIGNATE:
                </Label>
                <Input
                  id="submittingDesignate"
                  {...register("submittingDesignate", { required: true })}
                  className="bg-white border-blue-200 focus:border-blue-400 hover:border-blue-300 transition-colors"
                  required
                />
                {errors.submittingDesignate && (
                  <p className="text-red-500 text-sm mt-1">Submitting designate is required</p>
                )}
              </div>

              <div className="group">
                <Label htmlFor="designatePhone" className="text-blue-700 group-hover:text-blue-800 transition-colors">
                  *DESIGNATE PH#:
                </Label>
                <Input
                  id="designatePhone"
                  {...register("designatePhone", { required: true })}
                  className="bg-white border-blue-200 focus:border-blue-400 hover:border-blue-300 transition-colors"
                  required
                />
                {errors.designatePhone && <p className="text-red-500 text-sm mt-1">Designate phone is required</p>}
              </div>

              <div className="group">
                <Label htmlFor="designateEmail" className="text-blue-700 group-hover:text-blue-800 transition-colors">
                  *DESIGNATE EMAIL#:
                </Label>
                <Input
                  id="designateEmail"
                  {...register("designateEmail", {
                    required: true,
                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  })}
                  className="bg-white border-blue-200 focus:border-blue-400 hover:border-blue-300 transition-colors"
                  required
                />
                {errors.designateEmail?.type === "required" && (
                  <p className="text-red-500 text-sm mt-1">Designate email is required</p>
                )}
                {errors.designateEmail?.type === "pattern" && (
                  <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
                )}
              </div>

              <div className="group">
                <Label htmlFor="designateFax" className="text-blue-700 group-hover:text-blue-800 transition-colors">
                  DESIGNATE FAX#:
                </Label>
                <Input
                  id="designateFax"
                  {...register("designateFax")}
                  className="bg-white border-blue-200 focus:border-blue-400 hover:border-blue-300 transition-colors"
                />
              </div>

              <div className="group">
                <Label htmlFor="requestDate" className="text-blue-700 group-hover:text-blue-800 transition-colors">
                  *REQUEST DATE:
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-white border-blue-200 hover:border-blue-400 transition-colors",
                        !requestDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                      {requestDate ? format(requestDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={requestDate}
                      onSelect={(date) => {
                        setRequestDate(date)
                        setValue("requestDate", date as Date)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-md shadow-sm">
            <p className="font-bold text-center text-amber-800">
              NOTE: The assessment completed by the Criminal Risk Assessment Unit of the Department of Families Child
              Protection Branch does not replace a criminal records check.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.print()}
          className="border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          Print Form
        </Button>
        <Button
          type="button"
          onClick={exportToExcel}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Export to Excel
        </Button>
        <Button type="submit" className="bg-blue-700 hover:bg-blue-800 transition-colors">
          Submit Form
        </Button>
      </div>
      <Toaster />
    </form>
  )
}
