import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { format, differenceInDays } from 'date-fns';
import EmplyeesTable from 'components/EmplyeesTable';
import UploadCSVFile from 'components/UploadCSVFile';
import { getWorkingDays } from 'components/utils/getWorkingDays';

export interface IPairedEmployees {
  [key: number]: {
    pairs: number[],
    workingDays: number
  }
};


function App() {
  const [employeesData, setEmployeesData] = useState<any[]>([]);
  const [pairsEmployees, setPairsEmployees] = useState<IPairedEmployees | {}>({});

  useEffect(() => {
    getPairedEmployees();
  }, [employeesData]);

  const getPairedEmployees = () => {
    let pairedEmployees: IPairedEmployees = {};

    employeesData?.forEach((e: any) => {
      let dateTo = !e.DateTo ? format(new Date(), 'yyyy-MM-dd') : e.DateTo;
      let currentWorkingDays = (pairedEmployees[e.ProjectID] && pairedEmployees[e.ProjectID].workingDays) || 0;

      if(pairedEmployees[e.ProjectID]) {
        pairedEmployees[e.ProjectID] = {
          pairs: [...pairedEmployees[e.ProjectID].pairs, e.EmpID],
          workingDays: +currentWorkingDays + getWorkingDays(e.DateFrom, dateTo)
        };
      } else {
        pairedEmployees[e.ProjectID] = {
          pairs: [e.EmpID],
          workingDays: getWorkingDays(e.DateFrom, dateTo)
        };
      }
    });

    setPairsEmployees(pairedEmployees);
  }

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', mt: 5}} >
      <Box>
        <UploadCSVFile setCSFFileData={(fileData) => setEmployeesData(fileData)} />
      </Box>
      <EmplyeesTable employeesListData={pairsEmployees} />
    </Box>
  );
}

export default App;
