import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TextEditor from './TextEditor'
import './Transcript.css'


interface Props {}

// store popular prompts
// const prompts = [
//   "
//         Please translate the following interview transcript into complete, grammatical, idiomatic American English sentences in the style of a professional translator. Do not omit details or change the meaning of the original text.
//     ",

//     """
//     Please turn the following interview transcript into a 600-word customer success story that begins: "We spoke with(name and title at company) about their vision for how Azure OpenAI Service will transform XXX. This is that conversation as summarized by Azure OpenAI Service."

//     Stories should look and feel like they could live on the new Azure AI hub and support the messaging and value statements contained within.

//     The interview transcript is interviewing an educational provider in Taiwan that used Azure OpenAI Service for chatbot and speech assessment capabilities.

//     The interview transcript is in Chinese and is too long, so we will split it up and give it to you in chunks. Please output the corresponding section of the blog post for each input transcript portion we give you. The section should be given a subheading that corresponds to the question that Yiren Lu asked.
//     """

//     """
//     I would like you to take an interview transcript where Yiren Lu is interviewing {} on her experience transitioning from software engineering to product management, and rewrite it in complete, grammatical, idiomatic American English sentences in the style of a blog post.

//     Some addition context about {}'s professional background:

//     {}

//     # The blog post should be written in the first person, from {}'s perspective, and retain as much of the original sentences and details from the transcript as possible. It should not say things like "Yiren Lu asked me...". You might have re-organize the text so that the chronology makes sense.
    
//     # Since the transcript is too long to fix in your context window, we will split it up and give it to you in chunks. Please output the corresponding section of the blog post for each input transcript portion we give you. The section should be given a subheading that corresponds to the question that Yiren Lu asked.
//     #"
// ]

const Transcript: React.FC<Props> = () => {
  const [transcript, setTranscript] = useState<string>('');
  const [firefliesTranscriptId, setFirefliesTranscriptId] = useState<string>('');
  const [intervieweeName, setIntervieweeName] = useState<string>('');
  const [intervieweeBackground, setIntervieweeBackground] = useState<string>('');
  const [blogPost, setBlogPost] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');

  const handleFirefliesIdSubmit = (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    axios({
      url: 'https://api.fireflies.ai/graphql',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 873d8798-9192-48c0-a091-dc55df1910d2'
      },
      data: {
        query: `
          query {
            transcript(id:"${firefliesTranscriptId}") {
              title
              date
              duration
              sentences {
                text
                speaker_name
              }
            }
          }
        `
      }
    })
      .then((result) => {
        console.log(result.data.data.transcript.title);
        // concatenate all the sentences into string along with speaker name
        let buff_transcript = '';
        let prev_speaker = '';
        result.data.data.transcript.sentences.forEach((sentence: any) => {
            if (prev_speaker && prev_speaker === sentence.speaker_name) {
                buff_transcript += ' ' + sentence.text + ' ';
            } else {
                buff_transcript += "\n\n" + sentence.speaker_name + "\n" + sentence.text;
            }
            prev_speaker = sentence.speaker_name;
        });
        setTranscript(buff_transcript);
      })
      .catch((e) => {
        console.error(e);
      });
  };


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    const formData = new FormData();

    if (transcript) {
      formData.append('transcript', transcript);
      formData.append('prompt', prompt);
      formData.append('interviewee_name', intervieweeName);
      formData.append('interviewee_background', intervieweeBackground);
    }

    const requestOptions: RequestInit = {
      method: 'POST',
      body: formData,
    };

    fetch("https://transcript-to-blog-post-backend.onrender.com/handle_text_file", requestOptions)
      .then(response => {
        console.log(response);
        return response.text();
      })
      .then((text) =>
      { 
        console.log(text);       
        setBlogPost(text);
      }
      )
  }

  return (
    <div>
        <div>
          <form onSubmit={handleFirefliesIdSubmit}>
            <div>
              <div>
              <label>Please enter the  Fireflies Transcript Id: </label>
              </div>
              <input type="text" value={firefliesTranscriptId} onChange={(e) => setFirefliesTranscriptId(e.target.value)} placeholder="FirefliesID"/>
            </div>
            {!transcript && <button type="submit">Submit</button>}
          </form>
          {transcript && <div>  
          <form onSubmit={handleSubmit}>
            <div>
              <div>
                <div>
                  <label>Prompt: </label>
                </div>
                <TextEditor text={prompt} setText={setPrompt}/>
                {/* <textarea className="prompt-box" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Prompt" /> */}
              </div>
              <div>
                <label>Interviewee Name: </label>
              </div>
              <input type="text" value={intervieweeName} onChange={(e) => setIntervieweeName(e.target.value)} placeholder="Interviewee Name" />
            </div>
            <div>
              <div>
                <label>Interviewee Background: </label>
              </div>
              <textarea className="background-box" value={intervieweeBackground} onChange={(e) => setIntervieweeBackground(e.target.value)} placeholder="Interviewee Background" />
            </div>
           <div> 
              <div>
                <label>Interviewee Transcript: </label>
              </div>
            <TextEditor text={transcript} setText={setTranscript}/>
            </div>
           <button type="submit">Submit</button>
          </form>
          </div>
        }
        {blogPost && <div><p>Blog Post:</p><TextEditor text={blogPost} setText={setBlogPost}/></div>}
        </div>
    </div>
  );
};


export default Transcript;