import React, { useState } from "react";
import "./TextEditor.css";

interface Props {
  text: string;
  setText: (text: string) => void;
  label?: string;
}

const TextEditor: React.FC<Props> = ({ text, setText, label }) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  return (
    <div className="w-full min-h-full">
      <label
        htmlFor="comment"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <textarea
          rows={4}
          name="comment"
          id="comment"
          value={text}
          onChange={handleChange}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          defaultValue={""}
        />
      </div>
    </div>
  );
};

export default TextEditor;
