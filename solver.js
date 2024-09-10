function gcd(a, b) {
    return b ? gcd(b, a % b) : a;
}

function simplifySqrt(n) {
    let outside = 1;
    let inside = n;

    for (let i = 2; i * i <= inside; i++) {
        while (inside % (i * i) === 0) {
            inside /= i * i;
            outside *= i;
        }
    }

    return { outside, inside };
}

function simplifyFraction(numerator, denominator) {
    const divisor = gcd(numerator, denominator);
    return [numerator / divisor, denominator / divisor];
}

function formatRoot(realPart, discriminant, a) {
    const sqrtSimplified = simplifySqrt(Math.abs(discriminant));
    let sqrtPart = '';

    if (sqrtSimplified.inside === 1) {
        sqrtPart = `${sqrtSimplified.outside}`;
    } else if (sqrtSimplified.outside === 1) {
        sqrtPart = `√${sqrtSimplified.inside}`;
    } else {
        sqrtPart = `${sqrtSimplified.outside}√${sqrtSimplified.inside}`;
    }

    const fraction = simplifyFraction(2 * a, gcd(realPart * 2 * a, discriminant));
    const real = realPart / fraction[1];
    const imag = sqrtSimplified.inside !== 0 ? ` ± (${sqrtPart}/${fraction[1]})` : '';

    return `${real}${imag}`;
}

function solveQuadratic() {
    // Get input values
    const a = parseInput(document.getElementById('a').value);
    const b = parseInput(document.getElementById('b').value);
    const c = parseInput(document.getElementById('c').value);

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
        document.getElementById('results').innerHTML = '<p>Please enter valid numbers or expressions.</p>';
        clearChart();
        return;
    }

    let result = '';
    let explanation = '';

    if (a === 0) {
        explanation = 'The value of "a" cannot be zero. This is a linear equation, not quadratic.';
        document.getElementById('results').innerHTML = `<p class="explanation">${explanation}</p>`;
        clearChart();
        return;
    } else {
        const discriminant = b * b - 4 * a * c;

        if (discriminant > 0) {
            explanation = 'The discriminant is positive, so there are two distinct real roots.';
            const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
            result = `<p class="root">The roots are ${formatRoot(-b, discriminant, a)}</p>`;
            result += `<p class="explanation">The equation has two distinct real solutions.</p>`;
        } else if (discriminant === 0) {
            explanation = 'The discriminant is zero, so there is one real root.';
            const root = -b / (2 * a);
            result = `<p class="root">The root is ${root}.</p>`;
            result += `<p class="explanation">This is a repeated real solution.</p>`;
        } else {
            explanation = 'The discriminant is negative, so the roots are imaginary.';
            const realPart = -b / (2 * a);
            result = `<p class="root">The roots are ${formatRoot(realPart, discriminant, a)}.</p>`;
            result += `<p class="explanation">These are complex numbers with imaginary solutions.</p>`;
        }

        document.getElementById('results').innerHTML = `<h2>Results:</h2>${result}<p class="explanation">${explanation}</p>`;

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

    for (let x = -10; x <= 10; x += 0.1) {
        const y = a * x * x + b * x + c;
        chartData.labels.push(x.toFixed(1));
        chartData.datasets[0].data.push(y);
    }

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
