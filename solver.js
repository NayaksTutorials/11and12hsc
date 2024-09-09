function parseInput(input) {
    try {
        // Replace 'sqrt' with 'Math.sqrt'
        input = input.replace(/sqrt\(([^)]+)\)/g, (match, p1) => `Math.sqrt(${p1})`);
        // Evaluate the expression
        return eval(input);
    } catch (error) {
        return NaN;
    }
}

function solveQuadratic() {
    // Get input values
    const a = parseInput(document.getElementById('a').value);
    const b = parseInput(document.getElementById('b').value);
    const c = parseInput(document.getElementById('c').value);

    // Validate inputs
    if (isNaN(a) || isNaN(b) || isNaN(c)) {
        document.getElementById('results').innerHTML = '<p>Please enter valid numbers or expressions.</p>';
        clearChart();
        return;
    }

    // Prepare result string
    let result = '';
    let explanation = '';

    // Check if a is zero to prevent division by zero
    if (a === 0) {
        explanation = 'The value of "a" cannot be zero. When a = 0, the equation becomes a linear equation of the form "bx + c = 0", not a quadratic equation.';
        document.getElementById('results').innerHTML = `<p class="explanation">${explanation}</p>`;
        clearChart();
        return;
    } else {
        // Compute discriminant
        const discriminant = b * b - 4 * a * c;

        // Provide detailed explanation based on the discriminant
        if (discriminant > 0) {
            explanation = 'The discriminant (b² - 4ac) is positive, indicating that there are two distinct real roots. This means the parabola intersects the x-axis at two different points.';
            const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
            result = `<p class="root">The roots are ${root1.toFixed(4)} and ${root2.toFixed(4)}.</p>`;
            result += `<p class="explanation">The equation has two distinct real solutions, and the graph of the quadratic function crosses the x-axis at these points.</p>`;
        } else if (discriminant === 0) {
            explanation = 'The discriminant (b² - 4ac) is zero, which means there is exactly one real root (a repeated root). The parabola touches the x-axis at exactly one point, which is the vertex of the parabola.';
            const root = -b / (2 * a);
            result = `<p class="root">The root is ${root.toFixed(4)}.</p>`;
            result += `<p class="explanation">This is the only solution, and the quadratic function has a double root, meaning the parabola just touches the x-axis without crossing it.</p>`;
        } else {
            explanation = 'The discriminant (b² - 4ac) is negative, indicating that the roots are complex (imaginary). This means the parabola does not intersect the x-axis at all and the solutions involve imaginary numbers.';
            const realPart = -b / (2 * a);
            const imaginaryPart = Math.sqrt(-discriminant) / (2 * a);
            result = `<p class="root">The roots are ${realPart.toFixed(4)} ± ${imaginaryPart.toFixed(4)}i.</p>`;
            result += `<p class="explanation">The quadratic function does not cross the x-axis and the roots are complex numbers. The term "i" represents the imaginary unit.</p>`;
        }

        // Display results
        document.getElementById('results').innerHTML = `<h2>Results:</h2>${result}<p class="explanation">${explanation}</p>`;

        // Plot the graph
        plotGraph(a, b, c);
    }
}

function plotGraph(a, b, c) {
    const ctx = document.getElementById('quadraticChart').getContext('2d');
    const chartData = {
        labels: [],
        datasets: [{
            label: 'Quadratic Function: ax² + bx + c',
            data: [],
            borderColor: '#C62828',
            backgroundColor: 'rgba(198, 40, 40, 0.2)',
            borderWidth: 2,
        }]
    };

    // Generate data points
    for (let x = -10; x <= 10; x += 0.1) {
        const y = a * x * x + b * x + c;
        chartData.labels.push(x.toFixed(1));
        chartData.datasets[0].data.push(y);
    }

    // Create the chart
    new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'x'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'y'
                    }
                }
            }
        }
    });
}

function clearChart() {
    const ctx = document.getElementById('quadraticChart').getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
