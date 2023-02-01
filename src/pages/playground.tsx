import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import ReactCodeMirror from "@uiw/react-codemirror";
import { type NextPage } from "next";
import Head from "next/head";
import { useRef } from "react";
import { useCodeStore } from "../store/code";

const Playground: NextPage = () => {
  const code = useCodeStore();
  const persistInput = useRef(code.input);
  return (
    <>
      <Head>
        <title>Render To String Playground</title>
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          {"React "}
          <span className="text-[hsl(280,100%,70%)]">RenderToString</span>
          {" Playground"}
        </h1>
        <div className="w-screen grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 mt-6">
          <div className="flex items-center justify-center">
            <ReactCodeMirror
              value={persistInput.current || '// typing here...'}
              width="40vw"
              height="80vh"
              extensions={[javascript({ jsx: true })]}
              onChange={(input: string) => {
                console.log(input)
                void code.transform(input)
              }}
            />
          </div>
          <div className="flex items-center justify-center">
            <ReactCodeMirror
              value={code.output || '// waiting...'}
              width="40vw"
              height="80vh"
              extensions={[html()]}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Playground;
