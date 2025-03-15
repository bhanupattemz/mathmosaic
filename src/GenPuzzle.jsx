export default function Genpuzzle(gridSize) {
    const shiftNum = (n) => {
        const nums = [0, 1, 2, 3];
        return [...nums.slice(-n), ...nums.slice(0, -n)];
    };

    let data = Array.from({ length: gridSize }, (_, i) => i);
    const grid = [];

    while (data.length > 0) {
        const num = Math.floor(Math.random() * data.length);
        grid.push([data[num], shiftNum(Math.floor(Math.random() * 4) + 1)]);
        data.splice(num, 1);
    }

    return grid;
}
