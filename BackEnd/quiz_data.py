import json

def load_quiz_data():
    with open("MAC1105Quizzies.json", "r") as file:
        return json.load(file)

quiz_data = load_quiz_data()
