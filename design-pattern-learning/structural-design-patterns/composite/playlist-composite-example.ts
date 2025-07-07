/**
 * Composite Pattern Example: Playlist Application (All-in-one file)
 *
 * Demonstrates a playlist system where a playlist can contain songs or other playlists.
 * Implements the Composite pattern in a single file for clarity and demo purposes.
 */

// ===== Interface =====
interface IComponent {
  play(): void;
  setPlaybackSpeed(speed: number): void;
  getName(): string;
}

// ===== Leaf: Song =====
class Song implements IComponent {
  public speed: number = 1; // Default playback speed

  constructor(public songName: string, public artist: string) {}

  play(): void {
    // play song
    console.log(`Playing "${this.songName}" by ${this.artist} at ${this.speed}x speed`);
  }

  setPlaybackSpeed(speed: number): void {
    // set playback speed
    this.speed = speed;
  }

  getName(): string {
    // get song name
    return this.songName;
  }

  getArtist(): string {
    // get artist name
    return this.artist;
  }
}

// ===== Composite: Playlist =====
class Playlist implements IComponent {
  public playlist: IComponent[] = [];

  constructor(public playlistName: string) {}

  play(): void {
    // play all songs/playlists in this playlist
    console.log(`Playing playlist: ${this.playlistName}`);
    for (const component of this.playlist) {
      component.play();
    }
  }

  setPlaybackSpeed(speed: number): void {
    // set playback speed for all songs/playlists in this playlist
    for (const component of this.playlist) {
      component.setPlaybackSpeed(speed);
    }
  }

  getName(): string {
    // get playlist name
    return this.playlistName;
  }

  add(component: IComponent): void {
    this.playlist.push(component);
  }

  remove(component: IComponent): void {
    const idx = this.playlist.indexOf(component);
    if (idx !== -1) {
      this.playlist.splice(idx, 1);
    }
  }
}

// ===== Demo (main) =====
// Make new empty "Study" playlist
const studyPlaylist = new Playlist("Study");

// Make "Synth Pop" playlist and add 2 songs to it.
const synthPopPlaylist = new Playlist("Synth Pop");
const synthPopSong1 = new Song("Girl Like You", "Toro Y Moi");
const synthPopSong2 = new Song("Outside", "TOPS");
synthPopPlaylist.add(synthPopSong1);
synthPopPlaylist.add(synthPopSong2);

// Make "Experimental" playlist and add 3 songs to it, then set playback speed to 0.5x
const experimentalPlaylist = new Playlist("Experimental");
const experimentalSong1 = new Song("About you", "XXYYXX");
const experimentalSong2 = new Song("Motivation", "Clams Casino");
const experimentalSong3 = new Song("Computer Vision", "Oneohtrix Point Never");
experimentalPlaylist.add(experimentalSong1);
experimentalPlaylist.add(experimentalSong2);
experimentalPlaylist.add(experimentalSong3);
const slowSpeed = 0.5;
experimentalPlaylist.setPlaybackSpeed(slowSpeed);

// Add the "Synth Pop" playlist to the "Experimental" playlist
experimentalPlaylist.add(synthPopPlaylist);

// Add the "Experimental" playlist to the "Study" playlist
studyPlaylist.add(experimentalPlaylist);

// Create a new song and set its playback speed to 1.25x, play this song, get the name and artist
const glitchSong = new Song("Textuell", "Oval");
const fasterSpeed = 1.25;
glitchSong.setPlaybackSpeed(fasterSpeed);
glitchSong.play();
const songName = glitchSong.getName();
const artist = glitchSong.getArtist();
console.log("The song name is " + songName);
console.log("The song artist is " + artist);

// Add glitchSong to the "Study" playlist
studyPlaylist.add(glitchSong);

// Play "Study" playlist.
studyPlaylist.play();

// Get the playlist name of studyPlaylist → "Study"
console.log("The Playlist's name is " + studyPlaylist.getName());
