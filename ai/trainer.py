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

load_dotenv()


firebaseConfig ={
  "apiKey": "AIzaSyBz0XRFZjisjl2m2kjefJwt5ydxUc5FabA",
  "authDomain": "finetunemarketplace-1323f.firebaseapp.com",
  "databaseURL": "https://finetunemarketplace-1323f-default-rtdb.firebaseio.com/",
  "projectId": "finetunemarketplace-1323f",
  "storageBucket": "finetunemarketplace-1323f.firebasestorage.app",
  "messagingSenderId": "163760710265",
  "appId": "1:163760710265:web:676a8e7c5116ad6661eaa8",
  "measurementId": "G-2HQ21J89S1",
  # "serviceAccount": "serviceAccount.json"
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
  storage.child(f"{path}/config.json").download(local_path)

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
  storage.child(f"{path}/data.txt").download(local_path)

  with open(local_path, "r") as f:
    data = f.readlines()

  return data

class ModelTrainer:

  def __init__(self, firebase_link: str):

    self.firebase_path = firebase_link
    self.txt = get_data_from_firebase(firebase_link)
    self.cfg = get_configs_from_firebase(firebase_link)
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
    self._setup_finetune_params()

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

    self.lora_config = LoraConfig
    self.model = get_peft_model(self.model, lora_config)

  def _setup_dataset(self):

    # Parse the text data into structured format
    dataset = []
    for line in self.txt:
      try:
        data_point = json.loads(line.strip())
        dataset.append(data_point)
      except json.JSONDecodeError:
        continue  # Skip invalid lines

    # Split dataset
    train_data, test_data = train_test_split(
      dataset,
      test_size=self.cfg.test_size,
      random_state=seed
    )

    # If test set is too large, limit it
    if len(test_data) > 10:
      test_data = test_data[:10]

    # Convert to datasets format
    def format_as_prompt(examples):
      if isinstance(examples, dict):  # Single example case
        data_point = examples
        message = [
          {
            "role": "user",
            "content": f"{data_point.get('instruction', '')} {data_point.get('input', '')}"
          },
          {
            "role": "assistant",
            "content": data_point.get('output', '')
          }
        ]
        prompt = self.tokenizer.apply_chat_template(message, tokenize=False)
        return {"prompt": prompt}
      else:  # Batch processing case
        return {"prompt": [format_as_prompt(ex)["prompt"] for ex in examples]}

    # Convert to dataset objects
    train_dataset = datasets.Dataset.from_list(train_data)
    test_dataset = datasets.Dataset.from_list(test_data)

    # Apply formatting
    train_dataset = train_dataset.map(format_as_prompt)
    test_dataset = test_dataset.map(format_as_prompt)

    return train_dataset, test_dataset

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

    self.save_models(trainer)

  def save_models(self, trainer):
    new_model_path = "job/finetuned_models/"
    trainer.model.save_pretrained(new_model_path)
    self.upload_to_firestore(new_model_path)

    merged_path = "job/merged_models/"
    merged_model = PeftModel.from_pretrained(self.model, new_model_path)
    merged_model = merged_model.merge_and_unload()
    merged_model.save_pretrained(merged_path)
    self.tokenizer.save_pretrained(merged_path)

    self.upload_to_fireabse(merged_path)

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
      storage.child(f"{self.firebase_path}/{file}").put(file)

if __name__ == '__main__':
    print(torch.__version__)
    storage.child("test3/test3.txt").put("./req.txt")
    url = storage.child("test3/test3.txt").get_url("hello2")
    print(url)
