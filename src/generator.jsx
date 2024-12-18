import { GoogleGenerativeAI } from '@google/generative-ai'; // Ensure this is correct
import CryptoJS from 'crypto-js';

console.log(process.env.VITE_YOUR_GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const encryptData = (data) => {
  console.log("%c🔒 Encrypting data...", "color:purple; font-weight:bold;");
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data),import.meta.env.VITE_ENCRYPTION_KEY).toString();
  console.log("%c🔐 Encrypted Data: ", "color:green; font-weight:bold;", ciphertext);
  return ciphertext;
};

const generatePassword = async (customWords) => {
  const taskTemplate = import.meta.env.VITE_TASK_TEMPLATE;
  const task = taskTemplate.replace('{{customWords}}', customWords.join(', '));

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });
    const result = await model.generateContent(task);
    const jsonResult = JSON.parse(result.response.text());

    if (jsonResult.password && Array.isArray(jsonResult.notes)) {
      return encryptData(jsonResult); // Encrypt before returning
    } else {
      throw new Error("Unexpected JSON format received.");
    }
  } catch (error) {
    console.error("%cError generating password:", "color:red; font-weight:bold;", error);
    throw error;
  }
};

const promptUserForWords = async (customWords) => {
  if (!Array.isArray(customWords) || customWords.length === 0) {
    throw new Error("Words array cannot be empty."); // Handle empty array
  }

  console.log(`%cWords Entered by User: ${customWords}`, "font-weight: bold; color:orangered;");
  console.log("%cInitializing the password generation process", "color:yellow; font-weight:bold;");
  return await generatePassword(customWords);
};

export default promptUserForWords;
