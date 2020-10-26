// Please don't pay attention to components, i implemented them really quickly just for test
// in this project we comparing the state management
import React, { useState } from 'react';
import 'rc-checkbox/assets/index.css';

import {
    F, Lens, bind, reactiveList
} from '@grammarly/focal'

import './components.css'

import { TransitionGroup, CSSTransition } from 'react-transition-group'; // ES6

export const ListToolbar = ({ model, onAdd, onDelete }) => {
    const [text, setText] = useState('');
    return (
        <F.div className="note-list-toolbar">
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

            <F.div
                hidden={model.items.view(items => {
                    const keys = Object.keys(items)
                    return keys.filter(k => items[k].checked).length === 0
                })}
                className="checked-items-container"
            >
                <F.button
                    className="checked-items-delete-btn"
                    onClick={onDelete}
                >
                    Delete ({model.items.view(items => {
                    const keys = Object.keys(items)
                    return keys.filter(k => items[k].checked).length
                })})
                    </F.button>
            </F.div>

        </F.div>
    );
};

export const Note = ({ item, onSelect, id }) => {
    const props = bind({
        checked:
            item.lens(Lens.create(x => x && x.checked), (v, x) => x && { ...x, checked: v }),

    });
    return (
        <F.div
            className="note-item"
            style={{ backgroundColor: item.view(i => i && i.bg) }}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    if (onSelect) {
                        onSelect(id);
                    }
                }

            }}
        >
            {item.view(i => i && i.text)}
            <F.div className={`checkbox-container ${props.checked ? 'checked' : ''}`}>
                <F.input type="checkbox"
                    {...props}
                    onChange={e => {
                        e.stopPropagation();
                        item.modify(i => ({ ...i, checked: !i.checked, }))
                    }}
                />
            </F.div>
        </F.div>
    );
}

export const Stats = ({ model = [] }) => {
    return (
        <F.div className="list-stats">
            {model.items.view(items => {
                const keys = Object.keys(items)
                const checked = keys.filter(k => items[k].checked).length;
                return `Total number of items: ${keys.length}`.concat(
                    checked ? `, selected: ${checked}` : ''
                )
            })}
        </F.div>
    );
};

export const SelectedNote = ({
    onClose,
    item,
}) => {
    return (
        <F.div className="selected-note-drawer">
            <F.textarea
                value={item.view(i => i && i.text)}
                onChange={e => {
                    item.modify(i => ({ ...i, text: e.target.value }))
                }}
                className="selected-note-text"
            >
            </F.textarea>
            <F.input
                className="selected-note-color-picker"
                type="color"
                value={item.view(i => i && i.bg)}
                onChange={e => {
                    item.modify(i => ({ ...i, bg: e.target.value }))
                }}
            />
            <button onClick={onClose}>Close</button>
        </F.div>
    );
}

export const NotesList = ({ model, onAdd, onDelete, onSelect }) => (
    <div className="notes-list">
        <ListToolbar
            onAdd={onAdd}
            model={model}
            onDelete={onDelete}
        />
        <F.div className="nodes-list-items">
            {reactiveList(
                model.items.view(x => Object.keys(x)),
                item => <Note
                    key={item}
                    id={item}
                    onSelect={onSelect}
                    item={model.items.lens(Lens.key(item))}
                />
            )}
        </F.div>
    </div>
);

export const SelectedItemDrawer = ({
    selected,
    onTextChange,
    onColorChange,
    onClose,
    itemsModel,
}) => (
        <TransitionGroup className="drawer-transition">
            <CSSTransition classNames="fade" timeout={330} component={null}>
                <F.div>
                    {
                        selected.view(v => {
                            if (!v) return null;
                            return (
                                <SelectedNote
                                    selected={selected}
                                    onTextChange={onTextChange}
                                    onColorChange={onColorChange}
                                    onClose={onClose}
                                    itemsModel={itemsModel}
                                    item={itemsModel.lens(Lens.key(v))}
                                />
                            )
                        })
                    }

                </F.div>
            </CSSTransition>
        </TransitionGroup>
    );
