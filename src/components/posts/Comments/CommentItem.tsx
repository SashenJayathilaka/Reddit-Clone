import {
  Avatar,
  Box,
  Flex,
  Icon,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import CryptoJS from "crypto-js";
import { Timestamp } from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  IoArrowDownCircleOutline,
  IoArrowUpCircleOutline,
} from "react-icons/io5";

export type Comment = {
  id?: string;
  creatorId: string;
  creatorDisplayText: string;
  creatorPhotoURL: string;
  communityId: string;
  postId: string;
  postTitle: string;
  text: string;
  createdAt: Timestamp;
};

type CommentItemProps = {
  comment: Comment;
  onDeleteComment: (comment: Comment) => void;
  isLoading: boolean;
  userId?: string;
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onDeleteComment,
  isLoading,
  userId,
}) => {
  const [decryptedData, setDecryptedData] = useState({
    text: "",
    creatorDisplayText: "",
  });

  useEffect(() => {
    const arr = [comment.text, comment.creatorDisplayText];
    const arrName = ["text", "creatorDisplayText"];

    try {
      for (let index = 0; index < arr.length; index++) {
        if (arr[index]) {
          const bytes = CryptoJS.AES.decrypt(
            arr[index]!,
            process.env.NEXT_PUBLIC_CRYPTO_SECRET_PASS as string
          );
          const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

          setDecryptedData((prev) => ({
            ...prev,
            [arrName[index]]: data,
          }));
        } else return;
      }
    } catch (error) {
      console.log(error);
    }
  }, [comment]);

  return (
    <Flex>
      <Box mr={2}>
        <Avatar
          src={comment.creatorPhotoURL}
          size="sm"
          name={decryptedData.creatorDisplayText}
        />
      </Box>
      <Stack spacing={1}>
        <Stack direction="row" align="center" fontSize="8px">
          <Text>{decryptedData.creatorDisplayText}</Text>
          <Text>
            {moment(new Date(comment.createdAt?.seconds * 1000)).fromNow()}
          </Text>
          {isLoading && <Spinner size="sm" />}
        </Stack>
        <Text fontSize="10pt">{decryptedData.text}</Text>
        <Stack direction="row" align="center" cursor="pointer" color="gray.500">
          <Icon as={IoArrowUpCircleOutline} />
          <Icon as={IoArrowDownCircleOutline} />
          {userId === comment.creatorId && (
            <>
              <Text fontSize="9pt" _hover={{ color: "blue.500" }}>
                Edit
              </Text>
              <Text
                fontSize="9pt"
                _hover={{ color: "blue.500" }}
                onClick={() => onDeleteComment(comment)}
              >
                Delete
              </Text>
            </>
          )}
        </Stack>
      </Stack>
    </Flex>
  );
};
export default CommentItem;
