import DownloadInput from "@/components/download-input";


export default function Home() {
  return (
    <main className="flex flex-col items-center bg-foreground min-h-screen px-4">
      <div className="flex flex-col items-center w-full gap-8 mt-40">
        
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-wide text-primary-foreground">Youtube Downloader</h1>
        </div>

        <DownloadInput />
      
      </div>
    </main>
  );
}
