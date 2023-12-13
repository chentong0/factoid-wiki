# FactoidWiki
Official repo for the paper -- [Dense X Retrieval: What Retrieval Granularity Should We Use?](https://arxiv.org/abs/2312.06648)

## Proposition-level Wikipedia Index for Retrieval
FactoidWiki features an English Wikipedia dump indexed at the level of propositions for retrieval tasks.

The dataset is hosted on [huggingface](https://huggingface.co/datasets/chentong00/factoid-wiki). The format of the dataset is compatible with the [`pyserini`](https://github.com/castorini/pyserini) library, so that you can use `pyserini` to encode the text into a [`Faiss`](https://github.com/facebookresearch/faiss) VectorDB with any dense retriever of your choice.

FactoidWiki uses an English Wikipedia dump from 2021-10-13, as used in the [Attributed QA](https://arxiv.org/abs/2212.08037) paper. We also release the same Wikipedia dump indexed by sentence or passage for comparsion.   

|             | #unit | Link                                                      |
|-------------|-------|-----------------------------------------------------|
| Proposition | 257M  | [factoid-wiki](https://huggingface.co/datasets/chentong00/factoid-wiki)                   |
| Sentence    | 114M  | [factoid-wiki-sentence](https://huggingface.co/datasets/chentong00/factoid-wiki-sentence) |
| Passage     | 41M   | [factoid-wiki-passage](https://huggingface.co/datasets/chentong00/factoid-wiki-passage)   |

## Segmenting your Documents into Propositions
The finetuned `FlanT5` model for segmenting passages into propositions can be found in huggingface model hub via [`chentong00/propositionizer-wiki-flan-t5-large`](https://huggingface.co/chentong00/propositionizer-wiki-flan-t5-large).


Example usage:
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

# Citation
```
@article{chen2023densex,
  title={Dense X Retrieval: What Retrieval Granularity Should We Use?},
  author={Tong Chen and Hongwei Wang and Sihao Chen and Wenhao Yu and Kaixin Ma and Xinran Zhao and Hongming Zhang and Dong Yu},
  journal={arXiv preprint arXiv:2312.06648},
  year={2023},
  URL = {https://arxiv.org/pdf/2312.06648.pdf}
}
```
