import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';

interface IUploadCSVFileProps {
    setCSFFileData: (fileData: any[]) => void;
}

export default function UploadCSVFile({setCSFFileData} : IUploadCSVFileProps) {
    const [csvFile, setCsvFile] = useState(null);
    const [csvFileName, setCsvFileName] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        setError('')
    }, []);
    
    const getUploadedFile = (e: any) => {
        setError('');
        let currentFile = e.target.files[0];
        if(currentFile.type === "application/vnd.ms-excel") {
            setCsvFile(currentFile);
            setCsvFileName(currentFile.name);
        }else {
            setError('file type not supported, only csv');
        }
    }

    const loadCSVFileData = () => {
        const file = csvFile;
        const reader = new FileReader();

        reader.onload = function(e) {
            const text: string | ArrayBuffer | null | undefined = e?.target?.result;
            text && generateArrayFromCSV(text as string);
        }

        file && reader.readAsText(file);
    }

    const generateArrayFromCSV = (str: string, delim=',') => {
        const headers = str.slice(0,str.indexOf('\n')).split(delim);
        const rows = str.slice(str.indexOf('\n')+1).split('\n');

        const newArray: any[] = rows.map( row => {
            const values = row.split(delim);
            const eachObject = headers.reduce((obj: any, header, i) => {
                obj[header] = values[i].replace('\r', '');
                return obj;
            }, {})
            return eachObject;
        })

        setCSFFileData(newArray);
    }

  return (
    <Box>
        <label htmlFor="upload-file">
            <input
                style={{ display: 'none' }}
                id="upload-file"
                name="upload-file"
                type="file"
                accept='.csv'
                onChange={getUploadedFile}
            />

            <Button color="primary" variant="outlined" component="span">
                select CSV file
            </Button>
            
            <span style={{color: 'crimson'}}> {error && error} </span>
            <span> {csvFileName && !error && csvFileName} </span>
        </label>
        <Button variant='contained' color="primary" sx={{ml:5}} onClick={loadCSVFileData}> Load Data </Button>
        </Box>
  );
}
