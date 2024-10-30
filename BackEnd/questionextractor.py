import pdfplumber
import re
import json
import os

def extract_questions(file_path):
    # Extract module name from filename (e.g., "Module1ALL.pdf" becomes "Module 1")
    filename = os.path.basename(file_path)
    module_label = re.search(r"(Module\d+)", filename)
    module_name = module_label.group(1) if module_label else "Unknown Module"

    # Open and read the PDF
    with pdfplumber.open(file_path) as pdf:
        content = ""
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                content += page_text + "\n"  # Separate pages for readability

    # Regular expressions to match questions and choices
    question_pattern = re.compile(r"(\d+\.\s)(.*?)(?=(?:\d+\.\s|$))", re.DOTALL)
    choice_pattern = re.compile(r"([A-E]\.\s.*?)(?=\s[A-E]\.|$)", re.DOTALL)

    questions = []
    for match in question_pattern.finditer(content):
        question_text = match.group(2).strip()
        choices = choice_pattern.findall(question_text)

        parsed_choices = []
        for choice in choices:
            is_correct = "*" in choice
            choice_text = choice.replace("*", "").strip()  # Remove marker for correct answer
            parsed_choices.append({"choice_text": choice_text, "is_correct": is_correct})

        questions.append({
            "module": module_name,
            "question_text": question_text,
            "choices": parsed_choices
        })

    # Save extracted questions to JSON
    with open("questions.json", "w") as f:
        json.dump(questions, f, indent=4)
    print(f"Questions from {module_name} saved to questions.json")

# Run the function on your PDFs
extract_questions("AI-Powered-Math-Quiz/BackEnd/questionpdfs/Module1ALL.pdf")

