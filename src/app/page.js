"use client";
import Image from "next/image";
import { Provider } from "jotai";

export default function Home() {
  return (
    <Provider>
      <main className="flex min-h-screen flex-col items-center justify-between">
        <div className="text-green-500">Hello Presta Freedom</div>
      </main>
    </Provider>
  );
}
