import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Box, Flex, Text, Link } from "@radix-ui/themes";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Flex 
      align="center" 
      justify="center" 
      className="min-h-screen"
      style={{ backgroundColor: "var(--gray-2)" }}
    >
      <Box className="text-center">
        <Text size="9" weight="bold" className="mb-4 block">404</Text>
        <Text size="5" className="mb-4 block" style={{ color: "var(--gray-11)" }}>
          Oops! Page not found
        </Text>
        <Link href="/" size="3" underline="always">
          Return to Home
        </Link>
      </Box>
    </Flex>
  );
};

export default NotFound;
