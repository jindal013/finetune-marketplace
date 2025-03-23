import cohere
import json
import os
from dotenv import load_dotenv

load_dotenv()


def populate_fields(prompt: str):

    cohere_api_key = os.getenv("COHERE_API_KEY")
    co = cohere.ClientV2(cohere_api_key)

    default_values = """"modules_limit": {"type": "integer", "default": 8},
                    "r": {"type": "integer", "default": 16},
                    "lora_alpha": {"type": "integer", "default": 32},
                    "batch_size": {"type": "integer", "default": 4},
                    "optim": {"type": "string", "default": "adamw_torch"},
                    "warmup_steps": {"type": "integer", "default": 100},
                    "max_steps": {"type": "integer", "default": 1000},
                    "eval_steps": {"type": "integer", "default": 100},
                    "learning_rate": {"type": "number", "default": 0.0003},
                    "logging_steps": {"type": "integer", "default": 10"""

    response = co.chat(
        model="command-a-03-2025",
        messages=[
            {
                "role": "user",
                "content": f"Based on this text: '{prompt}', generate a JSON configuration for fine-tuning an AI model. If specific values are mentioned in the text, use those. Otherwise, use default values. Only include the configuration starting from modules_limit. USE THE DEFAULT VALUES IF IT IS NOT GIVEN IN THE PROMPT!!! these are the default values: {default_values}. return the default value if it is not given in the prompt. in the prompt, the values may not be given direclty, like r = something. you need to infer these, otherwise default. this is for finetuning an ai model, so it should not be something that is too unusual. for example, if it is asking to train a model for 7B to train a model for under 100M parameters, with a batch size of 10 under an hour: you INFER the values of r, modules_limit, etc. make it not realistic. the above was just an example, remember. also quick note - modules_limit is not the number of parameters, it is the number of modules in the model, so like for 1M its around 10, just for exmaple only.",
            }
        ],
        response_format={
            "type": "json_object",
            "schema": {
                "type": "object",
                "properties": {
                    "modules_limit": {"type": "integer", "default": 8},
                    "r": {"type": "integer", "default": 16},
                    "lora_alpha": {"type": "integer", "default": 32},
                    "batch_size": {"type": "integer", "default": 4},
                    "optim": {"type": "string", "default": "adamw_torch"},
                    "warmup_steps": {"type": "integer", "default": 100},
                    "max_steps": {"type": "integer", "default": 1000},
                    "eval_steps": {"type": "integer", "default": 100},
                    "learning_rate": {"type": "number", "default": 0.0003},
                    "logging_steps": {"type": "integer", "default": 10},
                },
                "required": [
                    "modules_limit",
                    "r",
                    "lora_alpha",
                    "batch_size",
                    "optim",
                    "warmup_steps",
                    "max_steps",
                    "eval_steps",
                    "learning_rate",
                    "logging_steps",
                ],
            },
        },
    )

    return json.loads(response.message.content[0].text)


if __name__ == "__main__":
    object = populate_fields("i am training a 7b mode, i only want 1 million tuned, i want it to be done in < 1 hour with a batch size of 10")
    print(object)
