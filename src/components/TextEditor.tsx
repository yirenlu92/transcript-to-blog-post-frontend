import React, { useState, useMemo } from "react";
import "./TextEditor.css";

interface Props {
  text: string;
  setText: (text: string) => void;
  label?: string;
  defaultValue?: string;
}

const TextEditor: React.FC<Props> = ({
  text,
  setText,
  label,
  defaultValue,
}) => {
  const [localText, setLocalText] = useState(text);

  const handleBlurForEditor = () => {
    setText(localText);
  };

  const handleChangeForTextEditor = useMemo(
    () => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setLocalText(event.target.value);
    },
    [setText]
  );

  return (
    <div className="w-full h-full">
      <label
        htmlFor="comment"
        className="block text-md font-medium leading-6 text-gray-900 pb-3"
      >
        {label}
      </label>
      <div className="mt-2 h-full">
        <textarea
          name="comment"
          id="comment"
          value={localText}
          onChange={handleChangeForTextEditor}
          onBlur={handleBlurForEditor}
          className="h-full block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-lg"
        />
      </div>
    </div>
  );
};

export default TextEditor;
