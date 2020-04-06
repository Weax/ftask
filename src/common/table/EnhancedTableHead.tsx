import React from 'react';
import { Theme, TableCell, Checkbox, TableRow, TableHead, TableSortLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Order, Data, HeadCell } from "./index";

const useStyles = makeStyles((theme: Theme) => ({
    cell: {
        fontWeight: 700
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    }
}));

interface HeadProps {
    order: Order,
    orderBy: keyof Data,
    numSelected: number,
    rowCount: number,
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
    headCells: HeadCell[],
    multiSelect: boolean
}

const EnhancedTableHead = ({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells, multiSelect }: HeadProps) => {
    const classes = useStyles();
    const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox" className={classes.cell}>
                    {multiSelect &&
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{ 'aria-label': 'select all' }}
                        />
                    }
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell className={classes.cell}
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default EnhancedTableHead;