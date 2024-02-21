"use client";
import { useEffect, useState } from "react";
import Papa from "papaparse";

export default function Home() {
  const [DeviceIP, setDeviceIP] = useState("192.168.1.");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update the current time every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const formattedDate = () => {
    const year = currentTime.getFullYear();
    const month = currentTime.getMonth() + 1; // Months are zero-based
    const day = currentTime.getDate();
    const hour = currentTime.getHours();
    const min = currentTime.getMinutes();
    const sec = currentTime.getSeconds();

    return `http://${DeviceIP}/time?year=${year}&month=${month}&day=${day}&hour=${hour}&min=${min}&sec=${sec}`;
  };


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
          href={formattedDate()}
          className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
        >
          Set Machine Time
        </a>
      </div>
      <div class="relative mt-6">
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
          href={`http://${DeviceIP}/card`}
          className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
        >
          OPEN CARD-ID MODE
        </a>
      </div>
    </div>
  );
}
