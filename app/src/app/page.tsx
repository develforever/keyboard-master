'use client';

import Keyboard from "@/components/keyboard/Keyboard";
import ToTranscribe from "@/components/ToTranscribe";

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen justify-center bg-zinc-50 font-sans dark:bg-black p-4">
      <div >
        <ToTranscribe></ToTranscribe>
      </div>
      <div style={{ flex: "1 1 100%" }}>
        <Keyboard></Keyboard>
      </div>
    </div>
  );
}
