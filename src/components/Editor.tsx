import React, { useState, useEffect } from "react";
import axios from "axios";
import TextEditor from "./TextEditor";
import "./Transcript.css";
import { useNavigate, useLocation } from "react-router-dom";
import Spinner from "./Spinner";

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

const Editor: React.FC<Props> = () => {
  const { state } = useLocation();
  const { transcript } = state;

  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editableTranscript, setEditableTranscript] =
    useState<string>(transcript);

  const [intervieweeName, setIntervieweeName] = useState<string>("");
  const [intervieweeBackground, setIntervieweeBackground] =
    useState<string>("");
  const [blogPost, setBlogPost] = useState<string>("");
  const [editableBlogPost, setEditableBlogPost] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    const formData = new FormData();

    if (editableTranscript) {
      formData.append("transcript", editableTranscript);
      // formData.append("prompt", prompt);
      // formData.append("interviewee_name", intervieweeName);
      // formData.append("interviewee_background", intervieweeBackground);
    }

    const requestOptions: RequestInit = {
      method: "POST",
      body: formData,
    };

    fetch(`${process.env.REACT_APP_BASE_URL}/handle_text_file`, requestOptions)
      .then((response) => {
        console.log(response);
        return response.text();
      })
      .then((text) => {
        console.log(text);
        setBlogPost(text);
        setEditableBlogPost(text);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
        setError(error);
      });
  };

  return (
    <div className="w-1/2 pt-12">
      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <article className="prose prose-sm leading-7 text-gray-900">
              <h3>Go through the transcript and do the following:</h3>
              <ul>
                <li>
                  Mark the beginning and end of each question and answer with
                  <span className="font-bold"> #QBEGIN</span> and{" "}
                  <span className="font-bold"> #QEND</span>
                </li>
                <li>
                  Inside each question and answer, add the main points the edit
                  should cover. Demarcate the beginning and end of the points
                  with <span className="font-bold">#PBEGIN</span> and{" "}
                  <span className="font-bold">#PEND</span>.
                </li>
                <li>
                  We show an example in the text editor below. You should follow
                  that format for the rest of the transcript, and then delete
                  the example.
                </li>
              </ul>
            </article>
            <div className="flex flex-wrap gap-4">
              <div className="flex-grow">
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-full">
                    {transcript && (
                      <TextEditor
                        text={editableTranscript}
                        setText={setEditableTranscript}
                        label="Transcript"
                      />
                    )}
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
                <div className="flex items-center">
                  {isLoading && (
                    <div className="mx-auto">
                      <Spinner />
                    </div>
                  )}
                </div>
                <div className="flex items-center">
                  {!isLoading && error && (
                    <div className="mx-auto">
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
                        <p>Oops! Something went wrong: {error.message}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {blogPost && (
                <div className="flex-grow sm:mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-full">
                    <TextEditor
                      text={editableBlogPost}
                      setText={setEditableBlogPost}
                      label="Polished Q&A"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Editor;
