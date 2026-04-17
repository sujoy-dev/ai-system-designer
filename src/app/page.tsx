'use client';

import { useState } from "react";
import PromptInput from "@/components/PromptInput";
import LoadingState from "@/components/LoadingState";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      {isLoading ? (
        <LoadingState />
      ) : (
        <PromptInput onLoading={() => setIsLoading(true)} />
      )}
    </div>
  );
}
