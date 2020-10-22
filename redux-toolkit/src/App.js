import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import "rc-checkbox/assets/index.css";
import Checkbox from "rc-checkbox";

import { TransitionGroup, CSSTransition } from "react-transition-group"; // ES6

const ListToolbar = () => (
  <div className="note-list-toolbar">
    <input
      className="note-input"
      placeholder="Please type your note..."
    ></input>
  </div>
);

const Note = ({ text, bg, checked, onToggle, onSelect }) => (
  <button
    className="note-item"
    style={{ backgroundColor: bg }}
    onClick={() => {
      if (onSelect) {
        onSelect();
      }
    }}
  >
    {text}
    <div className={`checkbox-container ${checked ? "checked" : ""}`}>
      <Checkbox
        checked={checked}
        onClick={(e) => {
          e.stopPropagation();
          if (onToggle) {
            onToggle(!checked);
          }
        }}
      />
    </div>
  </button>
);

const SelectedNote = ({
  text,
  color = "#f2f3c3",
  onTextChange,
  onColorChange,
  onClose,
  inasd,
}) => (
  <div className="selected-note-drawer">
    <textarea
      value={text}
      onChange={(e) => {
        if (onTextChange) {
          onTextChange(e.target.value);
        }
      }}
      className="selected-note-text"
    >
      {text}
    </textarea>
    <input
      className="selected-note-color-picker"
      type="color"
      value={color}
      onChange={(e) => {
        if (onColorChange) {
          onColorChange(e.target.value);
        }
      }}
    />
    <button onClick={onClose}>Close</button>
  </div>
);

function App() {
  const [selected, setSelected] = useState(false);

  return (
    <div className="App">
      <div className="notes-list">
        <ListToolbar />
        <div className="nodes-list-items">
          <Note
            text="Hello world"
            onSelect={() => setSelected(true)}
            onToggle={() => alert(2)}
          />
          <Note text="Hello world" />
          <Note text="Hello world" checked />
          <Note text="Hello world" />
          <Note text="Hello world" />
          <Note text="Hello world" checked />
          <Note text="Hello world" />
          <Note text="Hello world" />
          <Note text="Hello world" />
          <Note text="Hello world" />
          <Note text="Hello world" />
          <Note text="Hello world" />
          <Note text="Hello world" />
          <Note text="Hello world" />
          <Note text="Hello world" />
          <Note text="Hello world" />
          <Note text="Hello world" bg="#dfcec2" />
          <Note text="Hello world" bg="#8855AA" />
        </div>
      </div>
      <div className="list-stats">Total number of items: 0</div>

      <TransitionGroup className="drawer-transition">
        {selected && (
          <CSSTransition className="PAR" classNames="fade" timeout={100000}>
            <SelectedNote
              text="123"
              onTextChange={(val) => console.log("text", val)}
              onColorChange={(color) => {
                console.log("color", color);
              }}
              onClose={() => setSelected(false)}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </div>
  );
}

export default App;
