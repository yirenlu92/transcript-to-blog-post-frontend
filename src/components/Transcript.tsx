import React, { useState, useEffect } from "react";
import axios from "axios";
import TextEditor from "./TextEditor";
import "./Transcript.css";
import { useNavigate } from "react-router-dom";

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

const markingExample = `#QBEGIN

#PBEGIN
- Dan and Chan started playing around with transformers
- Tool they built was amazing for deliberations
- Decided to land on legal, specifically litigation
#PEND

Yiren Lu  00:50
Okay. Cool. And your Chan, right. Okay. Yeah. Tell me about how you guys came to this idea.

Chan  00:58
Yeah. So initially, how the idea was born was the where so back in 2019 there was a new model that came out called Trans. 

#QEND

------


`;

const Transcript: React.FC<Props> = () => {
  const [transcript, setTranscript] = useState<string>("");
  const [firefliesTranscriptId, setFirefliesTranscriptId] =
    useState<string>("");
  const [intervieweeName, setIntervieweeName] = useState<string>("");
  const [intervieweeBackground, setIntervieweeBackground] =
    useState<string>("");
  const [blogPost, setBlogPost] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  // Handle the Otter file upload
  const handleOtterFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Get the file from the event
    const file = event.target.files![0];

    setFile(file);

    console.log("set file");

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

  const handleFirefliesIdSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    axios({
      url: "https://api.fireflies.ai/graphql",
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 873d8798-9192-48c0-a091-dc55df1910d2",
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
        `,
      },
    })
      .then((result) => {
        console.log(result.data.data.transcript.title);
        // concatenate all the sentences into string along with speaker name
        let buff_transcript = "";
        let prev_speaker = "";
        result.data.data.transcript.sentences.forEach((sentence: any) => {
          if (prev_speaker && prev_speaker === sentence.speaker_name) {
            buff_transcript += " " + sentence.text + " ";
          } else {
            buff_transcript +=
              "\n\n" + sentence.speaker_name + "\n" + sentence.text;
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

    if (transcript) {
      // navigate to the /editor page, passing along the transcript
      navigate("/editor", {
        state: {
          transcript: markingExample + transcript,
        },
      });
    }
  };

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Clean up interview transcript
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Upload an Otter.ai transcript file or a Fireflies.ai transcript
                and we'll clean it up into a readable Q&A.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Fireflies Transcript ID
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        name="username"
                        id="username"
                        autoComplete="username"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="janesmith"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-full">
                  <div className="mb-3">
                    <label
                      htmlFor="formFile"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Otter Transcript
                    </label>
                    <input
                      className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                      type="file"
                      id="formFile"
                      onChange={handleOtterFileChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Transcript;
