# FactoidWiki
Dense X Retrieval: What Retrieval Granularity Should We Use?

## Building Proposition-level Index and Retrieval for Wikipedia

|             | #unit | Link                                                      |
|-------------|-------|-----------------------------------------------------------|
| Proposition | 257M  | [factoid-wiki](https://huggingface.co/datasets/chentong00/factoid-wiki)                   |
| Sentence    | 114M  | [factoid-wiki-sentence](https://huggingface.co/datasets/chentong00/factoid-wiki-sentence) |
| Passage     | 41M   | [factoid-wiki-passage](https://huggingface.co/datasets/chentong00/factoid-wiki-passage)   |

## Segmenting your Documents into Propositions

Example:
```python
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
import json

model_name = "chentong00/propositionizer-wiki-flan-t5-large"
device = "cuda" if torch.cuda.is_available() else "cpu"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name).to(device)

title = "Leaning Tower of Pisa"
section = ""
content = "Prior to restoration work performed between 1990 and 2001, Leaning Tower of Pisa leaned at an angle of 5.5 degrees, but the tower now leans at about 3.99 degrees. This means the top of the tower is displaced horizontally 3.9 meters (12 ft 10 in) from the center."

input_text = f"Title: {title}. Section: {section}. Content: {content}"

input_ids = tokenizer(input_text, return_tensors="pt").input_ids
outputs = model.generate(input_ids.to(device), max_new_tokens=512).cpu()

output_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
try:
    prop_list = json.loads(output_text)
except:
    prop_list = []
    print("[ERROR] Failed to parse output text as JSON.")
print(json.dumps(prop_list, indent=2))
```

Output:
```json
[
  "Prior to restoration work performed between 1990 and 2001, Leaning Tower of Pisa leaned at an angle of 5.5 degrees.",
  "Leaning Tower of Pisa now leans at about 3.99 degrees.",
  "The top of Leaning Tower of Pisa is displaced horizontally 3.9 meters (12 ft 10 in) from the center."
]
```
