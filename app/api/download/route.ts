import { NextRequest, NextResponse } from "next/server";
import ytdl from "ytdl-core";
import { Readable } from "stream";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || !ytdl.validateURL(url)) {
      return NextResponse.json(
        { error: "Por favor, insira uma URL válida." },
        { status: 400 }
      );
    }

    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[<>:"/\\|?*]+/g, "");
    const filename = `${title}.mp4`;

    let format = ytdl.chooseFormat(info.formats, {
      quality: "highestvideo",
      filter: (format) =>
        format.hasAudio && format.hasVideo && format.container === "mp4",
    });

    if (!format || !format.hasAudio) {
      const videoFormat = ytdl.chooseFormat(info.formats, {
        quality: "highestvideo",
        filter: (format) =>
          !format.hasAudio && format.hasVideo && format.container === "mp4",
      });

      const audioFormat = ytdl.chooseFormat(info.formats, {
        quality: "highestaudio",
        filter: (format) => format.hasAudio && !format.hasVideo,
      });

      if (!videoFormat || !audioFormat) {
        return NextResponse.json(
          {
            error:
              "Não foi possível encontrar um formato adequado para o vídeo.",
          },
          { status: 400 }
        );
      }
      format = videoFormat;
    }

    const videoStream = ytdl.downloadFromInfo(info, { format });

    const chunks = [];
    for await (const chunk of Readable.from(videoStream)) {
      chunks.push(chunk);
    }
    const videoBuffer = Buffer.concat(chunks);

    return new NextResponse(videoBuffer, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(
          filename
        )}"`,
        "Content-Length": `${videoBuffer.length}`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro Interno do Servidor" },
      { status: 500 }
    );
  }
}

export const config = {
  runtime: "experimental-edge",
};
