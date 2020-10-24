import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { observer } from "mobx-react-lite";
import { NotesList, Stats, SelectedItemDrawer } from './components';

import { makeObservable, observable, action } from "mobx"
import { types, onSnapshot } from "mobx-state-tree"

import './App.css';
import 'rc-checkbox/assets/index.css';

const NoteModel = types.model({
    text: types.string,
    bg: types.maybe(
        types.string
    ),
    id: types.string,
    checked: types.boolean,
}).actions(self => ({
    toggle() {
        self.checked = !self.checked
    },
    setText(text) {
        self.text = text
    },
    setColor(color) {
        self.bg = color;
    }
}))

const RootStore = types.model({
    items: types.array(NoteModel),
    selected: types.maybeNull(
        types.string
    )
})
.views(self => ({
    get selectedNote() {
        return self.selected && self.items.find(i => i.id === self.selected)
    }
}))
.actions(self => ({
    add(text) {
        self.items.push(NoteModel.create({ text, checked: false, id: uuid() }));
    },
    deleteChecked() {
        self.items = self.items.filter(el => !el.checked);
    },
    setSelected(data) {
        self.selected = data && data.id;
    }
}))


// Please note, that i had to do internal list components
// to be observers also, so the Note Component, NotesListToolBar and Stats are all abservers
const NotesApp = observer(({ data }) => (
    <div className="App">
        <NotesList
            items={data.items}
            onAdd={text => data.add(text)}
            onDelete={() => data.deleteChecked()}
            onSelect={item => data.setSelected(item)}
        />
        <Stats items={data.items} />
        <SelectedItemDrawer
            selected={data.selectedNote}
            onClose={() => data.setSelected(null)}
        />
    </div>
));


const store = RootStore.create({
    items: [
        NoteModel.create({ text: 'Test test', id: uuid(), checked: false }),
        NoteModel.create({ text: 'Test', id: uuid(), checked: false, bg: '#119900' }),
    ],
    selected: null,
})

const Container = () => <NotesApp data={store} />


export default Container;
