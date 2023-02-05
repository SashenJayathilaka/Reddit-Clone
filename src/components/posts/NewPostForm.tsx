import {
  Alert,
  AlertIcon,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import CryptoJS from "crypto-js";
import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";

import { Post } from "../../atoms/PostAtom";
import { firestore, storage } from "../../firebase/clientApp";
import useSelectFile from "../../hooks/useSelectFile";
import ImageUpload from "./postsForm/ImageUpload";
import TextInput from "./postsForm/TextInput";
import TabItem from "./TabItem";

// const secretPass = process.env.NEXT_PUBLIC_CRYPTO_SECRET_PASS;

type NewPostFormProps = {
  user: User;
  communityImageURL?: string;
};

const formTabs = [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Images & Video",
    icon: IoImageOutline,
  },
  {
    title: "Link",
    icon: BsLink45Deg,
  },
  {
    title: "Poll",
    icon: BiPoll,
  },
  {
    title: "Talk",
    icon: BsMic,
  },
];

export type TabItem = {
  title: string;
  icon: typeof Icon.arguments;
};

const NewPostForm: React.FC<NewPostFormProps> = ({
  user,
  communityImageURL,
}) => {
  const router = useRouter();
  const [selectedTab, setSelectTab] = useState(formTabs[0].title);
  const [textInput, setTextInput] = useState({
    title: "",
    body: "",
  });
  const [encryptedData, setEncryptedData] = useState({
    title: "",
    body: "",
  });
  //const [selectedFile, setSelectedFile] = useState<string>();
  const { selectedFile, setSelectedFile, onSelectedFile } = useSelectFile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const bg = useColorModeValue("white", "#1A202C");

  const handleCreatePost = async () => {
    const { communityId } = router.query;
    // create new post

    const splitName = user.email!.split("@")[0];

    const dataName = CryptoJS.AES.encrypt(
      JSON.stringify(splitName),
      process.env.NEXT_PUBLIC_CRYPTO_SECRET_PASS as string
    ).toString();

    const newPost: Post = {
      communityId: communityId as string,
      creatorId: user.uid,
      communityImageURL: communityImageURL || "",
      creatorDisplayName: dataName,
      title: encryptedData.title,
      body: encryptedData.body,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp,
    };

    setLoading(true);
    try {
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);

      if (selectedFile) {
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, "data_url");
        const downloadURL = await getDownloadURL(imageRef);

        const encryptDownloadURL = CryptoJS.AES.encrypt(
          JSON.stringify(downloadURL),
          process.env.NEXT_PUBLIC_CRYPTO_SECRET_PASS as string
        ).toString();

        await updateDoc(postDocRef, {
          imageURL: encryptDownloadURL,
        });
      }
      router.back();
    } catch (error: any) {
      console.log(error.message);
      setError(true);
    }
    setLoading(false);
  };

  /*
  const onSelectedImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();

    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target.result as string);
      }
    };
  };
*/

  const encryptData = (name: string, value: string) => {
    try {
      const data = CryptoJS.AES.encrypt(
        JSON.stringify(value),
        process.env.NEXT_PUBLIC_CRYPTO_SECRET_PASS as string
      ).toString();

      setEncryptedData((prev) => ({
        ...prev,
        [name]: data,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const onTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = event;
    encryptData(name, value);
    setTextInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Flex direction="column" bg={bg} borderRadius={4} mt={2}>
      <Flex width="100%">
        {formTabs.map((item) => (
          <TabItem
            key={item.title}
            item={item}
            selected={item.title === selectedTab}
            setSelectTab={setSelectTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === "Post" && (
          <TextInput
            textInputs={textInput}
            onChange={onTextChange}
            handleCreatePost={handleCreatePost}
            loading={loading}
          />
        )}
        {selectedTab === "Images & Video" && (
          <ImageUpload
            selectedFile={selectedFile}
            onSelectedImage={onSelectedFile}
            setSelectTab={setSelectTab}
            setSelectedFile={setSelectedFile}
          />
        )}
      </Flex>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <Text mr={2}>Error Creating Post</Text>
        </Alert>
      )}
    </Flex>
  );
};
export default NewPostForm;
