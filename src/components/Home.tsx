import React, { useState } from 'react';
import './Home.css'
import TextEditor from './TextEditor'
import fs from 'fs';
import textract from 'textract';

const Home: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [blogPost, setBlogPost] = useState<string>('');
  const [transcriptParts, setTranscriptParts] = useState<string[]>([]);
  const [intervieweeName, setIntervieweeName] = useState<string>('');
  const [intervieweeBackground, setIntervieweeBackground] = useState<string>('');

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  // Handle the file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Get the file from the event
    const file = event.target.files![0];

    setFile(file)

    // Create a new FileReader to read the file
    const reader = new FileReader();


    // Set a handler for when the file has been read
    reader.onload = (e) => {
      // Update the state with the file contents
      setTranscript(e.target?.result as string);
    };

    // Read the file as text
    reader.readAsText(file);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    const formData = new FormData();

    // if (url) {
    //     formData.append('video_url', url);
    //     fetch('http://localhost:8000/handle_youtube_video', {
    //       body: formData,
    //       method: 'POST',
    //   })
    //   .then(response => response.text())
    //   .then((text) => setTranscript(text))
    // }


    if (transcript) {
        formData.append('transcript', transcript);
        fetch('http://127.0.0.1:5000/handle_text_file', {
          body: formData,
          method: 'POST',
      })
      .then(response => response.text())
      .then((text) => setBlogPost(text))
    }

};

  return (

    <div>
    <form onSubmit={handleSubmit}>
      <br />
      <label>
        Upload Transcript Text File:
        <input type="file" accept=".txt, .doc, .docx" onChange={handleFileChange} />
      </label>
      
    {transcript && <div><p>Transcript:</p><TextEditor text={transcript} setText={setTranscript}/></div>}
    {blogPost && <div><p>Blog Post:</p><TextEditor text={blogPost} setText={setBlogPost}/></div>}
      <button type="submit">Submit</button>
    </form>
   
    </div>
  );
};

export default Home;
