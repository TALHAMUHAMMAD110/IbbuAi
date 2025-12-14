import React from "react";
import { Table, type TableColumnsType, type PaginationProps } from "antd";
import type { ColumnDef } from "@tanstack/react-table";

interface RowData {
  [key: string]: any;
}

interface DataTableProps {
  columns: ColumnDef<RowData>[];
  data: RowData[];
  total: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  total,
  pageSize,
  currentPage,
  onPageChange,
}) => {
  const antColumns: TableColumnsType<RowData> = columns.map((col) => {
    const columnId = (col as any).accessorKey || col.id;

    return {
      title:
        typeof col.header === "string" ? col.header : col.header?.toString(),
      dataIndex: columnId,
      key: columnId,
      render: (text: any, record: RowData): React.ReactNode => {
        return (col as any).cell?.({ getValue: () => text }) || text;
      },
    };
  });

  const paginationConfig: PaginationProps = {
    pageSize: pageSize,
    current: currentPage,
    total: total,
    showSizeChanger: false,
    onChange: (page: number) => onPageChange(page),
    showTotal: (total: number, range: [number, number]) =>
      `${range[0]}-${range[1]} of ${total} items`,
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "auto",
      }}
    >
      <Table<RowData>
        columns={antColumns}
        dataSource={data.map((row, idx) => ({ ...row, key: idx }))}
        pagination={paginationConfig}
        bordered
        scroll={{ x: true }}
        style={{ width: "100%" }}
      />
    </div>
  );
};

export default DataTable;
