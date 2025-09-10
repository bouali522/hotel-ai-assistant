from typing import Annotated, List,TypedDict
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain.chat_models import init_chat_model


class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_history: List[ChatMessage] = []

class ChatResponse(BaseModel):
    response: str
    status: str = "success"

class State(TypedDict):
    messages: Annotated[list, add_messages]


app = FastAPI(title="Chatbot API", description="LangGraph-powered chatbot API", version="1.0.0")

# allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],  # React available dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


os.environ["AZURE_OPENAI_API_KEY"] = os.environ.get("AZURE_OPENAI_API_KEY")
os.environ["AZURE_OPENAI_ENDPOINT"] = "https://learningassistant.openai.azure.com/"
os.environ["OPENAI_API_VERSION"] = "2024-02-15-preview"

llm = init_chat_model(
    "azure_openai:gpt-4",
    azure_deployment="gpt-4"
)

graph_builder = StateGraph(State)
def chatbot(state: State):
    return {"messages": [llm.invoke(state["messages"])]}

graph_builder.add_node("chatbot", chatbot)
graph_builder.add_edge(START, "chatbot")
graph_builder.add_edge("chatbot", END)
graph = graph_builder.compile()


@app.get("/")
async def root():
    return {"message": "Chatbot API is running!", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "chatbot-api"}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        messages = []
        
        for msg in request.conversation_history:
            messages.append({"role": msg.role, "content": msg.content})
        
        messages.append({"role": "user", "content": request.message})
        
        result = graph.invoke({"messages": messages})
        
        assistant_message = result["messages"][-1]
        response_content = assistant_message.content
        
        return ChatResponse(
            response=response_content,
            status="success"
        )
        
    except Exception as e:
        print(f"Error processing chat request: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing your message: {str(e)}"
        )

@app.post("/chat/stream")
async def chat_stream_endpoint(request: ChatRequest):
    """
    Streaming endpoint for real-time responses (future enhancement)
    """
    try:
        messages = []
        for msg in request.conversation_history:
            messages.append({"role": msg.role, "content": msg.content})
        
        messages.append({"role": "user", "content": request.message})
        result = graph.invoke({"messages": messages})
        assistant_message = result["messages"][-1]
        
        return ChatResponse(
            response=assistant_message.content,
            status="success"
        )
        
    except Exception as e:
        print(f"Error processing streaming chat request: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing your message: {str(e)}"
        )

if __name__ == "__main__":
    print("Starting Chatbot API server...")
    print("API Documentation available at: http://localhost:8000/docs")
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )