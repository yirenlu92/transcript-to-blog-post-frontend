import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Transcript {
  user_id: string;
  email: string;
  name: string;
  num_transcripts: number;
  recent_transcript: string;
  minutes_consumed: number;
  is_admin: boolean;
  integrations: string[];
}

const Transcripts: React.FC = () => {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [selectedTranscript, setSelectedTranscript] = useState<Transcript | null>(null);

  useEffect(() => {
    const fetchTranscripts = async () => {
      const result = await axios({
        url: 'https://api.fireflies.ai/graphql',
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 873d8798-9192-48c0-a091-dc55df1910d2',
        },
        data: {
          query: `
            query {
              transcript(id:"LL5gQjMQJ5") {
                title
                date
                duration
              }
            }
          `,
        },
      });
      setTranscripts(result.data.data.user);
    };
    fetchTranscripts();
  }, []);

  return (
    <div>
      <h1>Transcripts</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {transcripts.map((transcript) => (
          <div
            key={transcript.user_id}
            onClick={() => setSelectedTranscript(transcript)}
            style={{
              width: '300px',
              height: '200px',
              margin: '10px',
              border: '1px solid black',
              cursor: 'pointer',
            }}
          >
            <h2>{transcript.name}</h2>
            <p>Number of transcripts: {transcript.num_transcripts}</p>
            <p>Minutes consumed: {transcript.minutes_consumed}</p>
          </div>
        ))}
      </div>
      {selectedTranscript && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'white', padding: '20px' }}>
          <h2>{selectedTranscript.name}</h2>
          <p>Email: {selectedTranscript.email}</p>
          <p>Number of transcripts: {selectedTranscript.num_transcripts}</p>
          <p>Minutes consumed: {selectedTranscript.minutes_consumed}</p>
          <p>Is admin: {selectedTranscript.is_admin ? 'Yes' : 'No'}</p>
          <p>Integrations: {selectedTranscript.integrations.join(', ')}</p>
          <button onClick={() => setSelectedTranscript(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Transcripts;
