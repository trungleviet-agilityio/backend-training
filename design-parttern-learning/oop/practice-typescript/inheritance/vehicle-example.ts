// Inheritance Example: Vehicle Domain
// Demonstrates inheritance with vehicles

class Vehicle {
  constructor(protected brand: string) {}
  move(): void {
    console.log(`${this.brand} vehicle is moving.`);
  }
}

class Car extends Vehicle {
  move(): void {
    console.log(`${this.brand} car is driving on the road.`);
  }
}

class Bike extends Vehicle {
  move(): void {
    console.log(`${this.brand} bike is cycling on the path.`);
  }
}

const honda = new Car('Honda');
const trek = new Bike('Trek');
honda.move(); // Honda car is driving on the road.
trek.move();  // Trek bike is cycling on the path.
