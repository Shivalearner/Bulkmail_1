import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

function App() {
  const [msg, setmsg] = useState("");
  const [status, setstatus] = useState(false);
  const [emailList, setEmailList] = useState([]);

  function handlemsg(evt) {
    setmsg(evt.target.value);
  }

  function handlefile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const emails = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
      setEmailList(emails);
    };
    reader.readAsArrayBuffer(file);
  }

  function send() {
    setstatus(true);
    axios
      .post("http://localhost:5000/sendemail", { msg, emails: emailList })
      .then(({ data }) => {
        alert(data === true ? "Email Sent Successfully" : "Failed");
      })
      .catch(() => {
        alert("Something went wrong");
      })
      .finally(() => {
        setstatus(false);
      });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex flex-col items-center py-10">
      <div className="w-full max-w-2xl space-y-6">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-indigo-700">BulkMail</h1>
          <p className="mt-2 text-indigo-500">
            Send multiple emails in one go—fast and easy.
          </p>
        </header>

        <section className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Compose Message</h2>
          <textarea
            className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-300 outline-none"
            placeholder="Enter your email text..."
            onChange={handlemsg}
            value={msg}
          />
        </section>

        <section className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Upload Excel Sheet</h2>
          <div className="flex items-center justify-center">
            <label className="w-full flex flex-col items-center px-4 py-6 bg-indigo-100 border-2 border-dashed border-indigo-300 rounded-xl cursor-pointer hover:bg-indigo-200 transition">
              <span className="text-indigo-600">Drag & drop or click to upload</span>
              <input type="file" className="hidden" onChange={handlefile} />
            </label>
          </div>
          <p className="text-gray-600">Total emails: <span className="font-medium">{emailList.length}</span></p>
        </section>

        <button
          onClick={send}
          disabled={status}
          className="w-full py-3 text-white font-semibold rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 transition disabled:opacity-50"
        >
          {status ? "Sending..." : "Send Emails"}
        </button>
      </div>
    </div>
  );
}

export default App;
