"use client"
import { useState } from 'react';
import Papa from 'papaparse';

export default function Home() {
  const [file, setFile] = useState(null);
  const [idList, setIdList] = useState([]);
  const results = [];
  const [FinalARR, setFinalARR] = useState([]);

  

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    // Read the CSV file
    const reader = new FileReader();
    reader.onload = () => {
      parseCSV(reader.result);
    };
    reader.readAsText(selectedFile);
  };

  const parseCSV = (csvContent) => {
    const ids = [];

    // Use papaparse library to parse CSV content
    Papa.parse(csvContent, {
      header: false,
      skipEmptyLines: true,
      step: (result) => {
        const [id, action, time] = result.data;
        if (!ids.includes(id)) {
          ids.push(id);
        }
        results.push({ id, action, time });
      },
      complete: () => {
        setIdList(ids);
        fetchAttendance(ids);
        console.log('Parsed IDS:', ids);
        console.log('Parsed CSV:', results);
      },
    });
  };

  const fetchAttendance = async (ids) => {
    try {
      const response = await fetch('/api/getAttendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      });
  
      if (response) {
        const responseData = await response.json();
  
        if (responseData.success) {
          // Handle the successful response
          console.log(responseData.msg);
          
          // Access the details array and print it or process it as needed
          const details = responseData.details;
          console.log('Details:', details);
          mergeArray(results,details)
        } else {
          // Handle the case where the server indicates failure
          console.error('Failed to fetch attendance:', responseData.msg);
        }
      } else {
        // Handle other response statuses (e.g., 404 Not Found, 500 Internal Server Error)
        console.error('Failed to fetch attendance. Status:', response.status);
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error fetching attendance:', error);
    }
  };

  function mergeArray(attendanceArray,studentDetailsArray){
    const mergedArray = attendanceArray.map((attendance) => {
        const studentDetails = studentDetailsArray.find((student) => student.cardID === attendance.id);
      
        if (studentDetails) {
          return {
            cardID: studentDetails.cardID,
            name: studentDetails.name,
            class: studentDetails.class,
            contact: studentDetails.contact,
            action: attendance.action,
            time: attendance.time,
          };
        }
      
        return null;
      }).filter(Boolean);
      
      // Grouping actions by cardID
      const groupedByCardID = mergedArray.reduce((acc, entry) => {
        const { cardID, name, class: studentClass, contact, action, time } = entry;
      
        if (!acc[cardID]) {
          acc[cardID] = {
            cardID,
            name,
            class: studentClass,
            contact,
          };
        }
      
        // Combine login and logout times
        acc[cardID][action] = time;
      
        return acc;
      }, {});
      
      // Convert the grouped object to an array
      const finalArray = Object.values(groupedByCardID);
      setFinalARR(finalArray);
      console.log(finalArray);
  }




  return (
    <div className="p-4 ml-80 mt-20">
      <h1 className="text-2xl font-bold mb-4">CSV File Processor</h1>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-4"
      />

      {file && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Uploaded CSV</h2>
          <p>{file.name}</p>
        </div>
      )}

      {/* {idList.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mt-4 mb-2">Extracted IDs</h2>
          <pre>{JSON.stringify(idList, null, 2)}</pre>
        </div>

      )} */}

<div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="border-b px-4 py-2">Card ID</th>
            <th className="border-b px-4 py-2">Name</th>
            <th className="border-b px-4 py-2">Class</th>
            <th className="border-b px-4 py-2">Contact</th>
            <th className="border-b px-4 py-2">Login</th>
            <th className="border-b px-4 py-2">Logout</th>
          </tr>
        </thead>
        <tbody>
          {FinalARR.map((item) => (
            <tr key={item.cardID}>
              <td className="border-b px-4 py-2">{item.cardID}</td>
              <td className="border-b px-4 py-2">{item.name}</td>
              <td className="border-b px-4 py-2">{item.class}</td>
              <td className="border-b px-4 py-2">{item.contact}</td>
              <td className="border-b px-4 py-2">{item.Login}</td>
              <td className="border-b px-4 py-2">{item.Logout}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}
