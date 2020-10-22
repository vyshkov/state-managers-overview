import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { NotesList, Stats, SelectedItemDrawer } from './components';

import './App.css';
import 'rc-checkbox/assets/index.css';

function modifyArray(arr, id, fn) {
    return arr.map(item => (item.id === id ? fn(item) : item));
}

const data = [
    { id: uuid(), text: 'Hello hello', bg: '#dfcec2' },
    { id: uuid(), text: 'Test' },
];

function App() {
    const [items, setItems] = useState(data);
    const [selected, setSelected] = useState(false);

    return (
        <div className="App">
            <NotesList
                items={items}
                onAdd={text =>
                    setItems(data => data.concat({ text, id: uuid() }))
                }
                onDelete={() =>
                    setItems(items => items.filter(i => !i.checked))
                }
                onSelect={item => setSelected(item)}
                onToggle={item => {
                    setItems(
                        modifyArray(items, item.id, i => ({
                            ...i,
                            checked: !i.checked,
                        }))
                    );
                }}
            />
            <Stats items={items} />
            <SelectedItemDrawer
                selected={selected}
                onTextChange={text => {
                    setItems(
                        modifyArray(items, selected.id, val => ({
                            ...val,
                            text,
                        }))
                    );
                    setSelected({ ...selected, text });
                }}
                onColorChange={color => {
                    setItems(
                        modifyArray(items, selected.id, val => ({
                            ...val,
                            bg: color,
                        }))
                    );
                    setSelected({ ...selected, bg: color });
                }}
                onClose={() => setSelected(false)}
            />
        </div>
    );
}

export default App;
