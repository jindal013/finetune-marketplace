import os
import dotenv
import pyrebase
import random
import datasets as d
import csv

firebaseConfig = {
  "apiKey": "AIzaSyBz0XRFZjisjl2m2kjefJwt5ydxUc5FabA",
  "authDomain": "finetunemarketplace-1323f.firebaseapp.com",
  "databaseURL": "https://finetunemarketplace-1323f-default-rtdb.firebaseio.com/",
  "projectId": "finetunemarketplace-1323f",
  "storageBucket": "finetunemarketplace-1323f.firebasestorage.app",
  "messagingSenderId": "163760710265",
  "appId": "1:163760710265:web:676a8e7c5116ad6661eaa8",
  "measurementId": "G-2HQ21J89S1",
}

storage = pyrebase.initialize_app(firebaseConfig).storage()

def get_data_from_firebase(path: str):

  local_path = "./data.txt"
  storage.child(f"{path}").download(local_path, "data.txt")

  with open(local_path, "r") as f:
    data = f.read()

  data_size = 200
  data = data.strip("\n\n") .replace("\n", " ").replace(" ", " ")
  data = [data[i:i+data_size] for i in range(0, len(data), data_size)]

  dataset = []
  setence_length = 6
  cutoff = 200
  length = len(data)
  for i in range(0, length, setence_length):
    sentence = data[i:i + setence_length]
    sentence = ' '.join(sentence)
    if len(sentence) < cutoff:
      continue

    index = random.randint(cutoff, len(sentence))
    input = sentence[:index]
    output = sentence[index:]
    instruction = """You are a chat completition model, please take time to think and complete the text below"""
    dataset.append({
      'instruction': instruction,
      'input': input,
      'output': output
    })

    path = "./dataset.csv"
    with open(
        path, mode="w", newline="", encoding="utf-8"
    ) as file:
      writer = csv.DictWriter(file, fieldnames=["instruction", "input", "output"])
      writer.writeheader()
      writer.writerows(dataset)

seed = 1234

if __name__ == '__main__':
  get_data_from_firebase("test")