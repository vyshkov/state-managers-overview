import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { fromEvent, defer } from 'rxjs'
import { NotesList, Stats, SelectedItemDrawer } from './components';


import {
    F, Atom, Lens, bind, reactiveList, classes
  } from '@grammarly/focal'


  import { combineLatest, map, startWith } from 'rxjs/operators'

import './App.css';

const locationHash = defer(() =>
  fromEvent(window, 'hashchange').pipe(
    map(() => window.location.hash),
    startWith(window.location.hash)
  )
)

// @TODO would be cool to use existing property lenses in place of filters,
// as they do in Calmm. Needs research.
const routes = [
  { hash: '#/', filter: () => true, title: 'All' },
  { hash: '#/active', filter: x => !x.completed, title: 'Active' },
  { hash: '#/completed', filter: (x) => x.completed, title: 'Completed' }
]

const route = locationHash.pipe(map(h => routes.find(r => r.hash === h) || routes[0]))



function modifyArray(arr, id, fn) {
    return arr.map(item => (item.id === id ? fn(item) : item));
}

const data = [
    { id: uuid(), text: 'Hello hello', bg: '#dfcec2' },
    { id: uuid(), text: 'Test' },
];

const notesState = Atom.create({
    items: [],
    selected: null,
})

const Todo = ({ todo, id }) => {
    console.log('todp', todo);
    window.todo = todo;

    return (
<div id={id}>{todo.get() === undefined ? 'asd' : 'asddas'}</div>
);
    }

function App({ model }) {
    const [items, setItems] = useState(data);
    const [selected, setSelected] = useState(false);
    console.log(model.items, 'asd', reactiveList(model.items))
    
    return (
        <F.div className="App">
            <F.button onClick={() => model.add('Test' + Math.random())}>Add</F.button>
            <F.ul className='todo-list'>
                {reactiveList(
                    route.pipe(combineLatest(
                        model.todos,
                        (r, xs) => { console.log({r, xs}); return Object.keys(xs).filter(k => r.filter(xs[k]))}
                      )),
                    item => <Todo
                        id={item.id}
                        key={item.id}
                        todo={model.items.lens(Lens.key(item.id))}
                        remove={() => model.delete(item.id)}
                        editing={Atom.create(false)}
                    />
                )}
            </F.ul>
            {/* <NotesList
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
            /> */}
        </F.div>
    );
}

class AppModel {
    constructor(state) {
        this.state = state;
        this.items = this.state.lens('items');
    }

    add(text) {
        console.log()
        this.state.modify(( { items } ) => {
            const nextId = uuid();
            console.log(items, nextId); 
            return ({  items: items.concat({ id: nextId, text }) }) 
        })
    }
}


export default () => <App model={new AppModel(notesState)} />;
