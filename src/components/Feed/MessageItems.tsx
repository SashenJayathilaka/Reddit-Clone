import {
  Avatar,
  Box,
  Flex,
  Image,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import CryptoJS from "crypto-js";
import { motion } from "framer-motion";
import moment from "moment";
import React, { useEffect, useState } from "react";

import { MessageBody } from "./Messages";

type Props = {
  message: MessageBody;
  userId: string;
};

function MessageItems({ message, userId }: Props) {
  const [decryptedData, setDecryptedData] = useState({
    senderName: "",
    senderEmail: "",
    messageBody: "",
    senderImageUrl: "",
  });

  const textBg = useColorModeValue("gray.500", "whiteAlpha.700");
  const bg = useColorModeValue("gray.300", "whiteAlpha.300");
  const secondBg = useColorModeValue("gray.100", "#006AFF");

  useEffect(() => {
    const arr = [
      message.senderName,
      message.senderEmail,
      message.messageBody,
      message.senderImageUrl,
    ];
    const arrName = [
      "senderName",
      "senderEmail",
      "messageBody",
      "senderImageUrl",
    ];

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
  }, [message]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <Stack
        direction="row"
        p={4}
        spacing={4}
        _hover={{ bg: "whiteAlpha.20" }}
        justify={message.senderId === userId ? "flex-end" : "flex-start"}
        wordBreak="break-word"
      >
        {message.senderId && (
          <>
            {message.senderId !== userId && (
              <Flex align="flex-end">
                {decryptedData.senderImageUrl ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    <Image
                      src={decryptedData.senderImageUrl}
                      height="34px"
                      rounded="base"
                    />
                  </motion.div>
                ) : (
                  <Avatar
                    name={decryptedData.senderName}
                    src={decryptedData.senderImageUrl}
                    size="sm"
                    rounded="base"
                  />
                )}
              </Flex>
            )}
            <Stack spacing={1} width="100%">
              <Stack
                direction="row"
                align="center"
                justify={
                  message.senderId === userId ? "flex-end" : "flex-start"
                }
              >
                !
                {message.senderId !== userId && (
                  <Text fontWeight={500} textAlign="left" fontSize={12}>
                    {decryptedData.senderName}
                  </Text>
                )}
                <Text fontSize={12} color={textBg}>
                  {moment(new Date(message.sendedAt?.seconds * 1000)).fromNow()}
                </Text>
              </Stack>
              <Flex
                justify={
                  message.senderId === userId ? "flex-end" : "flex-start"
                }
              >
                {message.senderId === userId ? (
                  <Box
                    bg={secondBg}
                    px={2}
                    py={1}
                    //borderRadius={12}
                    borderBottomRightRadius={12}
                    borderBottomLeftRadius={12}
                    borderTopLeftRadius={12}
                    maxWidth="65%"
                    //border="1px solid"
                  >
                    <Text fontWeight="medium">{decryptedData.messageBody}</Text>
                  </Box>
                ) : (
                  <Box
                    bg={bg}
                    px={2}
                    py={1}
                    //borderRadius={12}
                    borderBottomRightRadius={12}
                    borderBottomLeftRadius={12}
                    borderTopRightRadius={12}
                    maxWidth="65%"
                    //border="1px solid"
                  >
                    <Text fontWeight="medium">{decryptedData.messageBody}</Text>
                  </Box>
                )}
              </Flex>
            </Stack>
          </>
        )}
      </Stack>
    </motion.div>
  );
}

export default MessageItems;
