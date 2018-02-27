// left fill with zero's
export function zfill(s: string, width: number) {
    return s.padStart(width, "0");
}

// string reversal
export function reverse(s) {
    return [...s].reverse().join("");
}

// generates random integers n: a <= n < b
export function randrange(a: number, b: number) {
    return a + Math.floor(Math.random() * (b - a));
}

// generates random integers n: a <= n <= b
export function randint(a: number, b: number) {
    return a + Math.floor(Math.random() * (b - a + 1))
}

// choose uniform element from an array
export function choice(s) {
    return s[randrange(0, s.length)];
}

export function range(a: number, b: number) {
    if (!b) {
        b = a;
        a = 0;
    }
    let x = Array(b - a);
    for (let i = 0; i < b - a; i++) {
        x[i] = a + i;
    }
    return x;
}

// generate x by y 2D array
export function zeros(x, y) {
    return new Array(x).fill(0).map(_ => Array(y).fill(0));
}
