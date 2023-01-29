import {
  Flex,
  Textarea,
  Button,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import React from "react";
import AuthButtons from "../../../Navbar/RightContent/AuthButtons";

type CommentInputProps = {
  commentText: string;
  setCommentText: (value: string) => void;
  user: User;
  createLoading: boolean;
  onCreateComments: (commentText: string) => void;
};

const CommentInput: React.FC<CommentInputProps> = ({
  commentText,
  setCommentText,
  user,
  createLoading,
  onCreateComments,
}) => {
  const bg = useColorModeValue("white", "#1A202C");
  const bgBottom = useColorModeValue("gray.100", "#1A202C");
  return (
    <Flex direction="column" position="relative">
      {user ? (
        <>
          <Text mb={1}>
            Comment as{" "}
            <span style={{ color: "#3182CE" }}>
              {user?.email?.split("@")[0]}
            </span>
          </Text>
          <Textarea
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="What are your thoughts?"
            fontSize="10pt"
            borderRadius={4}
            minHeight="160px"
            pb={10}
            _placeholder={{ color: "gray.500" }}
            _focus={{
              outline: "none",
              bg: bg,
              border: "1px solid black",
            }}
          />
          <Flex
            position="absolute"
            left="1px"
            right={0.1}
            bottom="1px"
            justify="flex-end"
            bg={bgBottom}
            p="6px 8px"
            borderRadius="0px 0px 4px 4px"
          >
            <Button
              height="26px"
              disabled={!commentText.length}
              isLoading={createLoading}
              onClick={() => onCreateComments(commentText)}
            >
              Comment
            </Button>
          </Flex>
        </>
      ) : (
        <Flex
          align="center"
          justify="space-between"
          borderRadius={2}
          border="1px solid"
          borderColor="gray.100"
          p={4}
        >
          <Text fontWeight={600}>Log in or sign up to leave a comment</Text>
          <AuthButtons />
        </Flex>
      )}
    </Flex>
  );
};
export default CommentInput;
