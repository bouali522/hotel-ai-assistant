from typing import Annotated

from typing_extensions import TypedDict
import os
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain.chat_models import init_chat_model

from IPython.display import Image, display
from langchain_huggingface import HuggingFacePipeline

class State(TypedDict):
    messages: Annotated[list, add_messages]


graph_builder = StateGraph(State)

os.environ["AZURE_OPENAI_API_KEY"] = "18c998289801424ebd09ca57508119ac"
os.environ["AZURE_OPENAI_ENDPOINT"] = "https://learningassistant.openai.azure.com/"
os.environ["OPENAI_API_VERSION"] = "2024-02-15-preview"  # Use a known stable version

llm = init_chat_model(
    "azure_openai:gpt-4",
    azure_deployment="gpt-4"
)
""" 
llm = HuggingFacePipeline.from_model_id(
    model_id="google/flan-t5-small",
    task="text2text-generation",
    pipeline_kwargs={"max_new_tokens": 5}
) """

def chatbot(state: State):
    return {"messages": [llm.invoke(state["messages"])]}


graph_builder.add_node("chatbot", chatbot)
graph_builder.add_edge(START, "chatbot")
graph_builder.add_edge("chatbot", END)
graph = graph_builder.compile()


try:
    display(Image(graph.get_graph().draw_mermaid_png()))
except Exception:
    pass


def stream_graph_updates(user_input: str):
    for event in graph.stream({"messages": [{"role": "user", "content": user_input}]}):
        for value in event.values():
            print("Assistant:", value["messages"][-1].content)


while True:
    try:
        user_input = input("User: ")
        if user_input.lower() in ["quit", "exit", "q"]:
            print("Goodbye!")
            break
        stream_graph_updates(user_input)
    except:
        user_input = "What do you know about LangGraph?"
        print("User: " + user_input)
        stream_graph_updates(user_input)
        break