import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { NotesList, Stats, SelectedItemDrawer, noteState } from './components';
import { RecoilRoot, atom, useRecoilState, useRecoilCallback } from 'recoil'

import './App.css';

const data = [
    { id: uuid(), text: 'Hello hello', bg: '#dfcec2' },
    { id: uuid(), text: 'Test' },
];

export const listState = atom({
    key: 'notes',
    default: data
})

const selectedItem = atom({
    key: 'selected',
    default: undefined,
})

function App() {
    const [notes, setNotes] = useRecoilState(listState);
    const [selected, setSelected] = useRecoilState(selectedItem);

    const addNote = useRecoilCallback(({ set }) => {
        return (text) => {
            const id = uuid();
            set(listState, [...notes, id]);
            set(noteState(id), {
                text,
                checked: false
            })
        }
    })

    return (
        <div className="App">
            <NotesList
                items={notes}
                onAdd={text => addNote(text)}
                onDelete={checked =>
                    setNotes(notes.filter(note => !checked.find(i => i.id === note)))
                }
                onSelect={item => {
                    setSelected(item)
                }}
            />
            <Stats items={notes} />
            <SelectedItemDrawer
                selectedId={selected}
                onClose={() => setSelected(false)}
            />
        </div>

    );
}

export default () => (
    <RecoilRoot
        initializeState={
            function ({ set }) {
                set(listState, ['1', '2']);
                set(noteState('1'), {
                    text: 'Hello hello',
                    checked: false
                });
                set(noteState('2'), {
                    text: 'Hello',
                    checked: false,
                    bg: '#123400'
                })
            }}
    >
        <App />
    </RecoilRoot>
);
