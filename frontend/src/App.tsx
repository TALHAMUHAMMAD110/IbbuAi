import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DataTable from "./components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "antd";

interface RowData {
  [key: string]: any;
}

function App() {
  const [data, setData] = useState<RowData[]>([]);
  const [columns, setColumns] = useState<ColumnDef<RowData>[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pageSize = 5;

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
    fetchData(currentPage);
  }, [currentPage]);

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:8000/upload", formData);
      setCurrentPage(1);
      fetchData(1);
    } catch (error) {
      console.error(error);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: 0,
        margin: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          padding: "20px 24px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <h1 className="text-2xl font-bold" style={{ margin: "0 0 8px 0" }}>
          ibbu bhAlya
        </h1>
        <p style={{ margin: 0, color: "#666" }}>
          your report generation assistant powered by AI
        </p>
      </div>

      {/* Upload Button */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button type="primary" size="large" onClick={handleButtonClick}>
          Upload File
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          onChange={uploadFile}
          style={{ display: "none" }}
        />
      </div>

      {/* Table Container - Takes remaining space */}
      <div style={{ flex: 1, overflow: "auto", width: "100%" }}>
        <DataTable
          data={data}
          columns={columns}
          total={totalRows}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default App;
