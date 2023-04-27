import React from "react";
import { useQuery } from "react-query";
import {
  AiOutlineDoubleLeft,
  AiOutlineDoubleRight,
  AiOutlineLeft,
  AiOutlineRight,
} from "react-icons/ai";

import {
  PaginationState,
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import axios from "axios";

const PaginationTable: React.FC = () => {
  const rerender = React.useReducer(() => ({}), {})[1];

  const columns = React.useMemo<ColumnDef<ProductType>[]>(
    () => [
      {
        accessorKey: "title",
        header: () => <span>Name</span>,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "price",
        cell: (info) => "$" + info.getValue(),
        header: () => <span className="flex justify-start px-2">Price</span>,
      },
      {
        accessorKey: "brand",
        cell: (info) => info.getValue(),
        header: () => <span>Brand</span>,
      },
      {
        accessorKey: "description",
        cell: (info) => info.getValue(),
        header: () => <span>Description</span>,
      },
      {
        accessorKey: "rating",
        cell: (info) => info.getValue() + "⭐",
        header: () => <span>Rating</span>,
      },
      {
        accessorKey: "id",
        cell: (info) => info.getValue(),
        header: "ID",
      },
    ],
    []
  );

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

  const fetchDataOptions = {
    pageIndex,
    pageSize,
  };

  var { data } = useQuery("data", () => {
    return axios.get("https://dummyjson.com/products");
  });

  const checkData = data?.data.products;

  const dataQuery = useQuery(
    ["data", fetchDataOptions],
    () => fetchData(fetchDataOptions),
    { keepPreviousData: true, enabled: !!checkData }
  );

  const defaultData = React.useMemo(() => [], []);

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  async function fetchData(options: { pageIndex: number; pageSize: number }) {
    await new Promise((r) => setTimeout(r, 500));

    return {
      rows: data?.data.products.slice(
        options.pageIndex * options.pageSize,
        (options.pageIndex + 1) * options.pageSize
      ),
      pageCount: Math.ceil(data?.data.products.length / options.pageSize),
    };
  }

  const table = useReactTable({
    data: dataQuery.data?.rows ?? defaultData,
    columns,
    pageCount: dataQuery.data?.pageCount ?? -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    debugTable: true,
  });

  if (dataQuery.isSuccess) {
    return (
      <>
        <div className="p-5 min-w-full">
          <div className="min-w-full">
            <div>
              <button
                className="bg-blue-900 rounded-lg text-white font-bold text-md px-2 py-1 disabled:opacity-20 hover:bg-blue-500"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                {<AiOutlineDoubleLeft />}
              </button>
              <button
                className="bg-blue-900 rounded-lg text-white font-bold text-md px-2 py-1 mx-1 disabled:opacity-20 hover:bg-blue-500"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {<AiOutlineLeft />}
              </button>
              <button
                className="bg-blue-900 rounded-lg text-white font-bold text-md px-2 py-1  disabled:opacity-20 hover:bg-blue-500"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {<AiOutlineRight />}
              </button>

              <button
                className="bg-blue-900 rounded-lg text-white font-bold text-md px-2 py-1 mx-1 disabled:opacity-20 hover:bg-blue-500"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                {<AiOutlineDoubleRight />}
              </button>
            </div>
            <div className="py-3">
              <span>
                Page{" "}
                <strong>
                  {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </strong>
              </span>
            </div>
          </div>

          <div />

          <div className="py-2">
            <table className="border-2 w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <th
                          key={header.id}
                          colSpan={header.colSpan}
                          className="border-2"
                        >
                          {header.isPlaceholder ? null : (
                            <div className="p-2 font-bold underline text-lg">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </div>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody className="">
                {table.getRowModel().rows.map((row) => {
                  return (
                    <tr key={row.id} className="">
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td key={cell.id} className="p-2 border-l-2 border-y">
                            <div className="px-3 py-1">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-5 ">
          <div className="py-5 font-medium">
            Go to:{" "}
            <input
              className="w-12 px-2 border-2 rounded-lg text-center text-clip"
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
            />
          </div>
          <div className="">
            <select
              className="border-y-2 rounded-lg"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="py-5 justify-center flex ">
            <button
            className="button-render"
              onClick={() => rerender()}
            >
              Force Rerender
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </>
  );
};

export default PaginationTable;
