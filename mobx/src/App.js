import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { observer } from "mobx-react-lite";
import { NotesList, Stats, SelectedItemDrawer } from './components';

import { makeObservable, observable, action } from "mobx"

import './App.css';
import 'rc-checkbox/assets/index.css';

class Note {
    id = uuid();
    text = "";
    bg = undefined;
    checked = false;

    constructor(text = "") {
        makeObservable(this, {
            text: observable,
            checked: observable,
            bg: observable,
            setText: action,
            setColor: action,
            toggle: action,
        });
        this.text = text
    }

    setText(text) {
        this.text = text;
    }

    setColor(color) {
        this.bg = color;
    }

    toggle() {
        this.checked = !this.checked;
    }
}

class Notes {
    items = [];
    selected = null;
    constructor(data) {
        makeObservable(this, {
            items: observable,
            selected: observable,
            add: action,
            deleteChecked: action,
            setSelected: action,
        });
        this.items = data;
    }
    add(text) {
        this.items.push(new Note(text));
        console.log(this.items);
    }
    deleteChecked() {
        this.items = this.items.filter(item => !item.checked);
    }
    setSelected(data) {
        this.selected = data
    }
}

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
            selected={data.selected}
            onClose={() => data.setSelected(false)}
        />
    </div>
));

const store = new Notes([
    new Note("Get Coffee"),
    new Note("Write simpler code")
]);

const Container = () => <NotesApp data={store} />

export default Container;
