"use client";

import React from "react";

// Add custom keyframes and animations
const customStyles = `
  @keyframes spin-slow {
    0% { transform: rotate(0deg) translateX(0) translateY(0); }
    25% { transform: rotate(90deg) translateX(5px) translateY(-5px); }
    50% { transform: rotate(180deg) translateX(0) translateY(0); }
    75% { transform: rotate(270deg) translateX(-5px) translateY(5px); }
    100% { transform: rotate(360deg) translateX(0) translateY(0); }
  }
  
  @keyframes spin-slow-reverse {
    0% { transform: rotate(0deg) translateX(0) translateY(0); }
    25% { transform: rotate(-90deg) translateX(-5px) translateY(-5px); }
    50% { transform: rotate(-180deg) translateX(0) translateY(0); }
    75% { transform: rotate(-270deg) translateX(5px) translateY(5px); }
    100% { transform: rotate(-360deg) translateX(0) translateY(0); }
  }
  
  .animate-spin-slow {
    animation: spin-slow 12s ease-in-out infinite;
  }
  
  .animate-spin-slow-reverse {
    animation: spin-slow-reverse 12s ease-in-out infinite;
  }

  @keyframes trail {
    to { offset-distance: 100%; }
  }
  
  .trail {
    position: absolute;
    width: 40px;
    height: 2px;
    background-color: #8b5cf6;
    filter: blur(3px);
    border-radius: 2px;
    box-shadow: 0 0 8px 1px rgba(139, 92, 246, 0.8);
    offset-path: border-box;
    offset-anchor: 100% 50%;
    animation: trail 6s infinite linear;
  }

  @keyframes openRight {
    0% { width: 0; height: 0; }
    50% { width: 50%; height: 0; }
    100% { width: 50%; height: 100%; }
  }
  
  @keyframes openLeft {
    0% { width: 0; height: 0; }
    50% { width: 50%; height: 0; }
    100% { width: 50%; height: 100%; }
  }
  
  @keyframes openBottom {
    0% { width: 0; }
    100% { width: 50%; }
  }

  .button-container {
    position: relative;
    width: 100%;
    height: 60px;
    border: 2px solid transparent;
    border-radius: 0.375rem;
    overflow: visible;
  }
  
  .border-top-left {
    position: absolute;
    top: -2px;
    right: 50%;
    height: 0;
    width: 0;
    border-top: 2px solid rgb(216, 180, 254);
    border-left: 2px solid rgb(216, 180, 254);
    border-top-left-radius: 0.375rem;
    opacity: 0;
    transition: opacity 0.1s;
  }
  
  .border-top-right {
    position: absolute;
    top: -2px;
    left: 50%;
    height: 0;
    width: 0;
    border-top: 2px solid rgb(216, 180, 254);
    border-right: 2px solid rgb(216, 180, 254);
    border-top-right-radius: 0.375rem;
    opacity: 0;
    transition: opacity 0.1s;
  }
  
  .border-bottom-left {
    position: absolute;
    bottom: -2px;
    left: 0;
    height: 60px;
    width: 0;
    border-bottom: 2px solid rgb(216, 180, 254);
    border-left: 0;
    border-bottom-left-radius: 0.375rem;
    opacity: 0;
    transition: opacity 0.1s;
  }
  
  .border-bottom-right {
    position: absolute;
    bottom: -2px;
    right: 0;
    height: 60px;
    width: 0;
    border-bottom: 2px solid rgb(216, 180, 254);
    border-right: 0;
    border-bottom-right-radius: 0.375rem;
    opacity: 0;
    transition: opacity 0.1s;
  }
  
  .button-container:hover .border-top-left,
  .button-container:hover .border-top-right {
    opacity: 1;
    animation: openLeft 0.4s cubic-bezier(0.39, 0.575, 0.565, 1) forwards;
  }
  
  .button-container:hover .border-bottom-left,
  .button-container:hover .border-bottom-right {
    opacity: 1;
    animation: openBottom 0.4s cubic-bezier(0.39, 0.575, 0.565, 1) forwards;
    animation-delay: 0.4s;
  }
  
  .button-container:hover .border-top-right {
    animation-name: openRight;
  }
`;

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-normal mb-4">
            <span className="text-white">
              An LLM <span className="font-bold">marketplace</span>
            </span>
            <br />
            <span className="text-purple-300">
              to <span className="font-bold">fine-tune</span> models
            </span>
          </h1>
          <p className="text-gray-400 text-xl">
            Search and post jobs with the code abstracted away
          </p>
        </div>

        {/* Buttons container */}
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-lg">
          <div className="button-container w-full">
            <div className="border-top-left"></div>
            <div className="border-top-right"></div>
            <div className="border-bottom-left"></div>
            <div className="border-bottom-right"></div>
            <button className="relative w-full h-full py-4 px-6 bg-black text-white border border-gray-800 rounded-md transition-colors duration-300 text-lg font-medium z-10 cursor-pointer text-center flex items-center justify-center">
              Trainer
            </button>
          </div>

          <div className="button-container w-full">
            <div className="border-top-left"></div>
            <div className="border-top-right"></div>
            <div className="border-bottom-left"></div>
            <div className="border-bottom-right"></div>
            <button className="relative w-full h-full py-4 px-6 bg-black text-white border border-gray-800 rounded-md transition-colors duration-300 text-lg font-medium z-10 cursor-pointer text-center flex items-center justify-center">
              Client
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
//           <li className="mb-2 tracking-[-.01em]">
//             Get started by editing{" "}
//             <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
//               src/app/page.tsx
//             </code>
//             .
//           </li>
//           <li className="tracking-[-.01em]">
//             Save and see your changes instantly.
//           </li>
//         </ol>

//         <div className="flex gap-4 items-center flex-col sm:flex-row">
//           <a
//             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }
