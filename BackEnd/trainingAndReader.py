import pandas as pd
import numpy as np
import re
from PyPDF2 import PdfReader
import os
import docx

# Functions to read different file types
def read_pdf(file_path):
    with open(file_path, "rb") as file:
        pdf_reader = PdfReader(file)
        text = ""
        for page_num in range(len(pdf_reader.pages)):
            text += pdf_reader.pages[page_num].extract_text()
    return text

def read_word(file_path):
    doc = docx.Document(file_path)
    text = ""
    for paragraph in doc.paragraphs:
        text += paragraph.text + "\n"
    return text

def read_txt(file_path):
    with open(file_path, "r") as file:
        text = file.read()
    return text

def read_documents_from_directory(directory):
    combined_text = ""
    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        if filename.endswith(".pdf"):
            combined_text += read_pdf(file_path)
        elif filename.endswith(".docx"):
            combined_text += read_word(file_path)
        elif filename.endswith(".txt"):
            combined_text += read_txt(file_path)
    return combined_text


# Read documents from the directory
#train_directory = '/content/drive/MyDrive/ColabNotebooks/data/chatbot_docs/training_data/full_text'
train_directory = '/Data'
text_data = read_documents_from_directory(train_directory)
text_data = re.sub(r'\n+', '\n', text_data).strip()  # Remove excess newline characters