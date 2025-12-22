"use server";

export async function explainCode(prevState, formData) {
  const code = formData.get("code");
  const language = formData.get("language");
  //console.log(`Generating explanation for ${language} code`);
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/explain-code`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      }
    );
    if (!response.ok) {
      return {
        success: false,
        message: "Failed to fetch data",
      };
    }
    const data = await response.json();
    return {
      success: true,
      message: "Code explained successfully",
      data,
      input: { code, language },
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to explain code: ${error?.message}`,
    };
  }
}

export async function listDocuments(session_id) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/list-documents`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id }),
      }
    );
    if (!response.ok) {
      return {
        success: false,
        message: "Failed to fetch data",
      };
    }
    const data = await response.json();
    return {
      success: true,
      message: "Documents listed successfully",
      data,
      input: { session_id },
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to list documents: ${error?.message}`,
    };
  }
}
