const solvePuzzle = (grid) => {
    const size = Math.sqrt(grid.length);
    const solution = Array(size).fill(null).map(() => Array(size).fill(null));
    const used = new Array(grid.length).fill(false);

    const rotatePiece = (piece, times) => {
        let rotated = [...piece];
        for (let i = 0; i < times; i++) {
            rotated = [rotated[3], rotated[0], rotated[1], rotated[2]];
        }
        return rotated;
    };

    const isValid = (row, col, piece) => {
        if (row > 0 && solution[row - 1][col] !== null) {
            if (solution[row - 1][col][2] !== piece[0]) return false;
        }
        if (col > 0 && solution[row][col - 1] !== null) {
            if (solution[row][col - 1][1] !== piece[3]) return false;
        }
        return true;
    };

    const backtrack = (index) => {
        if (index === grid.length) return true;
        let row = Math.floor(index / size);
        let col = index % size;

        for (let i = 0; i < grid.length; i++) {
            if (used[i]) continue;
            for (let r = 0; r < 4; r++) {
                let rotatedPiece = rotatePiece(grid[i], r);

                if (isValid(row, col, rotatedPiece)) {
                    solution[row][col] = rotatedPiece;
                    used[i] = true;

                    if (backtrack(index + 1)) return true;

                    solution[row][col] = null;
                    used[i] = false;
                }
            }
        }
        return false;
    };

    if (!backtrack(0)) return null;

    return solution.flat();
};
const grid = [
    [1, 2, 3, 4],
    [3, 5, 2, 1],
    [4, 3, 1, 6],
    [2, 1, 4, 3],
    [6, 2, 5, 4],
    [5, 4, 3, 2],
    [1, 6, 2, 5],
    [2, 3, 4, 1],
    [3, 4, 5, 2]
];


console.log(solvePuzzle(grid))