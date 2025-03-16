

const leftRotate = (arr, n) => {
    if (!Array.isArray(arr) || arr.length === 0) return [];
    const len = arr.length;
    n = n % len; 

    return [...arr.slice(n), ...arr.slice(0, n)];
};

const solvePuzzle = (grid) => {
    const processedGrid = grid.map(piece => {
        let { data, rotations, url } = piece; 
        data = leftRotate(data, rotations);
        return { data, rotations: 0, url };
    });

    const size = Math.sqrt(processedGrid.length);
    const solution = Array(size).fill(null).map(() => Array(size).fill(null));
    const used = new Array(processedGrid.length).fill(false);

    const rotatePiece = (piece, times) => {
        let rotated = [...piece];
        for (let i = 0; i < times; i++) {
            rotated = [rotated[3], rotated[0], rotated[1], rotated[2]]; 
        }
        return rotated;
    };

    const isValid = (row, col, piece) => {
        if (row > 0 && solution[row - 1][col] !== null) {
            if (solution[row - 1][col].data[2] !== piece[0]) return false;
        }
        if (col > 0 && solution[row][col - 1] !== null) {
            if (solution[row][col - 1].data[1] !== piece[3]) return false;
        }
        return true;
    };

    const backtrack = (index) => {
        if (index === processedGrid.length) return true;
        let row = Math.floor(index / size);
        let col = index % size;

        for (let i = 0; i < processedGrid.length; i++) {
            if (used[i]) continue;
            for (let r = 0; r < 4; r++) {
                let rotatedPiece = rotatePiece(processedGrid[i].data, r);

                if (isValid(row, col, rotatedPiece)) {
                    solution[row][col] = {
                        data: rotatedPiece,
                        rotations: r, 
                        url: processedGrid[i].url, 
                    };
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

    const formattedSolution = solution.flat().map(piece => ({
        data: piece.data,
        rotations: piece.rotations, 
        url: piece.url,
    }));

    return formattedSolution;
};
const CheckSolution = (grid) => {
    if (!Array.isArray(grid) || grid.length === 0) {
        return false;
    }
    const size = Math.sqrt(grid.length);
    if (!Number.isInteger(size)) {
        return false;
    }

    const solution = [];
    for (let i = 0; i < size; i++) {
        solution.push(grid.slice(i * size, (i + 1) * size).map(item => item.data));
    }
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            let piece = solution[row][col];

            if (!Array.isArray(piece) || piece.length !== 4) {
                return false;
            }

            if (row < size - 1) {
                let bottomPiece = solution[row + 1][col];
                if (!Array.isArray(bottomPiece) || bottomPiece.length !== 4) return false;
                if (piece[2] !== bottomPiece[0]) return false;
            }

            if (col < size - 1) {
                let rightPiece = solution[row][col + 1];
                if (!Array.isArray(rightPiece) || rightPiece.length !== 4) return false;
                if (piece[1] !== rightPiece[3]) return false;
            }
        }
    }
    return true;
};

export { solvePuzzle, CheckSolution };