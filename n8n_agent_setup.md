# n8n AI Agent Setup Guide

This guide explains how to configure your n8n workflow to process chat messages with an AI Agent and update the Supabase dashboard in real-time.

## Prerequisites

-   **Supabase URL**: `https://asksguycdiygwqkzjenn.supabase.co`
-   **Supabase Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFza3NndXljZGl5Z3dxa3pqZW5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzODYxNjcsImV4cCI6MjA3OTk2MjE2N30.iNOoS-wChmigQmojOEd7y3OE1TApWzQ96LYT1H1tJMU`

## Workflow Overview

1.  **Webhook**: Receives `message` and `phoneNumber` from the React App.
2.  **AI Agent**: Processes the message to extract information (Name, Age, Complaint) and determine Priority.
3.  **HTTP Request (Tool)**: Updates the `triages` table in Supabase.

## Step-by-Step Configuration

### 1. Webhook Node
-   **Method**: `POST`
-   **Path**: `/webhook/triagem` (Ensure this matches `src/services/api.js`)
-   **Authentication**: None (or as configured)

### 2. AI Agent Node
-   **Model**: Use a chat model (e.g., OpenAI Chat Model).
-   **System Prompt**:
    ```text
    You are a medical triage assistant. Your goal is to interview the patient to gather the following information:
    1. Full Name
    2. Age
    3. Main Complaint (Symptoms)
    
    Based on the complaint, you must assess the priority:
    - low (minor issues)
    - normal (standard consultation)
    - high (severe pain, high fever)
    - urgent (life threatening)
    
    When you have gathered new information, use the 'update_triage' tool to update the patient's record.
    Be empathetic and professional.
    ```

### 3. Tool: HTTP Request (update_triage)
Configure this as a **Tool** connected to the AI Agent.

-   **Name**: `update_triage`
-   **Description**: `Call this tool to update the patient's information in the database.`
-   **Method**: `PATCH`
-   **URL**: 
    ```
    https://asksguycdiygwqkzjenn.supabase.co/rest/v1/triages?patient_phone=eq.{{$fromAI("phoneNumber")}}
    ```
    *(Note: You need to pass the phoneNumber from the webhook to the AI context so it can be used here, or map it directly if possible in your n8n version)*

-   **Headers**:
    -   `apikey`: `[PASTE_SUPABASE_KEY_HERE]`
    -   `Authorization`: `Bearer [PASTE_SUPABASE_KEY_HERE]`
    -   `Content-Type`: `application/json`
    -   `Prefer`: `return=minimal`

-   **Body Parameters** (JSON):
    ```json
    {
      "patient_name": "{{$fromAI("patient_name")}}",
      "patient_age": {{$fromAI("patient_age")}},
      "complaint": "{{$fromAI("complaint")}}",
      "priority": "{{$fromAI("priority")}}",
      "status": "in_progress"
    }
    ```

### Important Note on "phoneNumber"
The AI Agent needs to know *which* row to update. 
1.  Ensure the `phoneNumber` from the Webhook is passed into the AI Agent's context.
2.  Or, use a **Merge** node before the HTTP Request if you are not using it as a Tool, but the "Tool" approach is best for "Agentic" behavior.
3.  **Simpler Approach (Non-Agentic)**:
    -   Webhook -> AI Chain (Extract Info) -> JSON Output -> HTTP Request (Update Supabase).
    -   In this case, simply map the fields from the JSON Output to the HTTP Request Body.

## Testing
1.  Start the n8n workflow.
2.  Send a message from the App: "Meu nome é Carlos, tenho 30 anos e estou com dor no peito."
3.  Check the Supabase Dashboard. The row for that phone number should update with "Carlos", "30", "Dor no peito", and Priority "High/Urgent".
