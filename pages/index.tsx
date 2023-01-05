import React, { Fragment } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Checkbox,
  IconButton,
  Flex,
  Text,
  Tooltip,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { makeData } from "../makeData";
import {
  EditIcon,
  DeleteIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@chakra-ui/icons";
import { useTable, usePagination } from "react-table";

function CustomTable({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    usePagination
  );

  // Render the UI for your table
  return (
    <>
      <Table {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup, index) => {
            return (
              <Fragment key={index}>
                <Tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column, i) => {
                    return (
                      <Fragment key={"Header" + i}>
                        <Th {...column.getHeaderProps()}>
                          {column.render("Header")}
                        </Th>
                      </Fragment>
                    );
                  })}
                </Tr>
              </Fragment>
            );
          })}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <Fragment key={"index" + i}>
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <Td key={cell} {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </Td>
                    );
                  })}
                </Tr>
              </Fragment>
            );
          })}
        </Tbody>
      </Table>

      <Flex justifyContent="space-between" m={4} alignItems="center">
        <Flex>
          <Tooltip label="First Page">
            <IconButton
              onClick={() => gotoPage(0)}
              isDisabled={!canPreviousPage}
              icon={<ArrowLeftIcon h={3} w={3} />}
              mr={4}
              aria-label={""}
            />
          </Tooltip>
          <Tooltip label="Previous Page">
            <IconButton
              onClick={previousPage}
              isDisabled={!canPreviousPage}
              icon={<ChevronLeftIcon h={6} w={6} />}
              aria-label={""}
            />
          </Tooltip>
        </Flex>

        <Flex alignItems="center">
          <Text flexShrink="0" mr={8}>
            Page{" "}
            <Text fontWeight="bold" as="span">
              {pageIndex + 1}
            </Text>{" "}
            of{" "}
            <Text fontWeight="bold" as="span">
              {pageOptions.length}
            </Text>
          </Text>
          <Text flexShrink="0">Go to page:</Text>{" "}
          <NumberInput
            ml={2}
            mr={8}
            w={28}
            min={1}
            max={pageOptions.length}
            onChange={(value: string) => {
              const page = value ? Number(value) - 1 : 0;
              gotoPage(page);
            }}
            defaultValue={pageIndex + 1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Select
            w={32}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
        </Flex>

        <Flex>
          <Tooltip label="Next Page">
            <IconButton
              onClick={nextPage}
              isDisabled={!canNextPage}
              icon={<ChevronRightIcon h={6} w={6} />}
              aria-label={""}
            />
          </Tooltip>
          <Tooltip label="Last Page">
            <IconButton
              onClick={() => gotoPage(pageCount - 1)}
              isDisabled={!canNextPage}
              icon={<ArrowRightIcon h={3} w={3} />}
              ml={4}
              aria-label={""}
            />
          </Tooltip>
        </Flex>
      </Flex>
    </>
  );
}

export default function Home() {
  const [fakeData, setData] = React.useState(() => makeData(100000));

  // Formatter for each user
  const tableData = fakeData.map((user) => ({
    select: <Checkbox defaultChecked={false} />,
    title: user.firstName + " " + user.lastName,
    date: user.date.toLocaleString(),
    label: user.status,
    description: user.age.toString(),
    action: (
      <>
        <Button
          colorScheme="gray"
          onClick={() => console.log("Edit user!")}
          size="sm"
        >
          <EditIcon color={"blue.500"} />
        </Button>
        <Button
          colorScheme="gray"
          onClick={() => console.log("Remove user!")}
          size="sm"
        >
          <DeleteIcon color={"gray.500"} />
        </Button>
      </>
    ),
  }));

  // Accessor to get a data in user object
  const tableColumns = [
    {
      Header: "",
      accessor: "select" as const,
    },
    {
      Header: "Title",
      accessor: "title" as const,
    },
    {
      Header: "Date",
      accessor: "date" as const,
    },
    {
      Header: "Status",
      accessor: "label" as const,
    },
    {
      Header: "Description",
      accessor: "description" as const,
    },
    {
      Header: "",
      accessor: "action" as const,
    },
  ];

  return <CustomTable columns={tableColumns} data={tableData} />;
}
