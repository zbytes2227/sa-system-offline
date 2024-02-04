import Navbar from "@/components/Navbar";
import React from "react";

const page = () => {
  return (
    <>
      <Navbar />

      <div className="mt-20">
        <h2 className="mb-5 text-2xl font-bold text-center">
          Edit Card Details
        </h2>
      </div>
      <form class="max-w-sm mx-auto border border-3 rounded-lg p-5">
        <div class="mb-5">
          <label for="id" class="block mb-2 text-sm font-medium text-gray-900">
            Card ID
          </label>
          <input
            value={"F5v72Gf"}
            type="text"
            disabled
            id="id"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <div class="mb-5">
          <label
            for="name"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0"
            placeholder="Ujjwal zbytes"
            required
          />
        </div>
        <div class="mb-5">
          <label
            for="class"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            Class
          </label>
          <input
            type="text"
            id="class"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0"
            placeholder="10A"
            required
          />
        </div>
        <div class="mb-5">
          <label
            for="Contact"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            Contact
          </label>
          <input
            type="number"
            id="Contact"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0"
            placeholder="27657265"
            required
          />
        </div>

        {/* <div class="flex items-start mb-5">
    <div class="flex items-center h-5">
      <input id="remember" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" required/>
    </div>
    <label for="remember" class="ms-2 text-sm font-medium text-gray-900">Remember me</label>
  </div> */}
        <button
          type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Save
        </button>
      </form>
    </>
  );
};

export default page;
