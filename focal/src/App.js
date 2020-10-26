import React from 'react';
import { v4 as uuid } from 'uuid';
import { NotesList, Stats, SelectedItemDrawer } from './components';

import {
    F, Atom,
} from '@grammarly/focal'

import './App.css';

const notesState = Atom.create({
    items: {
        [uuid()]: { text: 'test hello', bg: '#55FF00', checked: false },
        [uuid()]: { text: 'test', bg: '#117799', checked: false },
    },
    selected: null,
})

function App({ model }) {
    return (
        <F.div className="App">
            <NotesList
                model={model}
                onAdd={text => model.add(text)}
                onDelete={() => model.deleteChecked()}
                onSelect={item => model.setSelected(item)}
            />
            <Stats model={model} />
            <SelectedItemDrawer
                selected={model.selected}
                itemsModel={model.items}
                onClose={() => model.setSelected(false)}
            />
        </F.div>
    );
}

class AppModel {
    constructor(state) {
        this.state = state;
        this.items = this.state.lens('items');
        this.selected = this.state.lens('selected');
    }

    add(text) {
        this.state.modify(({ items }) => {
            const nextId = uuid();
            console.log(items, nextId);
            return ({ items: { ...items, [nextId]: { text, checked: false, bg: '#f2f3c3' } } })
        })
    }

    deleteChecked() {
        this.items.modify((items) => {
            return Object.keys(items)
                .filter(k => !items[k].checked)
                .reduce((acc, k) => {
                    acc[k] = items[k]
                    return acc
                }, {})
        })
    }

    setSelected(id) {
        this.selected.modify(() => id)
    }
}


export default () => <App model={new AppModel(notesState)} />;
