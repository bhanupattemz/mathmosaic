import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
const columns = [
    { field: 'id', headerName: 'Sl.No', width: 70 },
    {
        field: 'date',
        headerName: 'Date',
        width: 100,
    },
    {
        field: 'level',
        headerName: 'Level',
        width: 80,

    },
    {
        field: 'count',
        headerName: 'Count',
        width: 80,
    },
    {
        field: 'score',
        headerName: 'Score',
        width: 100,
    }

];


export default function DataGridDemo({ setGamesOpen, gamesOpen, gridKey }) {
    const [games, setGames] = React.useState([])
    React.useEffect(() => {
        setGames(JSON.parse(localStorage.getItem("games") || "[]").sort((a, b) => b.score - a.score))
    }, [gridKey])
    return (
        <Dialog open={gamesOpen} onClose={() => setGamesOpen(false)}>
            <DialogTitle>Player History</DialogTitle>
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={games && games.map((item, inx) => {
                        let date = new Date(item.date)
                        return {
                            id: inx + 1,
                            date: date.toLocaleString(),
                            level: `${item.size - 1}-(${item.size}*${item.size})`,
                            count: item.count,
                            score: item.score
                        }
                    })}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    pageSizeOptions={[5]}
                    disableRowSelectionOnClick
                />
            </Box>
        </Dialog>

    );
}
