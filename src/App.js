import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useState } from "react";
import axios from "axios";
import InputForm from './InputForm'; // Import the InputForm component

const theme = createTheme({
  palette: {
    primary: {
      main: '#6200ee',
    },
    secondary: {
      main: '#03dac6',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    error: {
      main: '#b00020',
    },
    success: {
      main: '#4caf50',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});


function App() {
  const [inputText, setInputText] = useState("");
  const [generatedText, setGeneratedText] = useState("");

  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://api.openai.com/v1/tokens", {
        prompt: inputText,
      });
      setGeneratedText(response.data.choices[0].text);
    } catch (error) {
      console.error("Error generating text:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <form onSubmit={handleSubmit}>
          {/* ...form contents */}
        </form>
        <div>
         
          <p>{generatedText}</p>
        </div>
        {/* Add InputForm component here */}
        <InputForm />
      </div>
    </ThemeProvider>
  );
}

export default App;
