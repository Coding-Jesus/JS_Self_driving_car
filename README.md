# Self-driving car - No libraries

This project is a simulation of a self-driving car using neural networks and simple physics. It uses vanilla JavaScript and the HTML5 canvas element, without any external libraries or frameworks.

## How it works

The car is controlled by a neural network that receives sensory input from its onboard sensors and outputs a decision on whether to turn left, turn right, or go straight. The network is trained to make decisions that avoid collisions with other objects on the road and stay within the boundaries of the road.

The car's sensors consist of a set of rays that are cast out from the front of the car. Each ray is associated with a sensor reading that represents the distance to the nearest object detected by the ray. The sensor readings are used as input to the neural network, which then outputs a decision on the next action to take.

The road and traffic objects are represented by arrays of coordinates that define their shapes. The car's sensors and the neural network use these coordinates to determine the positions of objects on the road and make decisions based on them.

To run the simulation, simply open the index.html file in a web browser. The car will start moving forward and using its sensors to avoid obstacles and stay within the borders of the road. You can also use the buttons on the right side of the screen to save or discard the current state of the car's neural network. The neural network is displayed on the left side of the screen, with lines between the neurons representing the weights of the connections. The colors of the lines indicate the strength of the weights, with red representing positive values and blue representing negative values. The car's sensors are displayed on the right side of the car, with the colors of the rays indicating the distances to obstacles.

I hope you enjoy playing around with this simple self-driving car simulation!

Special thanks to freecodecamp.org and Radu for the amazing tutorial.
