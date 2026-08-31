from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_ENV: str = "development"

    DATABASE_URL: str = "postgresql+psycopg://postgres:admin@localhost:5432/sih26090"
    REDIS_URL: str = "redis://localhost:6379"

    STORAGE_ENDPOINT: str = ""
    STORAGE_BUCKET: str = ""
    STORAGE_ACCESS_KEY: str = ""
    STORAGE_SECRET_KEY: str = ""

    LLM_API_KEY: str = ""
    SPEECH_API_KEY: str = ""
    TRANSLATION_API_KEY: str = ""

    JWT_SECRET: str = "change-this-to-a-random-secret-in-production"

    model_config = {"env_file": ".env"}


settings = Settings()
