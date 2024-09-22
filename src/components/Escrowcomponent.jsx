import React, { useState } from "react";
import {
  Box,
  Button,
  Image,
  Text,
  VStack,
  HStack,
  useToast,
  Heading,
  Flex,
} from "@chakra-ui/react";

const EscrowComponent = () => {
  const [status, setStatus] = useState("Pending");
  const [error, setError] = useState(null);
  const toast = useToast();
  
  const gigId = "SEO";
  const amount = 400;
  const gigImage = "https://firebasestorage.googleapis.com/v0/b/skillx-a741e.appspot.com/o/gigs%2FFFiGQbDPgHcZqh7onNb3BZNj8L13%2Fimages.jpeg?alt=media&token=bfb3ead4-b8d0-45ff-a374-ed56eb1f0837";
  const freelancerName = "Dilip";

  const handleStartTask = () => {
    setStatus("Funds Deposited");
    setError(null);
    toast({
      title: "Success",
      description: "Funds deposited successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleFreelancerComplete = () => {
    setStatus("Work Completed by Freelancer");
    toast({
      title: "Success",
      description: "Task marked as completed.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleEmployerVerification = () => {
    if (status !== "Work Completed by Freelancer") {
      setError("Freelancer hasn't completed the work yet.");
      toast({
        title: "Error",
        description: "Freelancer hasn't completed the work yet.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setStatus("Funds Released to Freelancer");
    toast({
      title: "Success",
      description: "Funds released to freelancer.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      p={6}
      bg="white"
      borderRadius="lg"
      boxShadow="lg"
      maxW="lg"
      margin="auto"
      mt={10}
    >
      <Heading mb={4} color="blue.600">Escrow Management</Heading>
      <Text fontSize="lg" color="blue.500">Escrow Status: {status}</Text>
      {error && <Text color="red.300">{error}</Text>}
      
      <Image
        src={gigImage}
        alt="Gig Image"
        borderRadius="md"
        boxSize="200px"
        objectFit="cover"
        mb={4}
      />

      <VStack spacing={4} mt={4} w="100%">
        <Text fontSize="lg" color="blue.500">Gig: {gigId}</Text>
        <Text fontSize="lg" color="blue.500">Amount: ${amount}</Text>
        <Text fontSize="lg" color="blue.500">Freelancer: {freelancerName}</Text>
      </VStack>
      
      <HStack spacing={4} mt={4} w="100%">
        {status === "Pending" && (
          <Button colorScheme="blue" size="lg" onClick={handleStartTask}>
            Deposit Funds
          </Button>
        )}
        {status === "Funds Deposited" && (
          <Button colorScheme="teal" size="lg" onClick={handleFreelancerComplete}>
            Mark Task as Completed
          </Button>
        )}
        {status === "Work Completed by Freelancer" && (
          <Button colorScheme="green" size="lg" onClick={handleEmployerVerification}>
            Verify and Release Funds
          </Button>
        )}
      </HStack>
    </Flex>
  );
};

export default EscrowComponent;
