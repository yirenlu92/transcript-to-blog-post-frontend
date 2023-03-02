import React, { useState } from 'react';
import './TextEditor.css'

interface Props {
  text: string;
  setText: (text: string) => void;
}

const TextEditor: React.FC<Props> = ({ text, setText }) => {

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  return (
    <div>
      <textarea value={text} onChange={handleChange} />
    </div>
  );
}

export default TextEditor;
