from datasets import Dataset
import os

def load_and_prepare_dataset(file_path):
    file_path = os.path.join(os.path.dirname(__file__), file_path)
    with open(file_path, 'r') as f:
        lines = f.readlines()

    # Combine lines as prompt-completion pairs
    data = []
    for i in range(0, len(lines), 2):  # Assuming prompts and completions are in pairs
        prompt = lines[i].strip()
        completion = lines[i + 1].strip()
        data.append({"text": f"<|startoftext|>{prompt} {completion}<|endoftext|>"})
    
    # Convert to Hugging Face dataset format
    dataset = Dataset.from_dict({"text": [entry["text"] for entry in data]})
    return dataset

# Load the dataset
dataset = load_and_prepare_dataset("gpt2_train.txt")
dataset.save_to_disk("gpt2_algebra_dataset")
print("Dataset prepared and saved to disk.")
