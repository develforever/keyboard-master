'use client';

import Keyboard from "@/components/keyboard/Keyboard";
import ToTranscribe from "@/components/ToTranscribe";
import ToWrite from "@/components/ToWrite";

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen justify-center bg-zinc-50 font-sans dark:bg-black">
      <div >
        <ToTranscribe></ToTranscribe>
      </div>
      <div >
        <ToWrite></ToWrite>
      </div>
      <div>
        <Keyboard></Keyboard>
      </div>
    </div>
  );
}
