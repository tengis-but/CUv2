const API_BASE_URL = '/api';

export async function askQuestion(question: string) {
  console.log("Sending question to /ask:", question);
  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ question }),
    credentials: 'include',
  });
  console.log("Ask response status:", response.status);
  const responseText = await response.text();
  console.log("Ask response text:", responseText);
  if (!response.ok) {
    try {
      const errorData = JSON.parse(responseText);
      throw new Error(errorData.error || 'Failed to ask question');
    } catch (parseError) {
      throw new Error(responseText || 'Failed to ask question');
    }
  }
  try {
    return JSON.parse(responseText);
  } catch (parseError) {
    throw new Error('Invalid JSON response from /ask');
  }
}

export async function login(gmail: string, password: string) {
  console.log("Sending login request with", { gmail, password });
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ gmail, password }),
    credentials: 'include',
  });

  const responseText = await response.text(); // Read once
  console.log("Raw response status:", response.status);
  console.log("Raw response text:", responseText);

  if (!response.ok) {
    try {
      const errorData = JSON.parse(responseText); // Parse manually
      throw new Error(errorData.error || 'Login failed');
    } catch (parseError) {
      throw new Error(responseText || 'Login failed due to an unexpected response');
    }
  }

  try {
    return JSON.parse(responseText); // Parse manually for success case
  } catch (parseError) {
    throw new Error('Invalid JSON response from server');
  }
}
export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_BASE_URL}/upload_file`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'File upload failed');
  }
  return response.json();
}

export async function checkProgress(sessionId: string) {
  const response = await fetch(`${API_BASE_URL}/progress/${sessionId}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to check progress');
  }
  return response.json();
}

export async function fetchChatHistory() {
  const response = await fetch(`${API_BASE_URL}/fetch_chat_history`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch chat history');
  }
  return response.json();
}

