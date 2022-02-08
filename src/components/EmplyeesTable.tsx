import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { IPairedEmployees } from 'App';

interface Column {
  id: 'firstEmployeeId' | 'secondEmployeeId' | 'projectId' | 'days';
  label: string;
}

interface IEmployeesTableProps {
  employeesListData: IPairedEmployees;
}

const columns: readonly Column[] = [
  { id: 'firstEmployeeId', label: 'Employee ID #1' },
  { id: 'secondEmployeeId', label: 'Employee ID #2' },
  { id: 'projectId', label: 'Project ID' },
  { id: 'days', label: 'Days worked' },
];

interface Data {
  firstEmployeeId: number;
  secondEmployeeId: number;
  projectId: number;
  days: number;
}

export default function EmplyeesTable({employeesListData} : IEmployeesTableProps) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [maxValue, setMaxValue] = React.useState(0);
  const [rows, setRows] = React.useState<Data[]>([]);

  React.useEffect(() => {
    createRecordsData(employeesListData);
  }, [employeesListData]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const createRecordsData = (list: IPairedEmployees) => {
    let rows: Data[] = [];
    let longestCommonPeriod = 0;

    for(let key in list) {
      if(list[key].pairs.length > 1) {
        let max = Math.max(longestCommonPeriod, list[key].workingDays);
        longestCommonPeriod = max;

        rows.push({
          firstEmployeeId: list[key].pairs[0],
          secondEmployeeId: list[key].pairs[1],
          projectId: +key, 
          days:  list[key].workingDays
        })
      }
    }
    
    setMaxValue(longestCommonPeriod);
    setRows(rows);
  }

  return (
    <Paper sx={{ width: '90%', mt: 5  }}>
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" 
                    tabIndex={-1} key={row.projectId} 
                    style={{background: maxValue === row.days ? '#5CEE67' : ''}}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
