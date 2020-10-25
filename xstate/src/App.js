import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { NotesList, Stats, SelectedItemDrawer } from './components';
import { createMachine, assign, sendParent, spawn } from "xstate";
import { useMachine } from "@xstate/react";

import './App.css';

export const createNOTEMachine = ({ id, text, checked }) =>
    createMachine(
        {
            id: "NOTE",
            initial: "reading",
            context: {
                id,
                text,
                prevtext: text,
                checked
            },
            on: {
                TOGGLE_CHECK: {
                    actions: [
                        assign({ checked: true }),
                        sendParent((context) => ({ type: "NOTE.COMMIT", NOTE: context }))
                    ]
                },
            },
            states: {
                reading: {
                    on: {
                        TOGGLE_CHECK: {
                            actions: [
                                assign({ checked: (context) => !context.checked }),
                                "commit"
                            ]
                        },
                        EDIT: {
                            target: "editing",
                        }
                    }
                },
                editing: {
                    entry: assign({ prevtext: (context) => context.text }),
                    on: {
                        CHANGE_COLOR: {
                            actions: [
                                assign({
                                    bg: (_, event) => event.value
                                }),
                                sendParent((context) => ({
                                    type: "NOTE.COMMIT",
                                    NOTE: context
                                }))
                            ]
                        },
                        CHANGE_TEXT: {
                            actions: [
                                assign({
                                    text: (_, event) => event.value
                                }),
                                sendParent((context) => ({
                                    type: "NOTE.COMMIT",
                                    NOTE: context
                                }))
                            ]
                        },
                        BLUR: {
                            target: "reading",
                            actions: sendParent((context) => ({
                                type: "NOTE.COMMIT",
                                NOTE: context
                            }))
                        },
                    }
                },
            }
        },
        {
            actions: {
                commit: sendParent((context) => ({
                    type: "NOTE.COMMIT",
                    NOTE: context
                })),
                focusInput: () => { }
            }
        }
    );


const createNOTE = (text) => {
    return {
        id: uuid(),
        text,
        checked: false
    };
};

export const itemsMachine = createMachine({
    id: "items",
    context: {
        items: [],
        selected: undefined,
    },
    initial: "ready",
    states: {
        ready: {}
    },
    on: {
        "NEWNOTE.COMMIT": {
            actions: [
                assign({
                    NOTE: "", // clear NOTE
                    items: (context, event) => {
                        const NEWNOTE = createNOTE(event.value.trim());
                        return context.items.concat({
                            ...NEWNOTE,
                            ref: spawn(createNOTEMachine(NEWNOTE))
                        });
                    }
                }),
            ],
            cond: (_, event) => event.value.trim().length
        },
        "NOTE.COMMIT": {
            actions: [
                assign({
                    items: (context, event) =>
                        context.items.map((NOTE) => {
                            return NOTE.id === event.NOTE.id
                                ? { ...NOTE, ...event.NOTE, ref: NOTE.ref }
                                : NOTE;
                        })
                }),
            ]
        },
        CLEAR_CHECKED: {
            actions: assign({
                items: (context) => context.items.filter((NOTE) => !NOTE.checked)
            })
        },
        SET_SELECTED: {
            actions: assign({
                selected: (context, event) => { console.log('asd', event); return event.item }
            })
        }
    }
});

function App() {
    const [state, send] = useMachine(itemsMachine, { devTools: true });
    const { items, selected } = state.context;
    return (
        <div className="App">
            <NotesList
                items={items}
                onAdd={text =>
                    send({ type: "NEWNOTE.COMMIT", value: text, id: uuid() })
                }
                onDelete={() =>
                    send({ type: "CLEAR_CHECKED" })
                }
                onSelect={item => send({ type: "SET_SELECTED", item })}
            />
            <Stats items={items} />
            { selected && <SelectedItemDrawer
                selected={selected}
                onClose={() => send({ type: "SET_SELECTED" })}
            />}
        </div>
    );
}

export default App;
