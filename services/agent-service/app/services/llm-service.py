from google import genai
from ..core.agent_config import AgentSettings


class LLMService:
    def __init__(self, settings: AgentSettings):
        self.client = genai.Client(api_key=settings.gemini_api_key)
        self.model = "gemini-2.5-flash"

    def generate_content(self, prompt: str):
        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt
        )
        return response.text

