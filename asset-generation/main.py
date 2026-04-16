import json
import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file")

client = genai.Client(api_key=API_KEY)

PROMPT = """Generate a JSON array of exactly 50 dog profiles for a pet adoption app called PawsMatch.
Each profile must have:
- "id": integer from 1 to 50
- "name": a creative dog name (string)
- "bio": a 3-line adoption-focused bio written in Spanish, using \\n as line separator

Return ONLY valid JSON, no markdown, no explanation, just the raw JSON array.

Example format:
[
  {
    "id": 1,
    "name": "Max",
    "bio": "Soy un perro juguetón de 2 años que ama correr en el parque.\\nMe llevo bien con niños y otros perros.\\n¡Estoy listo para encontrar mi hogar para siempre!"
  }
]"""


def generate_pets():
    print("Generating 50 dog profiles with Gemini...")
    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=PROMPT,
    )

    raw = response.text.strip()
    # Strip markdown code fences if present
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    pets = json.loads(raw)

    if len(pets) != 50:
        print(f"Warning: expected 50 profiles, got {len(pets)}")

    output_path = os.path.join(os.path.dirname(__file__), "pets.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(pets, f, ensure_ascii=False, indent=2)

    print(f"✓ pets.json generated with {len(pets)} profiles at {output_path}")
    return pets


if __name__ == "__main__":
    generate_pets()
