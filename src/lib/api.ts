const API_BASE_URL = "/api";

export async function login(gmail: string, password: string) {
  console.log("Sending login request to /login:", { gmail });
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ gmail, password }),
    credentials: "include",
  });
  console.log("Login response status:", response.status);
  const responseText = await response.text();
  console.log("Login response text:", responseText);
  if (!response.ok) {
    try {
      const errorData = JSON.parse(responseText);
      throw new Error(errorData.error || "Login failed");
    } catch (parseError) {
      throw new Error(responseText || "Login failed");
    }
  }
  try {
    return JSON.parse(responseText);
  } catch (parseError) {
    throw new Error("Invalid JSON response from /login");
  }
}

export async function login2(gmail: string, password: string) {
  console.log("Sending login request to /login2:", { gmail });
  const response = await fetch(`${API_BASE_URL}/login2`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ gmail, password }),
    credentials: "include",
  });
  console.log("Login2 response status:", response.status);
  const responseData = await response.json();
  console.log("Login2 response data:", responseData);

  if (!response.ok) {
    throw new Error(responseData.error || "Login failed");
  }

  return responseData; // Returns { success, message, user: { usersid, roleid } }
}

export async function askQuestion(question: string) {
  console.log("Sending question to /ask:", question);
  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ question }),
    credentials: "include",
  });
  console.log("Ask response status:", response.status);
  const responseText = await response.text();
  console.log("Ask response text:", responseText);
  if (!response.ok) {
    try {
      const errorData = JSON.parse(responseText);
      throw new Error(errorData.error || "Failed to ask question");
    } catch (parseError) {
      throw new Error(responseText || "Failed to ask question");
    }
  }
  try {
    return JSON.parse(responseText);
  } catch (parseError) {
    throw new Error("Invalid JSON response from /ask");
  }
}

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_BASE_URL}/upload_file`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "File upload failed");
  }
  return response.json();
}

export async function checkProgress(sessionId: string) {
  const response = await fetch(`${API_BASE_URL}/progress/${sessionId}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to check progress");
  }
  return response.json();
}

export async function fetchChatHistory() {
  const response = await fetch(`${API_BASE_URL}/fetch_chat_history`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch chat history");
  }
  return response.json();
}

export async function checkAuth() {
  try {
    const response = await fetch(`${API_BASE_URL}/check_auth`, {
      method: "GET",
      credentials: "include",
    });
    console.log("checkAuth response status:", response.status);
    if (!response.ok) {
      console.warn("checkAuth failed with status:", response.status, await response.text());
      return false;
    }
    const data = await response.json();
    console.log("checkAuth response data:", data);
    if (data.status === "authenticated") {
      localStorage.setItem("usersid", data.usersid);
      localStorage.setItem("roleid", data.roleid);
      return true;
    }
    return false;
  } catch (error) {
    console.error("checkAuth error:", error);
    return false;
  }
}