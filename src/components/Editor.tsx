import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import TextEditor from "./TextEditor";
import "./Transcript.css";
import { useNavigate, useLocation } from "react-router-dom";
import Spinner from "./Spinner";

interface Props {}

const examplePrompt = `
Please turn this portion of an interview transcript into a written guide. In the guide, each question should be restated verbatim. Each answer should be turned into a polished answer, with 1-5 bolded themes that are then expanded on. Please try to keep as much of the original sentence structure and details from the transcript as possible. Here's an example input and output we are looking for below:

Example Input (raw transcript):
"""
Interviewer  00:02
Perfect. So the first question, why are management skills important to business success?

Diane  00:09
That is the million dollar question. Yeah, so management skills are important to business success, because unless you are a business of one person, your business success is dependent on groups of people working together to create, you know, to create a shared outcome. Right. And that doesn't happen by accident, that has to happen by design. And there are many, many things, you know, just like a complicated machine, there are many parts that can break things that can go wrong, it's the same thing within kind of the the ecosystem of an organization. And so management skills are critical to business success, because without them, you're not actually going to be able to operate efficiently as a unit as a business.

Interviewer  01:05
Awesome. And then we talked a bit about this last time, the tipping point skill, what are they? How should you think about them? And leveraging? Yeah,

Diane  01:15
so a tipping point scale is basically it's a small change that makes a big impact. So the idea is that there are hundreds and hundreds of different kinds of skills and skill sets that you can have in the workplace, there are some that matter a lot more than others. Right? So think of these as kind of like, the most important foundational skills that you can have. You know, it's kind of like a, like, the, I'm trying to think of some some good analogies. But it's like, you know, you say, like, you need to walk before you can run, it's kind of like, what's the equivalent of that? For leadership? So a tipping point scale is basically a skill that has widespread utility across a wide variety of situations and domains. It applies to people in a variety of roles, it has a lot of different use cases. And it is comprised of what we call behavioral units. So a discrete observable behavior that one can deliver, you know, do and get feedback on.
"""

Example Output (polished guide):
"""
Management skills foster productive collaboration towards shared goals - unless you’re a company of one, groups of people are working towards collective outcomes. This is a complicated and delicate machine, and fostering productive collaboration between each part requires intentionality.

Good management turns individual contributors into future leaders - you want to create a network of independent problem solvers. If managers are the single source of solutions, that’s a short-sighted arrangement. Coaching spreads skills widely through the organization to prevent a bottleneck at key positions and to foster future leaders.

What are “tipping point” skills?

They’re the small changes that have an outsize impact on success - these are the most important and foundational skills a manager can have; they unlock managers’ and teams’ ability to handle challenges that come their way. “Tipping point skills” have widespread utility across a variety of domains, roles, and use cases. 

Manager tipping point skills covered in this guide:
Coaching - using questions to engage, empower, and improve performance in your direct reports.
Feedback - knowing how to give feedback that is specific, actionable, and motivating.
Productivity and prioritization - working smarter when time and resources are limited.
Effective 1:1s - holding developmental 1-on-1 conversations that are productive, motivating, and clarifying for reports.
"""

Input (raw transcript):
`;

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
  const [editablePrompt, setEditablePrompt] = useState<string>(examplePrompt);
  const textareaRef = useRef(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // check whether there is ## in the transcript
    if (!editableTranscript.includes("##")) {
      // create an error
      setError(
        new Error("Please mark the end of each question/answer chunk with ##")
      );
      console.log("about to return since there's an error");
      // break
      return;
    }

    setIsLoading(true);
    const formData = new FormData();

    if (editableTranscript) {
      formData.append("transcript", editableTranscript);
      formData.append("prompt", editablePrompt);
      // formData.append("interviewee_name", intervieweeName);
      // formData.append("interviewee_background", intervieweeBackground);
    }

    console.log("should not be reaching here");

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
    <div className="w-2/3 pt-12">
      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          <article className="prose prose-lg leading-7 text-gray-900">
            <h2>Instructions</h2>
            <ul>
              <li>
                Mark the end of each question/answer chunk with
                <span className="font-bold"> ##</span>.
              </li>
              <li>Delete any filler parts of the transcript</li>
              <li>
                (Optional) Inside each question and answer, add the main points
                the edit should cover. Demarcate the beginning and end of the
                points with <span className="font-bold">#PBEGIN</span> and{" "}
                <span className="font-bold">#PEND</span>.
              </li>
              <li>
                We show an example in the{" "}
                <span className="font-bold">Transcript </span>text editor below.
                You should follow that format for the rest of the transcript,
                and then delete the example.
              </li>
            </ul>
          </article>
          <div className="w-full h-96">
            <TextEditor
              text={editablePrompt}
              setText={setEditablePrompt}
              label="Prompt"
              defaultValue={examplePrompt}
            />
          </div>
          <div className="flex pt-8 pb-20">
            <div className="grow mr-2">
              <div className="h-128 w-full">
                {transcript && (
                  <TextEditor
                    text={editableTranscript}
                    setText={setEditableTranscript}
                    label="Transcript"
                  />
                )}
              </div>
              <div className="flex justify-end mt-20 mb-2">
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 my-auto px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
              <div className="flex justify-end">
                {!isLoading && error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
                    <p>Oops! Something went wrong: {error.message}</p>
                  </div>
                )}
              </div>
            </div>
            {blogPost && (
              <div className="grow ml-2">
                <div className="h-128 w-full">
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
      </form>
    </div>
  );
};

export default Editor;
