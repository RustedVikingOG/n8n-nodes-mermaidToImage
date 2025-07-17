# RAGFlow API Postman Collection

This Postman Collection contains endpoints for interacting with the [RAGFlow](https://ragflow.io) HTTP API.

## Collection Overview

The collection is organized into the following sections:

1. **OpenAI-Compatible API**
   - Create chat completion
   - Create agent completion

2. **Dataset Management**
   - Create dataset
   - Update dataset
   - List datasets
   - Delete datasets

3. **File Management Within Dataset**
   - Upload documents
   - Update document
   - Download document
   - List documents
   - Delete documents
   - Parse documents
   - Stop parsing documents

4. **Chunk Management Within Dataset**
   - Add chunk
   - List chunks
   - Delete chunks
   - Update chunk
   - Retrieve chunks

5. **Chat Assistant Management**
   - Create chat assistant
   - Update chat assistant
   - Delete chat assistants
   - List chat assistants

6. **Session Management**
   - Create session with chat assistant
   - Update chat assistant's session
   - List chat assistant's sessions
   - Delete chat assistant's sessions
   - Converse with chat assistant
   - Create session with agent
   - Converse with agent
   - List agent sessions
   - Delete agent's sessions
   - Generate related questions

7. **Agent Management**
   - List agents
   - Create agent
   - Update agent
   - Delete agent

## Setup

1. Import both the collection file (`RAGFlow API.postman_collection.json`) and the environment file (`ragflow.postman_environment.json`) into Postman.

2. Configure the environment variables:
   - `base_url`: The base URL for the RAGFlow API (default: http://localhost:8000)
   - `api_key`: Your RAGFlow API key
   - `login_token`: Your RAGFlow login token (required for specific endpoints like generating related questions)

3. Set up other variables as needed when working with specific resources:
   - `chat_id`
   - `session_id`
   - `dataset_id`
   - `document_id`
   - `chunk_id`
   - `agent_id`

## API Authentication

Most endpoints require authentication using an API key. The API key should be provided in the Authorization header as:

```
Authorization: Bearer <YOUR_API_KEY>
```

## Reference

For detailed documentation on the RAGFlow API, visit [https://ragflow.io/docs/dev/http_api_reference](https://ragflow.io/docs/dev/http_api_reference).
