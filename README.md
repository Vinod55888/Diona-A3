# Diona-A3
Breif Explaination & prompt 
“I used Cursor AI — an AI-powered code editor that leverages large language models with strong reasoning capabilities — to parse the PDF and its annotations. I provided it with detailed prompts, like:

‘Generate a React-based web form from this PDF. Include prefilled data, conditional logic, and export features.’

Cursor AI was chosen because of its structured code generation, ability to interpret embedded logic, and context awareness — making it ideal for building dynamic forms, handling conditionals, and generating code like XLSForms and Pug templates.”

Web App Demo

“This is the final web app I deployed [point to your site or local version, e.g., https://3x6qwr-3000.csb.app].
	•	✅ The form captures all required fields from the PDF
	•	✅ Conditional sections like witness information appear only when consent is given
	•	✅ There’s a Print button to generate hard copies instantly
	•	✅ And a built-in XLSX export function that converts all form data into a spreadsheet format — ideal for data processing and case tracking

I used React for the frontend, along with file-saver and xlsx libraries to enable export functionality.”
ODK XLSForm Generation

“To support mobile data collection, I also used Cursor AI to generate an ODK-compatible XLSForm version of the PDF. This allows the same form to be used in apps like KoboToolbox or ODK Collect, which is critical for fieldwork or offline access.

The logic, constraints, and pulldata integration were created using AI-generated suggestions, then exported as a usable Excel form.”

“For the templating side, I once again used Cursor AI to generate a dynamic Pug template. This demonstrates how AI can turn unstructured documents like PDFs into reusable and scalable frontend components.

The prompt history included instructions for:
	•	Dynamic field generation
	•	Pre-filling variables like client.firstName
	•	Conditional rendering based on consent and ID selection”

By combining React, XLSForm, and AI tooling, I was able to produce a complete, scalable, and efficient digital form solution — ready for real-world use in social services.”
