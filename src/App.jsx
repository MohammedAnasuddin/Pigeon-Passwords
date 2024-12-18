import React, { useState, useEffect } from 'react';
import promptUserForWords from './generator';
import CryptoJS from 'crypto-js'; // Import for decryption
import './index.css';

const App = () => {
  const [input, setInput] = useState('');
  const [tags, setTags] = useState([]);
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Clear console until tags are added
  useEffect(() => {
    if (tags.length === 0) {
      // console.clear();
    }
  }, [tags]); // Clears the console until the tags array length is 0

  // Decrypt data function
  const decryptData = (encryptedData) => {
    try {
      console.log("%c🔓 Decrypting data...", "color:orange; font-weight:bold;");
      const bytes = CryptoJS.AES.decrypt(encryptedData, import.meta.env.VITE_ENCRYPTION_KEY);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      console.log("%c✔ Decrypted Data: ", "color:green; font-weight:bold;", decryptedData);
      return decryptedData;
    } catch (error) {
      console.error("%c❌ Error decrypting data: ", "color:red; font-weight:bold;", error);
      return null;
    }
  };

  // Handle adding tags on "Enter"
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault(); // Prevent form submission

      // Tag validation: Check if the input contains only symbols
      const symbolOnlyRegex = /^[!@#$%^&*(),.?":{}|<>]+$/;
      if (symbolOnlyRegex.test(input.trim())) {
        setError('Tags cannot contain only symbols');
        console.log("%c✖ Tag cannot contain only symbols", "color:red; font-weight:bold;");
        return;
      }

      // Limit to 5 tags
      if (tags.length >= 5) {
        setError('You can only add up to 5 words');
        console.log("%c✖ You cannot add more than 5 tags", "color:red; font-weight:bold;");
        return;
      }

      console.log(`%c✔ Added tag: ${input.trim()}`, "color:green; font-weight:bold;");
      setTags([...tags, input.trim()]);
      setInput(''); // Clear input
      setError(''); // Clear any previous error
    }
  };

  // Remove a tag
  const removeTag = (indexToRemove) => {
    console.log(`%c✂ Removed tag: ${tags[indexToRemove]}`, "color:orange; font-weight:bold;");
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  // Handle password generation
  const handleGeneratePassword = async () => {
    console.clear(); // Clearing the console 
    // Validation: If no words entered
    if (tags.length === 0) {
      setError('Enter words to proceed');
      console.log("%c⚠ No words entered for password generation", "color:yellow; font-weight:bold;");
      return;
    }

    try {
      setLoading(true);
      setError(''); // Clear any previous errors
      console.log("%c🔄 Initiating password generation process...", "color:blue; font-weight:bold;");
      const encryptedResult = await promptUserForWords(tags);
      const decryptedResult = decryptData(encryptedResult); // Decrypt the result here

      if (decryptedResult) {
        setPassword(decryptedResult.password);
        setNotes(decryptedResult.notes);
        console.log("%c✔ Password successfully generated!", "color:green; font-weight:bold;");
      }
    } catch (error) {
      console.error("%c❌ Error generating password:", "color:red; font-weight:bold;", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white text-gray-800">
      {/* Brand Name with Gradient */}
      <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-900 to-blue-500 bg-clip-text text-transparent leading-tight" style={{ padding: '0.5rem 0' }}>
        Pigeon Passwords
      </h1>
      {/* Short Description Below Brand Name */}
      <p className="text-lg text-gray-600 mb-8 text-center">
        Your trusted solution for generating secure and memorable passwords.
      </p>

      {/* Tag Input Section */}
      <div className="w-full max-w-md mb-4 shadow-md rounded-lg">
        <div className="border border-gray-400 p-3 rounded-xl shadow-md">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter words and press Enter"
            className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400 p-2 font-bold text-lg tracking-wide"
            style={{ WebkitFontSmoothing: 'antialiased' }} // Makes the font smoother
          />
        </div>
        {/* Show tags below the input */}
        <div className="flex flex-wrap mt-4">
          {tags.map((tag, index) => (
            <div key={index} className="flex items-center bg-blue-200 text-blue-800 px-3 py-1 rounded-md mr-2 mb-2 shadow-md">
              {tag}
              <button
                className="ml-2 text-blue-800 hover:text-blue-600"
                onClick={() => removeTag(index)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        {/* Error message for exceeding 5 tags or no words entered */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* Generate Password Button */}
      <button
        onClick={handleGeneratePassword}
        className="mt-4 w-full max-w-md bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition-all relative flex justify-center items-center font-bold text-lg tracking-wide"
        style={{ WebkitFontSmoothing: 'antialiased' }} // Smooth the button text
      >
        {loading ? (
          <div className="spinner border-4 border-blue-300 border-t-transparent rounded-full w-5 h-5 animate-spin"></div>
        ) : (
          <span className="transition-transform transform hover:scale-105">Generate Password</span>
        )}
      </button>

      {/* Password and Tips Section */}
      {password && (
        <div className="mt-8 w-full max-w-md p-6 bg-white shadow-lg rounded-lg border border-gray-200 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Generated Password</h2>
          <p className="text-2xl font-mono font-bold text-blue-600">{password}</p>
          <h3 className="text-xl font-bold mt-6 text-gray-700">Tips to Remember</h3>
          <div className="mt-4 text-gray-600 leading-loose text-left" style={{ paddingLeft: '0', marginLeft: '0' }}>
            {notes.map((note, index) => (
              <p key={index} className="pl-4 mb-2">
                <span className="font-bold">{note}</span>
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
