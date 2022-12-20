const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

// Get the 2D rendering contexts for the car and network canvases
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

// Create a new Road object with its center at the middle of the car canvas and its width set to 90% of the car canvas width
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

// Generate an array of Car objects
const N = 100;
const cars = generateCars(N);

// Set the best car to the first element of the cars array
let bestCar = cars[0];

// If a "bestBrain" item is present in local storage, use it to create a new neural network for each car in the cars array (except the first one)
if (localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain"));
        if (i != 0) {
            // Mutate the neural networks of the other cars with a mutation rate of 10%
            NeuralNetwork.mutate(cars[i].brain, 0.1);
        }
    }
}

// Create an array of traffic cars that the player's car must avoid
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2, getRandomColor()),
];

// Start the simulation
animate();

// Save the neural network of the best car to local storage under the "bestBrain" item
function save() {
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

// Remove the "bestBrain" item from local storage
function discard() {
    localStorage.removeItem("bestBrain");
}

// Generate an array of Car objects
function generateCars(N) {
    const cars = [];
    for (let i = 1; i <= N; i++) {
        // Create a new Car object and place it in the center lane of the road
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
}

// Animate the simulation
function animate(time) {
    // Update the position and status of the traffic cars
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }

    // Update the position and status of the player's cars
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }

    // Find the car that has navigated the farthest distance without crashing
    bestCar = cars.find(
        c => c.y == Math.min(
            ...cars.map(c => c.y)
        ));

    // Set the height of the car and network canvases to the height of the window
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    // Save the current state of the car context and translate it to focus on the best car
    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

    // Draw the road and traffic cars on the car canvas
    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx);
    }

    // Draw the player's cars on the car canvas with reduced opacity
    carCtx.globalAlpha = 0.2;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx);
    }

    // Draw the best car on the car canvas with full opacity
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, true);

    // Restore the original state of the car context
    carCtx.restore();

    // Set the dash offset of the network context's line dash and draw the neural network of the best car on the network canvas
    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);

    // Request the next frame of the animation
    requestAnimationFrame(animate);
}
