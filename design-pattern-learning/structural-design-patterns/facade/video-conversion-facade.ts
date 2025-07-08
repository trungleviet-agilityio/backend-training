/**
 * Video Conversion Facade Pattern Example
 *
 * This demonstrates how a Facade can simplify complex video conversion
 * operations by providing a simple interface to a complex video framework.
 */

// Complex subsystem classes
export class VideoFile {
  constructor(private filename: string) {
    console.log(`Loading video file: ${filename}`);
  }

  getFilename(): string {
    return this.filename;
  }
}

export class CodecFactory {
  static extract(file: VideoFile): string {
    console.log("Extracting codec from video file");
    const filename = file.getFilename();
    if (filename.endsWith('.mp4')) return 'h264';
    if (filename.endsWith('.avi')) return 'mpeg';
    if (filename.endsWith('.ogg')) return 'ogg';
    return 'unknown';
  }
}

export class MPEG4CompressionCodec {
  compress(): void {
    console.log("Compressing with MPEG4 codec");
  }
}

export class OggCompressionCodec {
  compress(): void {
    console.log("Compressing with Ogg codec");
  }
}

export class BitrateReader {
  static read(filename: string, codec: string): string {
    console.log(`Reading bitrate with ${codec} codec`);
    return "compressed_data";
  }

  static convert(buffer: string, codec: any): string {
    console.log("Converting bitrate");
    return "converted_data";
  }
}

export class AudioMixer {
  fix(result: string): string {
    console.log("Fixing audio");
    return "final_result";
  }
}

// Facade class
export class VideoConverter {
  convert(filename: string, format: string): string {
    console.log(`Converting ${filename} to ${format}`);

    const file = new VideoFile(filename);
    const sourceCodec = CodecFactory.extract(file);

    let destinationCodec;
    if (format === "mp4") {
      destinationCodec = new MPEG4CompressionCodec();
    } else {
      destinationCodec = new OggCompressionCodec();
    }

    const buffer = BitrateReader.read(filename, sourceCodec);
    let result = BitrateReader.convert(buffer, destinationCodec);
    result = new AudioMixer().fix(result);

    console.log(`Conversion completed: ${filename} -> ${format}`);
    return result;
  }

  convertBatch(files: Array<{filename: string, format: string}>): string[] {
    console.log(`--- Batch converting ${files.length} files ---`);
    const results: string[] = [];

    for (const file of files) {
      const result = this.convert(file.filename, file.format);
      results.push(result);
    }

    console.log("Batch conversion completed");
    return results;
  }
}

// Demo function
export function demonstrateVideoConversionFacade(): void {
  console.log("=== Video Conversion Facade Demo ===\n");

  const converter = new VideoConverter();

  // Single conversion
  const result1 = converter.convert("youtubevideo.ogg", "mp4");
  console.log(`Result: ${result1}\n`);

  // Batch conversion
  const files = [
    { filename: "video1.avi", format: "mp4" },
    { filename: "video2.ogg", format: "mp4" },
    { filename: "video3.mpeg", format: "ogg" }
  ];

  const results = converter.convertBatch(files);
  console.log(`Batch results: ${results.length} files converted\n`);
}
