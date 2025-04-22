import OpenAI from "openai";

const OPENAI_MODEL = "gpt-4o";
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Allow client-side usage (in production, you should use a backend proxy)
});

// Function to generate email content
export async function generateEmailContent(
  subject: string,
  context: string = "",
  tone: string = "professional"
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: `You are an intelligent email assistant that helps users write clear, concise emails. 
            Generate an email with a ${tone} tone. The email should be appropriately formatted with greeting, 
            body, and sign-off. Keep the email concise and to the point.`
        },
        {
          role: "user",
          content: `Write an email with the subject: "${subject}". ${
            context ? `Context: ${context}` : ""
          }`
        }
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content || "Sorry, I couldn't generate content for this email.";
  } catch (error) {
    console.error("Error generating email content:", error);
    throw new Error("Failed to generate email content. Please try again.");
  }
}

// Function to generate reply suggestions
export async function generateReplySuggestions(
  emailBody: string,
  senderName: string = ""
): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: `You are an intelligent email assistant. Generate 3 concise reply suggestions for the email below.
            Each suggestion should be different in tone (professional, friendly, brief) and no longer than 1 sentence each.
            Return only the 3 suggestions as separate sentences.`
        },
        {
          role: "user",
          content: `The email is from ${senderName || "someone"} and contains: "${emailBody}"`
        }
      ],
      max_tokens: 250,
      response_format: { type: "json_object" },
    });

    let suggestions: string[] = [];
    
    try {
      const content = response.choices[0].message.content;
      if (content) {
        const parsedContent = JSON.parse(content);
        suggestions = [
          parsedContent.professional || parsedContent.suggestion1,
          parsedContent.friendly || parsedContent.suggestion2,
          parsedContent.brief || parsedContent.suggestion3,
        ].filter(Boolean);
      }
    } catch (e) {
      // If parsing fails, try to split by newlines
      const content = response.choices[0].message.content || "";
      suggestions = content
        .split(/\r?\n/)
        .filter((line) => line.trim().length > 0)
        .slice(0, 3);
    }

    // Ensure we have at least one suggestion
    if (suggestions.length === 0) {
      suggestions = ["Thanks for your email. I'll get back to you soon."];
    }

    return suggestions;
  } catch (error) {
    console.error("Error generating reply suggestions:", error);
    return ["Thanks for your email. I'll get back to you soon."];
  }
}

// Function to complete email text as the user types
export async function completeEmailText(
  currentText: string,
  subject: string = ""
): Promise<string> {
  if (!currentText.trim()) return "";

  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: `You are an intelligent email writing assistant. Complete the user's email text 
            in a natural way, maintaining their style and tone. Only provide the completion text, 
            not the full email.`
        },
        {
          role: "user",
          content: `Subject: ${subject}\n\nEmail text so far: "${currentText}"\n\nComplete this text naturally:`
        }
      ],
      max_tokens: 150,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error completing email text:", error);
    return "";
  }
}

// Function to summarize long email threads
export async function summarizeEmailThread(
  emailThread: string
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: `You are an email assistant that summarizes email threads concisely. 
            Create a brief summary (3-5 bullet points) of the key points discussed in the thread.`
        },
        {
          role: "user",
          content: `Summarize this email thread:\n\n${emailThread}`
        }
      ],
      max_tokens: 300,
    });

    return response.choices[0].message.content || "Unable to summarize thread.";
  } catch (error) {
    console.error("Error summarizing email thread:", error);
    throw new Error("Failed to summarize email thread. Please try again.");
  }
}

// Function to analyze sentiment of an email
export async function analyzeEmailSentiment(
  emailBody: string
): Promise<{ sentiment: string; suggestions: string | null }> {
  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: `You are an email sentiment analyzer. Analyze the sentiment of the following email 
            and provide a simple assessment (positive, neutral, negative) and brief suggestions for response 
            if the sentiment is negative.`
        },
        {
          role: "user",
          content: `Analyze the sentiment of this email:\n\n${emailBody}`
        }
      ],
      max_tokens: 200,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return { sentiment: "neutral", suggestions: null };
    }

    try {
      const result = JSON.parse(content);
      return {
        sentiment: result.sentiment || "neutral",
        suggestions: result.suggestions || null,
      };
    } catch (e) {
      return { sentiment: "neutral", suggestions: null };
    }
  } catch (error) {
    console.error("Error analyzing email sentiment:", error);
    return { sentiment: "neutral", suggestions: null };
  }
}