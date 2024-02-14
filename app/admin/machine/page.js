"use client";
import { useState } from "react";
import Papa from "papaparse";

export default function Home() {
  const [file, setFile] = useState(null);
  const [idList, setIdList] = useState([]);
  const results = [];
  const [FinalARR, setFinalARR] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [DeviceIP, setDeviceIP] = useState("192.168.1");

  const searchQueryLowercase = searchQuery.toLowerCase();
  const filteredCards = FinalARR.filter(
    (card) =>
      card.name.toLowerCase().includes(searchQueryLowercase) ||
      card.class.toLowerCase().includes(searchQueryLowercase) ||
      card.contact.toLowerCase().includes(searchQueryLowercase)
  );

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    // Read the CSV file
    const reader = new FileReader();
    reader.onload = () => {
      parseCSV(reader.result);
      console.log("readerresult");
      console.log(reader.result);
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
        console.log("Parsed IDS:", ids);
        console.log("Parsed CSV:", results);
      },
    });
  };

  const fetchAttendance = async (ids) => {
    try {
      const response = await fetch("/api/getAttendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
          console.log("Details:", details);
          mergeArray(results, details);
        } else {
          // Handle the case where the server indicates failure
          console.error("Failed to fetch attendance:", responseData.msg);
        }
      } else {
        // Handle other response statuses (e.g., 404 Not Found, 500 Internal Server Error)
        console.error("Failed to fetch attendance. Status:", response.status);
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error fetching attendance:", error);
    }
  };

  const [Connecting, setConnecting] = useState(false);

  const connectToMachine = () => {
    setConnecting(true);
    getFileNames();
  };

  const getFileNames = async () => {
    try {
      const response = await fetch(`https://${DeviceIP}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response) {
        const data = await response.json();
        const fileNames = data
          .filter((item) => item.file)
          .map((item) => item.file);
        console.log(fileNames);
      } else {
        console.error("Failed to fetch attendance. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  function mergeArray(attendanceArray, studentDetailsArray) {
    const mergedArray = attendanceArray
      .map((attendance) => {
        const studentDetails = studentDetailsArray.find(
          (student) => student.cardID === attendance.id
        );

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
      })
      .filter(Boolean);

    // Grouping actions by cardID
    const groupedByCardID = mergedArray.reduce((acc, entry) => {
      const {
        cardID,
        name,
        class: studentClass,
        contact,
        action,
        time,
      } = entry;

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
    <div className="p-4 sm:ml-64 mt-14">
      <label
        for="default-search"
        class="mb-2 text-sm font-medium text-gray-900 sr-only"
      >
        Connexct
      </label>
      <div class="relative">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            class="w-4 h-4 text-gray-500 "
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          value={DeviceIP}
          onChange={(e) => {
            setDeviceIP(e.target.value);
          }}
          id="default-search"
          class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="192.168.1.X"
          required
        />
        <a
          href={`http://${DeviceIP}`}
          class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
        >
          Connect
        </a>
      </div>

      <div className="mt-5">
        <p class="mb-3 text-gray-500 dark:text-gray-700">
          1. Turn on your hotspot and choose mode 2 on the machine.
        </p>
        <p class="mb-3 text-gray-500 dark:text-gray-700">
          2. Wait for the machine to connect to your hotspot; it will show a
          code.
        </p>
        <p class="mb-3 text-gray-500 dark:text-gray-700">
          3. Enter that code in the box above.
        </p>
        <p class="mb-3 text-gray-500 dark:text-gray-700">
          4. Click on go after entering the code.
        </p>
        <p class="mb-3 text-gray-500 dark:text-gray-700">
          5. You will see a list of files from the machine; select the date for
          the attendance you need.
        </p>
        <p class="mb-3 text-gray-500 dark:text-gray-700">
          6. Download the file to your device (phone or computer).
        </p>
        <p class="mb-3 text-gray-500 dark:text-gray-700">
          7. Return to our website, click on live attendance, and upload the
          downloaded file.
        </p>
      </div>



      <div class="relative">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" />
          </svg>
        </div>
        <input
          type="search"
          value={DeviceIP}
          onChange={(e) => {
            setDeviceIP(e.target.value);
          }}
          id="default-search"
          class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="192.168.1.X"
          required
        />
        <a
          href={`http://${DeviceIP}`}
          class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
        >
          Set Machine Time
        </a>
      </div>
    </div>
  );
}
