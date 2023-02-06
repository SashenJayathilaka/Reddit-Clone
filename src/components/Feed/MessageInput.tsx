import { Box, Input, useColorModeValue } from "@chakra-ui/react";
import CryptoJS from "crypto-js";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, firestore } from "../../firebase/clientApp";

interface MessageBody {
  communityId: string;
  senderId: string;
  senderImageUrl: string;
  senderName: string;
  senderEmail: any;
  messageBody: string;
  sendedAt: Timestamp;
}

type Props = {
  conversationId: string;
};

function MessageInput({ conversationId }: Props) {
  const [user] = useAuthState(auth);
  const [messageBody, setMessageBody] = useState("");
  const searchBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const searchBorder = useColorModeValue("gray.200", "#4A5568");

  const onSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    const encryptedData = [];

    const arrData = [
      conversationId as string,
      user.uid,
      user.email!.split("@")[0],
      user.email,
      messageBody,
    ];

    for (let index = 0; index < 5; index++) {
      try {
        if (arrData[index]) {
          const data = CryptoJS.AES.encrypt(
            JSON.stringify(arrData[index]),
            process.env.NEXT_PUBLIC_CRYPTO_SECRET_PASS as string
          ).toString();

          encryptedData.push(data);
        }
      } catch (error: any) {
        console.log(error.message);
      }
    }

    try {
      const newMessageBody: MessageBody = {
        communityId: encryptedData[0],
        senderId: encryptedData[1],
        senderImageUrl: user.photoURL || "",
        senderName: encryptedData[2],
        senderEmail: encryptedData[3],
        messageBody: encryptedData[4],
        sendedAt: serverTimestamp() as Timestamp,
      };

      await addDoc(
        collection(firestore, `communities/${conversationId}/conversation`),
        newMessageBody
      );

      setMessageBody("");
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <Box px={4} py={6} width="100">
      <form onSubmit={onSendMessage}>
        <Input
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
          size="md"
          placeholder="Message Chat Feedback"
          resize="none"
          _focus={{
            boxShadow: "none",
            border: "1px solid",
            borderColor: searchBorder,
          }}
          bg={searchBg}
          disabled={!user}
        />
      </form>
    </Box>
  );
}

export default MessageInput;
