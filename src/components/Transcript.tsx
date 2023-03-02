import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TextEditor from './TextEditor'
import './Transcript.css'

interface Props {}

const Transcript: React.FC<Props> = () => {
  const [transcript, setTranscript] = useState<string>('');
  const [firefliesTranscriptId, setFirefliesTranscriptId] = useState<string>('');
  const [intervieweeName, setIntervieweeName] = useState<string>('');
  const [intervieweeBackground, setIntervieweeBackground] = useState<string>('');
  const [blogPost, setBlogPost] = useState<string>('');

  // useEffect(() => {
  //   axios({
  //     url: 'https://api.fireflies.ai/graphql',
  //     method: 'post',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer 873d8798-9192-48c0-a091-dc55df1910d2'
  //     },
  //     data: {
  //       query: `
  //         query {
  //           transcript(id:"FTgDZhQeZZ") {
  //             title
  //             date
  //             duration
  //             sentences {
  //               text
  //               speaker_name
  //             }
  //           }
  //         }
  //       `
  //     }
  //   })
  //     .then((result) => {
  //       console.log(result.data.data.transcript.title);
  //       // concatenate all the sentences into string along with speaker name
  //       let buff_transcript = '';
  //       let prev_speaker = '';
  //       result.data.data.transcript.sentences.forEach((sentence: any) => {
  //           if (prev_speaker && prev_speaker === sentence.speaker_name) {
  //               buff_transcript += ' ' + sentence.text + ' ';
  //           } else {
  //               buff_transcript += "\n\n" + sentence.speaker_name + "\n" + sentence.text;
  //           }
  //           prev_speaker = sentence.speaker_name;
  //       });
  //       setTranscript(buff_transcript);
  //     })
  //     .catch((e) => {
  //       console.error(e);
  //     });
  // }, []);

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
        formData.append('interviewee_name', intervieweeName);
        formData.append('interviewee_background', intervieweeBackground);
        fetch('https://transcript-to-blog-post-backend.onrender.com/handle_text_file', {
          method: 'POST',
          body: formData,
          mode: 'no-cors',
          redirect: 'follow',
      })
      .then(response => response.text())
      .then((text) => setBlogPost(text))
    }

};

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
            <textarea value={transcript} />
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