import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "./components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";

interface RowData {
  [key: string]: any;
}

function App() {
  const [data, setData] = useState<RowData[]>([]);
  const [columns, setColumns] = useState<ColumnDef<RowData>[]>([]);
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const pageSize = 20;

  const fetchData = async (pageNum: number) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/data?page=${pageNum}&page_size=${pageSize}`
      );
      setData(res.data.data);
      setTotalRows(res.data.total_rows);

      if (res.data.data.length > 0) {
        const cols: ColumnDef<RowData>[] = Object.keys(res.data.data[0]).map(
          (key) => ({
            accessorKey: key,
            header: key,
          })
        );
        setColumns(cols);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:8000/upload", formData);
      fetchData(1);
      setPage(1);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">AI MS Data Viewer</h1>

      <input type="file" onChange={uploadFile} className="mb-4" />

      <DataTable data={data} columns={columns} />

      <div className="mt-4 flex justify-center items-center space-x-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} / {Math.ceil(totalRows / pageSize)}
        </span>
        <button
          disabled={page === Math.ceil(totalRows / pageSize)}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
