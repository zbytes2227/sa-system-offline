"use client";
import { useState } from "react";
import Papa from "papaparse";

export default function Home() {
  const [file, setFile] = useState(null);
  const [idList, setIdList] = useState([]);
  const results = [];
  const [FinalARR, setFinalARR] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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
      <form>
        <label
          for="default-search"
          class="mb-2 text-sm font-medium text-gray-900 sr-only"
        >
          Search
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
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            id="default-search"
            class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Search Mockups, Logos..."
            required
          />
          <button
            type="submit"
            class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
          >
            Search
          </button>
        </div>
      </form>

      <div className="flex my-3 items-center justify-end">
        {/* {file && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Uploaded CSV</h2>
            <p>{file.name}</p>
          </div>
        )} */}
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          class=" text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-md px-5 py-2 text-center"
        />
        <button class="mx-4 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-md px-5 py-2 text-center">
          Refresh
        </button>
      </div>

      {/* {idList.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mt-4 mb-2">Extracted IDs</h2>
          <pre>{JSON.stringify(idList, null, 2)}</pre>
        </div>

      )} */}
       <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-screen">

    
      {filteredCards.length > 0 ? (
        <table className="w-full mt-3 text-md text-left rtl:text-right text-gray-500">
          <thead className="text-md text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Card ID
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Class
              </th>{" "}
              <th scope="col" className="px-6 py-3">
                Contact
              </th>
              <th scope="col" className="px-6 py-3">
                Login
              </th>{" "}
              <th scope="col" className="px-6 py-3">
                Logout
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCards.map((card) => (
              <tr key={card.cardID} className="bg-white border-b">
                {/* Display only the relevant columns */}
                <th
                  scope="row"
                  className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap"
                >
                  {card.cardID}
                </th>
                <td className="px-6 py-4">{card.name}</td>
                <td className="px-6 py-4">{card.class}</td>
                <td className="px-6 py-4">{card.contact}</td>
                <td className="px-6 py-4">{card.Login}</td>
                <td className="px-6 py-4">{card.Logout}</td>

                <td className="px-6 py-4">
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Edit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 text-lg mt-4 text-center">@ZBYTES SYSTEMS</p>
      )}
   </div>
      {/* <div className="overflow-x-auto">
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
    </div> */}
    </div>
  );
}
