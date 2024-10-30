import torch
from transformers import GPT2Tokenizer, GPT2LMHeadModel, Trainer, TrainingArguments, DataCollatorForLanguageModeling
from datasets import load_from_disk

# Load the prepared dataset
dataset = load_from_disk("gpt2_algebra_dataset")

# Load GPT-2 model and tokenizer
model_name = "gpt2"
tokenizer = GPT2Tokenizer.from_pretrained(model_name)
model = GPT2LMHeadModel.from_pretrained(model_name)

# Add a padding token if it doesn't exist
if tokenizer.pad_token is None:
    tokenizer.add_special_tokens({'pad_token': '[PAD]'})
    model.resize_token_embeddings(len(tokenizer))  # Adjust model size to account for new token

# Tokenize the dataset
def tokenize_function(examples):
    return tokenizer(examples["text"], truncation=True, padding="max_length", max_length=128)

tokenized_dataset = dataset.map(tokenize_function, batched=True)

# Prepare data collator
data_collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)

# Set training arguments
training_args = TrainingArguments(
    output_dir="./gpt2-algebra-tutor",
    overwrite_output_dir=True,
    num_train_epochs=2,  # Experiment with fewer epochs
    per_device_train_batch_size=1,
    save_steps=500,
    save_total_limit=1,
    learning_rate=1e-5,  # Reduce learning rate to avoid overfitting
    logging_dir="./logs",
    logging_steps=10
)

# Initialize Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    data_collator=data_collator,
    train_dataset=tokenized_dataset,
)

# Start fine-tuning
trainer.train()

# Save the model and tokenizer
trainer.save_model("./gpt2-algebra-tutor")
tokenizer.save_pretrained("./gpt2-algebra-tutor")
print("Model fine-tuning complete and saved.")
