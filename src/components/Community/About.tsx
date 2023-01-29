import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Image,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import moment from "moment";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaReddit } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import { useSetRecoilState } from "recoil";

import { Community, CommunityState } from "../../atoms/CommunitiesAtom";
import { auth, firestore, storage } from "../../firebase/clientApp";
import useSelectFile from "../../hooks/useSelectFile";

type AboutProps = {
  communityData: Community;
};

const About: React.FC<AboutProps> = ({ communityData }) => {
  const [user] = useAuthState(auth);
  const selectedFieldRef = useRef<HTMLInputElement>(null);
  const { selectedFile, setSelectedFile, onSelectedFile } = useSelectFile();
  const [uploadingImage, setUploadingImage] = useState(false);
  const setCommunityStateValue = useSetRecoilState(CommunityState);
  const bg = useColorModeValue("white", "#1A202C");

  const onUploadingImage = async () => {
    if (!selectedFile) return;
    setUploadingImage(true);

    try {
      const imageRef = ref(storage, `communities/${communityData.id}/image`);
      await uploadString(imageRef, selectedFile, "data_url");
      const downLodeUrl = await getDownloadURL(imageRef);
      await updateDoc(doc(firestore, "communities", communityData.id), {
        imageURL: downLodeUrl,
      });

      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          ...prev.currentCommunity,
          imageUrl: downLodeUrl,
        } as Community,
      }));
    } catch (error) {
      console.log("onUploader Image", error);
    }
    setUploadingImage(false);
  };

  return (
    <Box position="sticky" top="14px">
      <Flex
        justify="space-between"
        align="center"
        bg="blue.400"
        color="white"
        p={3}
        borderRadius="4px 4px 0px 0px"
      >
        <Text fontSize="10pt" fontWeight={700}>
          About Community
        </Text>
        <Icon as={HiOutlineDotsHorizontal} cursor="pointer" />
      </Flex>
      <Flex direction="column" p={3} bg={bg} borderRadius="0px 0px 4px 4px">
        <Stack>
          <Flex width="100%" p={2} fontSize="10pt" fontWeight={700}>
            <Flex direction="column" flexGrow={1}>
              <Text>{communityData.numberOfMembers.toLocaleString()}</Text>
              <Text>Members</Text>
            </Flex>
            <Flex direction="column" flexGrow={1}>
              <Text>1</Text>
              <Text>Online</Text>
            </Flex>
          </Flex>
          <Divider />

          <Flex
            align="center"
            width="100%"
            p={1}
            fontWeight={500}
            fontSize="10pt"
          >
            <Icon as={RiCakeLine} fontSize={18} mr={2} />
            {communityData.createdAt && (
              <>
                <Text>
                  Created{" "}
                  {moment(
                    new Date(communityData.createdAt?.seconds * 1000)
                  ).format("MMM DD, YYYY")}
                </Text>
              </>
            )}
          </Flex>
          <Link href={`/r/${communityData.id}/submit`}>
            <Button mt={3} height="30px">
              Create Post
            </Button>
          </Link>
          {user?.uid === communityData.creatorId && (
            <>
              <Divider />
              <Stack spacing={1} fontSize="10pt">
                <Text fontWeight={600}>Admin</Text>
                <Flex align="center" justify="space-between">
                  <Text
                    color="blue.500"
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                    onClick={() => selectedFieldRef.current?.click()}
                  >
                    Change Image
                  </Text>
                  {communityData.imageURL || selectedFile ? (
                    <Image
                      src={selectedFile || communityData.imageURL}
                      borderRadius="full"
                      boxSize="40px"
                      alt="community Image"
                    />
                  ) : (
                    <Icon
                      as={FaReddit}
                      fontSize={40}
                      color="brand.100"
                      mr={2}
                    />
                  )}
                </Flex>
                {selectedFile &&
                  (uploadingImage ? (
                    <Spinner />
                  ) : (
                    <Text cursor="pointer" onClick={onUploadingImage}>
                      Save Changes
                    </Text>
                  ))}
                <input
                  id="file-upload"
                  type="file"
                  accept="image/x-png,image/gif,image/jpeg"
                  hidden
                  ref={selectedFieldRef}
                  onChange={onSelectedFile}
                />
              </Stack>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};
export default About;
