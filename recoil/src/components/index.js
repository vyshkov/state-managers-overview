// Please don't pay attention to components, i implemented them really quickly just for test
// in this project we comparing the state management
import React, { useState } from 'react';
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';
import {atomFamily, useRecoilState, selector, useRecoilValue } from 'recoil'
import { listState } from '../App'

import './components.css'

import { TransitionGroup, CSSTransition } from 'react-transition-group'; // ES6


export const noteState = atomFamily({
    key: 'note',
    default: {
        text: '',
        checked: false,
        bg: undefined,
    },
})

const checkedItemsSelector = selector({
    key: 'checked',
    get: ({ get }) => {
        const tasksIds = get(listState);
        return tasksIds.reduce((acc, el) => {
            const noteFields = get(noteState(el));
            if (noteFields.checked) {
                acc.push({ ...noteFields, id: el })
            }
            return acc;
        }, []);
    }
})

export const ListToolbar = ({ onAdd, onDelete }) => {
    const checkedItems = useRecoilValue(checkedItemsSelector);
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
                        onClick={() => onDelete(checkedItems)}
                    >
                        Delete ({checkedItems.length})
                    </button>
                </div>
            )}
        </div>
    );
};


export const Note = ({ item, onToggle, onSelect }) => {
    const [note, setNote] = useRecoilState(noteState(item));

    return (
        <button
            className="note-item"
            style={{ backgroundColor: note.bg }}
            onClick={() => {
                if (onSelect) {
                    onSelect(item);
                }
            }}
        >
            {note.text}
            <div className={`checkbox-container ${note.checked ? 'checked' : ''}`}>
                <Checkbox
                    checked={note.checked}
                    onClick={e => {
                        e.stopPropagation();
                        setNote({
                            text: note.text,
                            checked: !note.checked,
                            bg: note.bg,
                        })
                    }}
                />
            </div>
        </button>
    );
}


export const Stats = ({ items = [] }) => {
    const checked = useRecoilValue(checkedItemsSelector).length;
    return (
        <div className="list-stats">
            {`Total number of items: ${items.length}`.concat(
                checked ? `, selected: ${checked}` : ''
            )}
        </div>
    );
};

export const SelectedNote = ({
    onClose,
    selectedId
}) => {
    const [note, setNote] = useRecoilState(noteState(selectedId));
    const {text,  bg = '#f2f3c3'} = note;

    return (
        <div className="selected-note-drawer">
            <textarea
                value={text}
                onChange={e => {
                    setNote({ ...note, text: e.target.value })
                }}
                className="selected-note-text"
            >
                {text}
            </textarea>
            <input
                className="selected-note-color-picker"
                type="color"
                value={bg}
                onChange={e => {
                    setNote({ ...note, bg: e.target.value })
                }}
            />
            <button onClick={onClose}>Close</button>
        </div>
    );
}

export const NotesList = ({ onAdd, onDelete, onSelect, items }) => (
    <div className="notes-list">
        <ListToolbar
            onAdd={onAdd}
            onDelete={onDelete}
        />
        <div className="nodes-list-items">
            {items.map(item => (
                <Note
                    key={item}
                    item={item}
                    onSelect={onSelect}
                />
            ))}
        </div>
    </div>
);

export const SelectedItemDrawer = ({
    selectedId,
    onClose,
}) => (
    <TransitionGroup className="drawer-transition">
        {selectedId && (
            <CSSTransition classNames="fade" timeout={330}>
                <SelectedNote
                    onClose={onClose}
                    selectedId={selectedId}
                />
            </CSSTransition>
        )}
    </TransitionGroup>
);
