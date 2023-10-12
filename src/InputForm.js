import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
  OutlinedInput,
  Slider,
} from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';



const subjects = [
    { name: 'English Language Arts', functions: ['Reading Comprehension', 'Writing Skills', 'Grammar', 'Vocabulary', 'Oral Communication', 'Listening Skills'] },
    { name: 'Mathematics', functions: ['Number Sense', 'Algebraic Skills', 'Geometry', 'Data Analysis', 'Problem Solving', 'Mathematical Reasoning'] },
    { name: 'Science', functions: ['Scientific Method', 'Lab Skills', 'Data Interpretation', 'Critical Thinking', 'Conceptual Understanding', 'Scientific Communication'] },
    { name: 'Social Studies', functions: ['Historical Knowledge', 'Geographical Skills', 'Civic Understanding', 'Economic Principles', 'Critical Thinking', 'Communication Skills'] },
    { name: 'Physical Education', functions: ['Motor Skills', 'Fitness', 'Teamwork', 'Sportsmanship', 'Personal Responsibility', 'Health and Wellness'] },
    { name: 'Art', functions: ['Creativity', 'Technique', 'Artistic Expression', 'Art History', 'Visual Literacy', 'Craftsmanship'] },
    { name: 'Music', functions: ['Musical Theory', 'Instrument Skills', 'Vocal Skills', 'Ensemble Performance', 'Music History', 'Creativity'] },
];
const FormWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: '8px',
    boxShadow: theme.shadows[1],
    width: '80%',
    maxWidth: '800px',
  }));
  
  const InputFieldsWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    '& .MuiTextField-root': { margin: theme.spacing(1), minWidth: '200px' },
    '& .MuiFormControl-root': { margin: theme.spacing(1), minWidth: '240px' }, // Updated minWidth
  }));
  
  const calculateLabelMargin = () => {
    const sliderWidth = document.querySelector(".slider")?.clientWidth;
    const removeButtonWidth = document.querySelector(".removeButton")?.clientWidth;
    const marginRight = sliderWidth - removeButtonWidth;
    return marginRight > 0 ? marginRight : 0
  };


  const TextAreaWrapper = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: '8px',
    boxShadow: theme.shadows[1],
    padding: theme.spacing(1),
    marginTop: theme.spacing(2),
    minHeight: '100px',
    overflowY: 'auto',
  }));
const InputForm = () => {
    const [subject, setSubject] = useState("");
    const [grade, setGrade] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [writingSample, setWritingSample] = useState('');
    const [sliderValues, setSliderValues] = useState({});
    const [generatedComment, setGeneratedComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sliders, setSliders] = useState([]);

    const studentName = firstName + " " + lastName;

    const [isCopied, setIsCopied] = useState(false);


    const marks = [
      { value: 1, label: "Weak" },
      { value: 3, label: "Developing" },
      { value: 5, label: "Proficient" },
      { value: 7, label: "Excels" },
    ];

    useEffect(() => {
        const currentSubject = subjects.find((s) => s.name === subject);
        if (currentSubject) {
            setSliders(
                currentSubject.functions.map((func, index) => ({
                    id: index + 1,
                    name: func,
                }))
            );
        }
    }, [subject]);
    
    const LoadingIndicator = () => (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
          <CircularProgress />
        </Box>
      );

    const handleRemoveSlider = (id) => {
        setSliders(sliders.filter((slider) => slider.id !== id));
      };

      const handleFunctionNameChange = (id, newName) => {
        setSliders(sliders.map(slider => slider.id === id ? { ...slider, name: newName } : slider));
      };
    
    
      const addSlider = () => {
        const newId = Math.max(...sliders.map((slider) => slider.id)) + 1;
        setSliders([...sliders, { id: newId, name: "", placeholder: "Add competency" }]);
      };
      
      
      const handleSliderChange = (id, newValue) => {
        const slider = sliders.find((slider) => slider.id === id);
        if (slider) {
          setSliderValues({ ...sliderValues, [slider.name]: newValue });
        }
      };
    

    const handleSubjectChange = (event) => {
        setSubject(event.target.value);
    };

    const handleGradeChange = (event) => {
        setGrade(event.target.value);
    };

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    };

    const handleWritingSampleChange = (event) => {
        setWritingSample(event.target.value);
    };

    const copyToClipboard = () => {
      navigator.clipboard.writeText(generatedComment);
      setIsCopied(true);
    };
    

      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setGeneratedComment("");
      
        try {
          const performanceScores = sliders
            .filter((slider) => slider.name)
            .map((slider) => `${slider.name}: ${sliderValues[slider.name] || 5}`)
            .join(', ');
      
          const requestBody = {
            prompt: `Generate a thoughtful and detailed report card comment for ${studentName} studying grade ${grade} ${subject}. Refer to the student's specific performance, based on: ${performanceScores}, but do not refer to the actual numbers. Provide relevant recommendations based on their performance. Draw upon the writing style of this sample: "${writingSample}". Comment:`,
            max_tokens: 150,
            temperature: 0.3,
          };
      
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
            },
          };
      
          const response = await axios.post(
            "https://api.openai.com/v1/engines/text-davinci-003/completions",
            requestBody,
            config
          );
      
          setLoading(false);
          setGeneratedComment(response.data.choices[0].text.trim());
        } catch (error) {
          setLoading(false);
          setError('Error generating comment: ' + error.message); // Update this line
          console.error("Error generating comment:", error);
        }
      };      
    
    const gradeOptions = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Teacher Report Card Comment Generator
            </Typography>
            <FormWrapper component="form" noValidate autoComplete="off"onSubmit={handleSubmit}>
                <InputFieldsWrapper>
              <TextField
                label="First Name"
                name="firstName"
                variant="outlined"
                value={firstName}
                onChange={handleFirstNameChange}
              />
              <TextField
                label="Last Name"
                name="lastName"
                variant="outlined"
                value={lastName}
                onChange={handleLastNameChange}
              />
              <FormControl variant="outlined">
                <InputLabel htmlFor="grade-select">Grade</InputLabel>
                <Select
                  label="Grade"
                  value={grade}
                  onChange={handleGradeChange}
                  input={<OutlinedInput name="grade" id="grade-select" />}
                >
                  {gradeOptions.map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl variant="outlined">
                <InputLabel htmlFor="subject-select">Subject</InputLabel>
                <Select
                  label="Subject"
                  value={subject}
                  onChange={handleSubjectChange}
                  input={<OutlinedInput name="subject" id="subject-select" />}
                >
                  {subjects.map((subject) => (
                    <MenuItem key={subject.name} value={subject.name}>
                      {subject.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              </InputFieldsWrapper>
              {subject && (
  <Box sx={{ mt: 2, width: '100%' }}>
    <Typography variant="h6">Performance Scores:</Typography>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        mt: -1,
        mb: 1,
        ml: 25,
        mr: calculateLabelMargin(),
        flexGrow: 1,
        width: '65%',
      }}
    >
      <Typography variant="body2">Weak</Typography>
      <Typography variant="body2">Developing</Typography>
      <Typography variant="body2">Proficient</Typography>
      <Typography variant="body2">Excels</Typography>
    </Box>
    {sliders.map((slider) => (
          <Box
            key={slider.id}
            sx={{
              mt: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          >
          <TextField
            label="Competency"
            value={slider.name}
            placeholder={slider.placeholder || ""}
            onChange={(e) =>
              handleFunctionNameChange(slider.id, e.target.value)
            }
            sx={{ minWidth: '200px', flexGrow: 1 }}
          />
          <Slider
  className="slider" // Add this line
  value={sliderValues[slider.name] || 5}
  onChange={(e, newValue) => handleSliderChange(slider.id, newValue)}
  step={1}
  marks={slider.id === 1 ? [1, 3, 5, 7].map((value) => ({ value, label: '' })) : null}
  min={1}
  max={7}
  valueLabelDisplay="auto"
  sx={{ mx: 1, flexGrow: 1, width: '100%' }}
  labelPlacement="top"
/>
<Button
  className="removeButton"
  variant="outlined"
  color="error"
  onClick={() => handleRemoveSlider(slider.id)}
  sx={{ ml: 1 }}
  disabled={sliders.length <= 1}
>
  Remove
</Button>

            
          </Box>
        ))}
      <Button
      sx={{ mt: 2 }}
      variant="contained"
      color="primary"
      onClick={addSlider}
      disabled={sliders.length >= 10}
    >
      Add Competency
    </Button>
  </Box>
  )}
            {/* Writing Sample */}
            <TextField
              id="writing-sample"
              label={
                <Typography noWrap={false}>
                  [Optional] Paste some of your own writing here. The tool will attempt to emulate your writing style.
                </Typography>
              }
              multiline
              rows={4}
              defaultValue=""
              onChange={handleWritingSampleChange}
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
            />
         <Button
         sx={{ mt: 2 }}
         type="submit" // Added type="submit"
         variant="contained"
         color="primary"
         disabled={!firstName || !lastName || !grade || !subject}
      >
        Generate Comment
      </Button>
      {loading && <LoadingIndicator />}
            </FormWrapper>
        

            <Box sx={{ mt: 4, mb: 4, width: '80%', maxWidth: '800px', textAlign: 'center' }}>
  <Typography variant="h6">Generated Comment:</Typography>
  <TextAreaWrapper>
    <Typography>{generatedComment || 'No comment generated yet.'}</Typography>
  </TextAreaWrapper>
  {generatedComment && (
    <Button
      sx={{ mt: 2, mx: 'auto' }}
      variant="contained"
      color="primary"
      onClick={copyToClipboard}
    >
      Copy to clipboard
    </Button>
  )}
</Box>



    </Box>
  );
};

export default InputForm;