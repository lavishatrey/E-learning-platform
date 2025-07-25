import {
  Box,
  Button,
  ButtonGroup, // ButtonGroup is imported but not used, can remove if still not used.
  Flex,
  Grid,
  IconButton,
  Select,
  Text,
  useBreakpointValue,
  useColorModeValue,
  Heading,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import convertDateFormat, {
  deleteProduct,
  getProduct,
} from "../../Redux/AdminReducer/action";
import Pagination from "./Pagination";
import AdminNavTop from "../AdminNavTop";

const Courses = () => {
  const store = useSelector((store) => store.AdminReducer.data);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("");
  const limit = 4;
  const tableSize = useBreakpointValue({ base: "sm", sm: "md", md: "lg" });

  const navigate = useNavigate();

  // --- Color Mode Values ---
  const pageBg = useColorModeValue("gray.50", "gray.800"); // Light: very light gray, Dark: dark gray
  const cardBg = useColorModeValue("white", "gray.700"); // Light: white, Dark: medium dark gray
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900"); // Light: dark text, Dark: light text
  const headingColor = useColorModeValue("black", "whiteAlpha.900"); // Light: black, Dark: light heading
  const tableHeaderBg = useColorModeValue("gray.100", "gray.600"); // Light: light gray, Dark: medium gray header
  const tableBorderColor = useColorModeValue("gray.200", "gray.600"); // Light: light border, Dark: darker border
  const buttonPrimaryBg = useColorModeValue("blue.500", "blue.600"); // Light: blue, Dark: slightly darker blue
  const buttonPrimaryColor = useColorModeValue("white", "white"); // Button text white in both
  const buttonPrimaryHoverBg = useColorModeValue("blue.600", "blue.700"); // Button hover darker blue
  const buttonOutlineColor = useColorModeValue("gray.600", "gray.300"); // Light: gray outline, Dark: light gray outline
  const buttonOutlineHoverBg = useColorModeValue("gray.100", "gray.600"); // Light: light hover, Dark: darker hover

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSelect = (e) => {
    const { value } = e.target;
    setOrder(value);
  };

  useEffect(() => {
    dispatch(getProduct(page, limit, search, order));
  }, [page, search, order, limit, dispatch]);

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      dispatch(deleteProduct(id));
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const dummyTotalItems = 20; // Replace with actual total items from your API/Redux state
  const totalPages = Math.ceil(dummyTotalItems / limit) || 1;

  const handlePageButton = (val) => {
    setPage((prev) => prev + val);
  };

  return (
    <Grid
      className="admin-dashboard-layout"
      minH={"100vh"}
      w="100%"
      templateColumns={{
        base: "1fr",
        lg: "1fr",
      }}
      bg={pageBg} // Apply page background
      color={textColor} // Apply general text color
    >
      <Box>
        <AdminNavTop handleSearch={handleSearch} />

        <Box
          className="course-management-section"
          mt={{ base: "90px", md: "100px", lg: "110px" }} // Spacing from fixed Navbar
          p={{ base: 4, md: 6, lg: 8 }} // Consistent padding for the section
        >
          {/* Top Controls: Welcome Heading, Sort Select, Add New Course Button */}
          <Flex
            justifyContent="space-between" // Spreads items to ends
            alignItems="center" // Vertically centers items
            mb={6} // Margin below this flex
            flexDirection={{ base: "column", md: "row" }} // Stack on small, row on medium+
            gap={4} // Spacing between stacked/row items
          >
            {/* "Welcome To Course" Heading */}
            <Heading as="h2" size="md" color={headingColor} whiteSpace="nowrap">
              Welcome To Course
            </Heading>

            {/* Sort by Price Select dropdown */}
            <Select
              w={{ base: "100%", sm: "200px", md: "220px", lg: "250px" }} // Explicit, responsive width
              onChange={handleSelect}
              placeholder="Sort by Price" // Placeholder for initial state
              color={textColor} // Text color for dropdown
              bg={cardBg} // Background color for dropdown
              borderColor={tableBorderColor} // Border color for dropdown
            >
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </Select>

            {/* "Add New Course" Button */}
            <Button
              leftIcon={<AddIcon />}
              bg={buttonPrimaryBg} // Primary button background
              color={buttonPrimaryColor} // Primary button text color
              _hover={{ bg: buttonPrimaryHoverBg }} // Primary button hover effect
              onClick={() => navigate("/admin/addCourse")} // Navigation
              w={{ base: "100%", sm: "auto", md: "180px" }} // Explicit, responsive width
            >
              Add New Course
            </Button>
          </Flex>

          {/* Courses Table Container */}
          <Box
            className="course-table-container"
            w="100%" // Take full width of parent
            overflowX="auto" // Enable horizontal scrolling for narrow screens
            border="1px solid" // Border around the table container
            borderColor={tableBorderColor} // Dynamic border color
            borderRadius="md" // Rounded corners
            boxShadow="md" // Subtle shadow
            bg={cardBg} // Background color for the table container
          >
            <Table
              variant="simple" // Simple table style
              colorScheme="gray" // Gray color scheme (for striped rows, etc.)
              w="100%" // Full width within its container
              size={tableSize} // Responsive table size (sm, md, lg)
            >
              <Thead bg={tableHeaderBg}>
                {" "}
                {/* Table header background */}
                <Tr>
                  <Th color={headingColor}>Title</Th> {/* Header text color */}
                  <Th color={headingColor}>Date</Th>
                  <Th color={headingColor}>Category</Th>
                  <Th color={headingColor}>Description</Th>
                  <Th isNumeric color={headingColor}>
                    Price
                  </Th>{" "}
                  {/* Numeric header for right alignment */}
                  <Th color={headingColor}>Teacher</Th>
                  <Th color={headingColor} textAlign="center">
                    Actions
                  </Th>{" "}
                  {/* Centered actions header */}
                </Tr>
              </Thead>
              <Tbody>
                {store?.length > 0 ? (
                  store.map((el) => (
                    <Tr
                      key={el._id}
                      borderBottom="1px solid"
                      borderColor={tableBorderColor}
                    >
                      {" "}
                      {/* Row border */}
                      <Td fontWeight="medium" color={textColor}>
                        {el.title}
                      </Td>{" "}
                      {/* Cell text color */}
                      <Td color={textColor}>
                        {convertDateFormat(el.createdAt)}
                      </Td>
                      <Td color={textColor}>{el.category}</Td>
                      <Td
                        color={textColor}
                        maxW="250px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                      >
                        {el.description}
                      </Td>{" "}
                      {/* Truncated description */}
                      <Td isNumeric color={textColor}>
                        ₹{el.price}
                      </Td>
                      <Td color={textColor}>{el.teacher}</Td>
                      <Td>
                        {/* Action Buttons within a Flex */}
                        <Flex
                          gap={2} // Space between buttons
                          justifyContent="center" // Center buttons horizontally in cell
                          alignItems="center" // Center buttons vertically in cell
                          flexDirection={{ base: "column", md: "row" }} // Stack on small, row on medium+
                          minW="100px" // Minimum width for buttons to not squash
                          h="100%" // Take full height of Td to center vertically correctly
                        >
                          <Button
                            size="sm"
                            leftIcon={<DeleteIcon />}
                            colorScheme="red" // Red color for Delete
                            onClick={() => handleDelete(el._id, el.title)}
                            width="full" // Full width when stacked
                          >
                            Delete
                          </Button>
                          <Link
                            to={`/admin/edit/${el._id}`}
                            style={{ width: "100%" }}
                          >
                            {" "}
                            {/* Link takes full width when stacked */}
                            <Button
                              size="sm"
                              leftIcon={<EditIcon />}
                              colorScheme="blue" // Blue color for Edit
                              width="full" // Full width when stacked
                            >
                              Edit
                            </Button>
                          </Link>
                        </Flex>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td
                      colSpan={7}
                      textAlign="center"
                      py={10}
                      color={textColor}
                    >
                      No courses found. Add a new course!
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>

          {/* Pagination Controls */}
          <Flex
            mt={8} // Margin above pagination
            justifyContent={{ base: "center", md: "flex-end" }} // Center on small, right-align on medium+
            alignItems="center" // Vertically centers items
            gap={4} // Spacing between pagination components
            flexDirection={{ base: "column", sm: "row" }} // Stack on base, row on small+
          >
            <Button
              disabled={page <= 1}
              onClick={() => handlePageButton(-1)}
              variant="outline" // Outline style
              colorScheme="blue" // Blue color scheme
              borderColor={buttonOutlineColor} // Dynamic border color
              color={textColor} // Text color
              _hover={{ bg: buttonOutlineHoverBg }} // Hover effect
            >
              Previous
            </Button>
            <Pagination
              totalCount={totalPages} // Total pages for pagination component
              current_page={page} // Current active page
              handlePageChange={handlePageChange} // Function to change page
            />
            <Button
              disabled={page >= totalPages}
              onClick={() => handlePageButton(1)}
              variant="outline"
              colorScheme="blue"
              borderColor={buttonOutlineColor}
              color={textColor}
              _hover={{ bg: buttonOutlineHoverBg }}
            >
              Next
            </Button>
          </Flex>
        </Box>
      </Box>
    </Grid>
  );
};

export default Courses;
