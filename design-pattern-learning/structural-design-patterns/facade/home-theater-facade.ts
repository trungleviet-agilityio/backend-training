/**
 * Home Theater Facade Pattern Example
 *
 * This demonstrates how a Facade can simplify complex home theater
 * operations by providing a simple interface to multiple devices.
 */

// Complex subsystem classes
export class Amplifier {
  on(): void {
    console.log("Amplifier is on");
  }

  off(): void {
    console.log("Amplifier is off");
  }

  setVolume(level: number): void {
    console.log(`Amplifier volume set to ${level}`);
  }
}

export class Tuner {
  on(): void {
    console.log("Tuner is on");
  }

  off(): void {
    console.log("Tuner is off");
  }

  setFrequency(frequency: number): void {
    console.log(`Tuner frequency set to ${frequency}`);
  }
}

export class DvdPlayer {
  on(): void {
    console.log("DVD Player is on");
  }

  off(): void {
    console.log("DVD Player is off");
  }

  play(movie: string): void {
    console.log(`DVD Player playing: ${movie}`);
  }

  stop(): void {
    console.log("DVD Player stopped");
  }
}

export class CdPlayer {
  on(): void {
    console.log("CD Player is on");
  }

  off(): void {
    console.log("CD Player is off");
  }

  play(cd: string): void {
    console.log(`CD Player playing: ${cd}`);
  }

  stop(): void {
    console.log("CD Player stopped");
  }
}

export class Projector {
  on(): void {
    console.log("Projector is on");
  }

  off(): void {
    console.log("Projector is off");
  }

  setInput(input: string): void {
    console.log(`Projector input set to ${input}`);
  }
}

export class TheaterLights {
  dim(level: number): void {
    console.log(`Theater lights dimmed to ${level}%`);
  }

  on(): void {
    console.log("Theater lights are on");
  }
}

export class Screen {
  down(): void {
    console.log("Screen is down");
  }

  up(): void {
    console.log("Screen is up");
  }
}

export class PopcornPopper {
  on(): void {
    console.log("Popcorn popper is on");
  }

  off(): void {
    console.log("Popcorn popper is off");
  }

  pop(): void {
    console.log("Popcorn popper popping popcorn");
  }
}

// Facade class
export class HomeTheaterFacade {
  private amplifier: Amplifier;
  private tuner: Tuner;
  private dvd: DvdPlayer;
  private cd: CdPlayer;
  private projector: Projector;
  private lights: TheaterLights;
  private screen: Screen;
  private popper: PopcornPopper;

  constructor() {
    this.amplifier = new Amplifier();
    this.tuner = new Tuner();
    this.dvd = new DvdPlayer();
    this.cd = new CdPlayer();
    this.projector = new Projector();
    this.lights = new TheaterLights();
    this.screen = new Screen();
    this.popper = new PopcornPopper();
  }

  watchMovie(movie: string): void {
    console.log("--- Getting ready to watch a movie ---");
    this.popper.on();
    this.popper.pop();
    this.lights.dim(10);
    this.screen.down();
    this.projector.on();
    this.projector.setInput("DVD");
    this.amplifier.on();
    this.amplifier.setVolume(5);
    this.dvd.on();
    this.dvd.play(movie);
    console.log("Movie theater mode activated");
  }

  endMovie(): void {
    console.log("--- Shutting movie theater down ---");
    this.popper.off();
    this.lights.on();
    this.screen.up();
    this.projector.off();
    this.amplifier.off();
    this.dvd.stop();
    this.dvd.off();
    console.log("Movie theater mode deactivated");
  }

  listenToCd(cd: string): void {
    console.log("--- Getting ready to listen to CD ---");
    this.lights.on();
    this.amplifier.on();
    this.amplifier.setVolume(4);
    this.cd.on();
    this.cd.play(cd);
    console.log("CD listening mode activated");
  }

  endCd(): void {
    console.log("--- Shutting CD down ---");
    this.amplifier.off();
    this.cd.stop();
    this.cd.off();
    console.log("CD listening mode deactivated");
  }

  listenToRadio(frequency: number): void {
    console.log("--- Getting ready to listen to radio ---");
    this.tuner.on();
    this.tuner.setFrequency(frequency);
    this.amplifier.on();
    this.amplifier.setVolume(3);
    console.log("Radio listening mode activated");
  }

  endRadio(): void {
    console.log("--- Shutting radio down ---");
    this.tuner.off();
    this.amplifier.off();
    console.log("Radio listening mode deactivated");
  }
}

// Demo function
export function demonstrateHomeTheaterFacade(): void {
  console.log("=== Home Theater Facade Demo ===\n");

  const homeTheater = new HomeTheaterFacade();

  // Watch a movie
  homeTheater.watchMovie("The Matrix");
  console.log();

  // End the movie
  homeTheater.endMovie();
  console.log();

  // Listen to CD
  homeTheater.listenToCd("Greatest Hits");
  console.log();

  // End CD
  homeTheater.endCd();
  console.log();

  // Listen to radio
  homeTheater.listenToRadio(101.5);
  console.log();

  // End radio
  homeTheater.endRadio();
  console.log();
}
