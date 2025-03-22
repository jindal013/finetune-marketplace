import json
import os
import torch
import transformers
import pyrebase  # pip install pyrebase4

from dataclasses import dataclass
from dotenv import load_dotenv
from peft import LoraConfig, PeftModel, get_peft_model
from transformers import AutoTokenizer, AutoModelForCausalLM
from trl import SFTTrainer
import random
import csv
import datasets as d

load_dotenv()


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
seed = 1234

@dataclass
class TrainingConfig:
  model_id: str
  test_size: float
  modules_limit: int
  r: int
  lora_alpha: int
  batch_size: int
  gradient_accumulation_steps: int
  optim: str
  warmup_steps: float
  max_steps: int
  eval_steps: int
  learning_rate: float
  logging_steps: int
  precision: str = "bfloat16"


def get_configs_from_firebase(path: str):
  local_path = "./config.json"
  storage.child(f"{path}/config.json").download(local_path, "config.json")

  with open(local_path, "r") as f:
    config_data = json.load(f)

  training_config = TrainingConfig(
    model_id=config_data.get("model_id", ""),
    test_size=config_data.get("test_size", 0.1),
    modules_limit=config_data.get("modules_limit", 0),
    r=config_data.get("r", 16),
    lora_alpha=config_data.get("lora_alpha", 32),
    batch_size=config_data.get("batch_size", 8),
    gradient_accumulation_steps=config_data.get("gradient_accumulation_steps", 1),
    optim=config_data.get("optim", "adamw_torch"),
    warmup_steps=config_data.get("warmup_steps", 0.03),
    max_steps=config_data.get("max_steps", 100),
    eval_steps=config_data.get("eval_steps", 50),
    learning_rate=config_data.get("learning_rate", 2e-4),
    logging_steps=config_data.get("logging_steps", 10),
    precision=config_data.get("precision", "bfloat16")
  )

  return training_config

def get_data_from_firebase(path: str):

  local_path = "./data.txt"
  storage.child(f"{path}/data.txt").download(local_path, "data.txt")

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

  return path

class ModelTrainer:

  def __init__(self, firebase_link: str):

    self.firebase_path = firebase_link
    self.data_path = get_data_from_firebase(firebase_link)
    self.cfg = get_configs_from_firebase(firebase_link)
    print(self.cfg)
    self.device = self._setup_device()

  def _setup_device(self):
    if torch.cuda.is_available():
        return 'cuda'
    if torch.backends.mps.is_available():
        return "mps"
    return 'cpu'

  def _find_all_linear_names(self):
    lora_module_names = set()
    for name, module in self.model.named_modules():
        if isinstance(module, torch.nn.Linear):
            names = name.split(".")
            lora_module_names.add(names[0] if len(names) == 1 else names[-1])
    return list(lora_module_names)

  def _setup_model(self):

    self.tokenizer = AutoTokenizer.from_pretrained(
        self.cfg.model_id, add_eos_token=True, padding_side="right"
    )

    if self.cfg.precision == "bfloat16":
      dp = torch.bfloat16
    elif self.cfg.precision == "float32":
      dp = torch.float32
    elif self.cfg.precision == "float16":
      dp = torch.float16
    else:
      raise ValueError("Invalid precision value.")

    self.model = AutoModelForCausalLM.from_pretrained(
      self.cfg.model_id,torch_dtype=dp , device_map=self.device
    )

    self.model.gradient_checkpointing_enable()
    self.lora_config = self._setup_finetune_params()

    print("\n")
    print(f"Model {self.cfg.model_id} loaded successfully on {self.device} @ {dp} precision.")
    trainable, total = self.model.get_nb_trainable_parameters()
    print(
        f"Trainable: {trainable} | total: {total} | Percentage: {trainable / total * 100:.4f}%"
    )
    print("\n")

  def _setup_finetune_params(self):
    modules = self._find_all_linear_names()
    target_modules = (
      modules
      if len(modules) < self.cfg.modules_limit
      else modules[: self.cfg.modules_limit]
    )

    lora_config = LoraConfig(
      r=self.cfg.r,
      lora_alpha=self.cfg.lora_alpha,
      target_modules=target_modules,
      lora_dropout=0.05,
      bias="none",
      task_type="CAUSAL_LM",
    )

    self.model = get_peft_model(self.model, lora_config)

    return lora_config

  def generate_prompt(self, data_point):
    message =  [{
            "role": "user",
            "content": f"""{data_point["instruction"]} {data_point["input"]}"""
            },
        {
            "role": "assistant",
            "content": data_point["output"]
            }
            ]

    prompt = self.tokenizer.apply_chat_template(message, tokenize=False)
    tokenized_prompt = self.tokenizer(prompt, return_tensors="pt")

    text = {
        'prompt': prompt,
        **tokenized_prompt
    }

    return text

  def _setup_dataset(self):

    self.tokenizer.padding_side = 'right'
    ds = d.load_dataset("csv", data_files=self.data_path)["train"]
    ds = ds.map(lambda samples: self.generate_prompt(samples), batched=False)
    ds = ds.shuffle(seed=seed)
    ds = ds.train_test_split(test_size=self.cfg.test_size)
    ds['test'] = ds['test'].shuffle(seed=seed).select(range(10))

    return ds['train'], ds['test']

  def train(self):
    self._setup_model()

    lora_config = self.lora_config
    train_data, test_data = self._setup_dataset()

    trainer = SFTTrainer(
      model=self.model,
      train_dataset=train_data,
      eval_dataset=test_data,
      peft_config=lora_config,
      dataset_text_field='prompt',
      args=transformers.TrainingArguments(
          per_device_train_batch_size=self.cfg.batch_size,
          gradient_accumulation_steps=self.cfg.gradient_accumulation_steps,
          warmup_steps=self.cfg.warmup_steps,
          max_steps=self.cfg.max_steps,
          learning_rate=self.cfg.learning_rate,
          logging_steps=self.cfg.logging_steps,
          evaluation_strategy="steps",
          eval_steps=self.cfg.eval_steps,
          per_device_eval_batch_size=self.cfg.batch_size,
          output_dir="job/checkpoints",
          optim=self.cfg.optim,
          logging_dir="job/logs",
          report_to=["tensorboard"],
          save_strategy="steps",
          save_steps=10,
          save_total_limit=5,
      ),
    )

    trainer.train()

    self.save_models(trainer)

  def save_models(self, trainer):
    new_model_path = "job/finetuned_models/"
    trainer.model.save_pretrained(new_model_path)

    merged_path = "job/merged_models/"
    merged_model = PeftModel.from_pretrained(self.model, new_model_path)
    merged_model = merged_model.merge_and_unload()
    merged_model.save_pretrained(merged_path)
    self.tokenizer.save_pretrained(merged_path)

    print("uploading to firebase ...")
    self.upload_to_firebase("./job")

  def upload_to_firebase(self, base_dir):
    directories = [base_dir]
    files = []

    while len(directories) > 0:
      current_dir = directories.pop()
      for file in os.listdir(current_dir):
        if os.path.isdir(f"{current_dir}/{file}"):
          directories.append(f"{current_dir}/{file}")
        else:
          files.append(f"{current_dir}/{file}")

    for file in files:

      file_firebase = file
      if file.startswith("./"):
        file_firebase = file[2:]

      print(f"Uploading {file} to {file_firebase}")
      storage.child(f"{self.firebase_path}/{file_firebase}").put(file)

if __name__ == '__main__':
    print(torch.__version__)
    model = ModelTrainer("test")
    model.train()
