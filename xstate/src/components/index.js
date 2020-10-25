// Please don't pay attention to components, i implemented them really quickly just for test
// in this project we comparing the state management
import React, { useState } from 'react';
import { useActor } from "@xstate/react";
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';

import './components.css'

import { TransitionGroup, CSSTransition } from 'react-transition-group'; // ES6

export const ListToolbar = ({ checkedItems = [], onAdd, onDelete }) => {
    const [text, setText] = useState('');
    return (
        <div className="note-list-toolbar">
            <input
                className="note-input"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Please type your note..."
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        if (onAdd) {
                            onAdd(text);
                        }
                        setText('');
                    }
                }}
            ></input>
            {checkedItems.length > 0 && (
                <div className="checked-items-container">
                    <button
                        className="checked-items-delete-btn"
                        onClick={onDelete}
                    >
                        Delete ({checkedItems.length})
                    </button>
                </div>
            )}
        </div>
    );
};

export const Note = ({ item, onSelect, noteRef }) => {
    const [state, send] = useActor(noteRef);
    return (
        <button
            className="note-item"
            style={{ backgroundColor: item.bg }}
            onClick={() => {
                send('EDIT')
                if (onSelect) {
                    onSelect(item);
                }
            }}
        >
            {item.text}
            <div className={`checkbox-container ${item.checked ? 'checked' : ''}`}>
                <Checkbox
                    checked={item.checked}
                    onClick={e => {
                        e.stopPropagation();
                        send('TOGGLE_CHECK')
                    }}
                />
            </div>
        </button>
    );
}

export const Stats = ({ items = [] }) => {
    const selected = items.reduce((acc, el) => (el.checked ? acc + 1 : acc), 0);
    return (
        <div className="list-stats">
            {`Total number of items: ${items.length}`.concat(
                selected ? `, selected: ${selected}` : ''
            )}
        </div>
    );
};

export const SelectedNote = ({
    text,
    color = '#f2f3c3',
    onTextChange,
    onColorChange,
    onClose,
}) => (
    <div className="selected-note-drawer">
        <textarea
            value={text}
            onChange={e => {
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
            onChange={e => {
                if (onColorChange) {
                    onColorChange(e.target.value);
                }
            }}
        />
        <button onClick={onClose}>Close</button>
    </div>
);

export const NotesList = ({ onAdd, onDelete, onSelect, onToggle, items }) => (
    <div className="notes-list">
        <ListToolbar
            onAdd={onAdd}
            checkedItems={items.filter(item => item.checked)}
            onDelete={onDelete}
        />
        <div className="nodes-list-items">
            {items.map(item => (
                <Note
                    key={item.id}
                    item={item}
                    checked={item.checked}
                    onSelect={item => onSelect(item)}
                    onToggle={onToggle}
                    noteRef={item.ref}
                />
            ))}
        </div>
    </div>
);

export const SelectedItemDrawer = ({
    selected,
    onClose,
}) => {
    const [state, send] = useActor(selected.ref);
    return (
        <TransitionGroup className="drawer-transition">
            {selected && (
                <CSSTransition classNames="fade" timeout={330}>
                    <SelectedNote
                        text={state.context.text}
                        color={state.context.bg}
                        onTextChange={(value) => send({ type: 'CHANGE_TEXT', value })}
                        onColorChange={(color) => send({ type: 'CHANGE_COLOR', value: color })}
                        onClose={() => { 
                            send('BLUR')
                            if (onClose) {
                                onClose();
                            }
                        }}
                    />
                </CSSTransition>
            )}
        </TransitionGroup>
    );
}
