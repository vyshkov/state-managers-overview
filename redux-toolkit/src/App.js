import React from 'react';
import { v4 as uuid } from 'uuid';
import { NotesList, Stats, SelectedItemDrawer } from './components';
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';

import './App.css';

const initialState = [
    { id: uuid(), text: 'Hello hello', bg: '#dfcec2' },
    { id: uuid(), text: 'Test' },
];

const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        add(state, { payload }) {
            state.push({ id: uuid(), text: payload });
        },
        deleteChecked(state) {
            return state.filter(i => !i.checked);
        },
        toggleItem(state, { payload }) {
            const item = state.find(i => i.id === payload.id);
            if (item) {
                item.checked = !item.checked;
            }
        },
        changeText(state, { payload }) {
            const item = state.find(i => i.id === payload.id);
            if (item) {
                item.text = payload.text;
            }
        },
        changeColor(state, { payload }) {
            const item = state.find(i => i.id === payload.id);
            if (item) {
                item.bg = payload.color;
            }
        },
    },
});

const editorSlice = createSlice({
    name: 'selected',
    initialState: false,
    reducers: {
        setSelected(state, { payload }) {
            return payload;
        },
    },
    extraReducers: {
        [itemsSlice.actions.changeText]: function (state, { payload }) {
            if (state && state.id === payload.id) {
                state.text = payload.text;
            }
        },
        [itemsSlice.actions.changeColor]: function (state, { payload }) {
            if (state && state.id === payload.id) {
                state.bg = payload.color;
            }
        },
    },
});

const store = configureStore({
    reducer: { selected: editorSlice.reducer, items: itemsSlice.reducer },
});

const List = () => {
    const { items, selected } = useSelector(state => ({
        items: state.items,
        selected: state.selected,
    }));
    const dispatch = useDispatch();
    return (
        <div className="App">
            <NotesList
                items={items}
                onAdd={text => dispatch(itemsSlice.actions.add(text))}
                onDelete={() => dispatch(itemsSlice.actions.deleteChecked())}
                onSelect={item =>
                    dispatch(editorSlice.actions.setSelected(item))
                }
                onToggle={item => dispatch(itemsSlice.actions.toggleItem(item))}
            />
            <Stats items={items} />
            <SelectedItemDrawer
                selected={selected}
                onTextChange={text =>
                    dispatch(
                        itemsSlice.actions.changeText({ id: selected.id, text })
                    )
                }
                onColorChange={color =>
                    dispatch(
                        itemsSlice.actions.changeColor({
                            id: selected.id,
                            color,
                        })
                    )
                }
                onClose={() => dispatch(editorSlice.actions.setSelected(false))}
            />
        </div>
    );
};

function App() {
    return (
        <Provider store={store}>
            <List />
        </Provider>
    );
}

export default App;
