"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, FormEvent } from "react";

export default function DownloadInput() {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = "downloaded_video.mp4"; // Ensure this matches the expected video format
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);

        setUrl("");
      } else {
        const error = await response.json();
        alert(error.error || "Não foi possível baixar o vídeo");
      }
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro, por favor tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full max-w-[40rem] justify-center md:flex-row gap-4"
    >
      <Input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Cole aqui a URL do vídeo"
        className="text-primary-foreground border border-muted-foreground focus-visible:border-2"
      />
      <Button type="submit" className="" variant="secondary" disabled={loading}>
        {loading ? "Carregando..." : "Download"}
      </Button>
    </form>
  );
}