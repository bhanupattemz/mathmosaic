import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'date',
        headerName: 'Date',
        width: 150,
    },
    {
        field: 'level',
        headerName: 'Level',
        width: 150,
        
    },
    {
        field: 'count',
        headerName: 'Count',
        width: 150,
    }

];


export default function DataGridDemo({ setGamesOpen, gamesOpen }) {
    const [games, setGames] = React.useState([])
    React.useEffect(() => {
        setGames(JSON.parse(localStorage.getItem("games")|| "[]") )
    }, [])
    return (
        <Dialog open={gamesOpen} onClose={() => setGamesOpen(false)}>
            <DialogTitle>Player History</DialogTitle>
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={games && games.map((item, inx) => {
                        return {
                            id: inx + 1,
                            date: item.date,
                            level: `${item.level}*${item.level}`,
                            count: item.count

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
