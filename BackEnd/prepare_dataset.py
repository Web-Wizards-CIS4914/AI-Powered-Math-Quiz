import json

def prepare_data_for_gpt2(json_file, output_file):
    with open(json_file, "r") as file:
        quizzes = json.load(file)

    with open(output_file, "w") as out_file:
        for quiz in quizzes:
            prompt = quiz['prompt'].strip()
            completion = quiz['completion'].strip()
            out_file.write(f"{prompt}\n{completion}\n\n")

prepare_data_for_gpt2("MAC1105Quizzies.json", "gpt2_train.txt")