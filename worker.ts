import { choice, randrange, zeros } from "./utils";


onmessage = function (e) {
    let [lattice_size, cluster_size, config] = e.data;

    let padding = 2;
    let lattice = zeros(lattice_size + padding, lattice_size + padding);
    let color_scale = Math.max(10, 0.005 * cluster_size);


    const bottom = {
        seed: function () {
            let x = lattice_size / 2;
            let y = lattice_size - 2;
            return [x, y];
        },
        new: function () {
            let x = randrange(1, lattice[0].length - 2);
            let y = 10;
            return [x, y];
        },
    };

    const middle = {
        seed: function () {
            let x = lattice_size / 2;
            return [x, x];
        },
        new: function () {
            let x, y;
            if (Math.random() < 0.5) {
                // top and bottom
                x = randrange(1, lattice[0].length - 2);
                if (Math.random() < 0.5) {
                    y = 10;
                } else {
                    y = lattice[1].length - 10;
                }
            } else {
                // left and right
                y = randrange(1, lattice[0].length - 2);
                if (Math.random() < 0.5) {
                    x = 10;
                } else {
                    x = lattice[1].length - 10;
                }
            }
            return [x, y];
        }
    };


    let c = {"bottom": bottom, "middle": middle}[config];

    let [seed_x, seed_y] = c["seed"]();
    lattice[seed_x][seed_y] = 1;
    let num_particles = 1;

    sendMessage(seed_x, seed_y, 0);

    function walk(lattice, num_particles) {
        // add a random walker to the lattice
        let steps = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        let [x, y] = c["new"]();
        let walking = true;
        while (walking) {
            let [dx, dy] = choice(steps);
            x = x + dx;
            y = y + dy;
            if (x > lattice.length - 2 || x < 1 || y < 1 || y > lattice[0].length - 2) {
                walking = false;
            } else if (lattice[x+1][y] == 1 || lattice[x-1][y] == 1 ||
                       lattice[x][y+1] == 1 || lattice[x][y-1] == 1) {
                lattice[x][y] = 1;
                num_particles++;
                walking = false;
                sendMessage(x, y, (num_particles / color_scale) % 360);
            }
        }
        return [lattice, num_particles];
    }

    while (num_particles < cluster_size) {
        [lattice, num_particles] = walk(lattice, num_particles);
    }
}

function sendMessage(x: number, y: number, hue: number) {
    postMessage([x, y, hue]);
}
