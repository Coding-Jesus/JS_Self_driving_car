// This is a class that provides utility functions for visualizing a neural network.
class Visualizer {
    // This is a static method that takes in a canvas context, a neural network object, and
    // draws the network on the canvas.
    static drawNetwork(ctx, network) {
        // Set the margin around the edge of the canvas.
        const margin = 50;
        // Calculate the left and top positions of the network within the canvas.
        const left = margin;
        const top = margin;
        // Calculate the width and height of the network within the canvas.
        const width = ctx.canvas.width - margin * 2;
        const height = ctx.canvas.height - margin * 2;
        // Calculate the height of each level of the network.
        const levelHeight = height / network.levels.length;
        // Loop through the levels of the network from top to bottom.
        for (let i = network.levels.length - 1; i >= 0; i--) {
            // Calculate the top position of the current level within the canvas.
            const levelTop = top + lerp(
                height - levelHeight,
                0,
                network.levels.length == 1
                    ? 0.5
                    : i / (network.levels.length - 1)
            );
            // Draw the current level of the network.
            // Set the line dash pattern to dotted lines.
            ctx.setLineDash([7, 3]);
            Visualizer.drawLevel(ctx, network.levels[i],
                left, levelTop,
                width, levelHeight,
                // If this is the first level, draw icons to represent the input neurons.
                i == network.levels.length - 1
                    ? ['🠉', '🠈', '🠊', '🠋']
                    : []
            );
        }
    }

    // This is a static method that takes in a canvas context, a level object from a neural network,
    // and draws the level on the canvas.
    static drawLevel(ctx, level, left, top, width, height, outputLabels) {
        // Calculate the right and bottom positions of the level within the canvas.
        const right = left + width;
        const bottom = top + height;
        // Destructure the inputs, outputs, weights, and biases of the level object.
        const { inputs, outputs, weights, biases } = level;
        // Loop through the input and output neurons of the level.
        for (let i = 0; i < inputs.length; i++) {
            for (let j = 0; j < outputs.length; j++) {
                // Draw a line between the current input and output neurons.
                ctx.beginPath();
                ctx.moveTo(
                    // Calculate the x position of the current input neuron.
                    Visualizer.#getNodeX(inputs, i, left, right),
                    bottom
                );
                ctx.lineTo(
                    // Calculate the x position of the current output neuron.
                    Visualizer.#getNodeX(outputs, j, left, right),
                    top
                );
                // Set the line width and stroke style.
                ctx.lineWidth = 2;
                ctx.strokeStyle = getRGBA(weights[i][j]);
                ctx.stroke();
            }
        }

        const nodeRadius = 18;
        // Loop through the input neurons of the level.
        for (let i = 0; i < inputs.length; i++) {
            // Calculate the x position of the current input neuron.
            const x = Visualizer.#getNodeX(inputs, i, left, right);
            // Draw the outer circle of the input neuron.
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();
            // Draw the inner circle of the input neuron.
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
            // Set the fill style to the activation value of the input neuron.
            ctx.fillStyle = getRGBA(inputs[i]);
            ctx.fill();
        }

        for (let i = 0; i < outputs.length; i++) {
            // Calculate the x position of the current output node
            const x = Visualizer.#getNodeX(outputs, i, left, right);

            // Draw the outer circle for the node
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();

            // Draw the inner circle for the node
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(outputs[i]);
            ctx.fill();

            // Draw the dashed arc for the node
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
            ctx.strokeStyle = getRGBA(biases[i]);
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);

            if (outputLabels[i]) {
                // Draw the label for the current output node
                ctx.beginPath();
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "black";
                ctx.strokeStyle = "white";
                ctx.font = (nodeRadius * 1.5) + "px Arial";
                ctx.fillText(outputLabels[i], x, top + nodeRadius * 0.1);
                ctx.lineWidth = 0.5;
                ctx.strokeText(outputLabels[i], x, top + nodeRadius * 0.1);
            }
        }
    }

    static #getNodeX(nodes, index, left, right) {
        // Calculate the x position of the node based on its index and the position of the left and right nodes
        return lerp(
            left,
            right,
            nodes.length == 1
                ? 0.5
                : index / (nodes.length - 1)
        );
    }
}