import * as esbuild from 'esbuild-wasm';
import { format } from "prettier";
import parserHtml from "prettier/parser-html.js";
import React, { type ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

if (typeof window !== 'undefined') {
    window.React = React;
    void (async function () {
        if (window.__ESBUILD_INITED__) return;
        await esbuild.initialize({
            wasmURL: '/wasm/esbuild.wasm',
        })
        window.__ESBUILD_INITED__ = true;
    })()
}

interface CodeState {
    input: string
    output: string
    transform: (input: string) => Promise<void>
}
export const useCodeStore = create(
    persist<CodeState>(
        (set, get) => ({
            input: '',
            output: '',
            async transform(input: string) {
                try {
                    const result = await esbuild.transform(input, {
                        'loader': 'jsx',
                    })
                    // eslint-disable-next-line @typescript-eslint/no-implied-eval
                    const reactElement = new Function(`return ${result.code}`)() as ReactElement
                    const middleware = renderToString(reactElement);
                    const readable = format(middleware, { parser: 'html', plugins: [parserHtml] });
                    // const readable = format(result.code, { parser: 'babel', plugins: [parserBabel] });
                    set({
                        output: readable
                    })
                } catch (e) {
                    set({ output: `${e}` })
                }
            }
        }),
        {
            name: 'rtrts-code-storage', // unique name
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        }
    )
)
