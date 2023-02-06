import { Flex, Image, useColorMode, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { defaultMenuItem } from "../atoms/directoryMenuAtom";
import { auth } from "../firebase/clientApp";
import useDirectory from "../hooks/useDirectory";
import Directory from "./Directory/Directory";
import RightContent from "./RightContent/RightContent";
import SearchInput from "./SearchInput";

const Navbar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const { onSelectMenuItem } = useDirectory();
  const { colorMode } = useColorMode();
  const bg = useColorModeValue("white", "blackAlpha.800");

  /* const [userCreates, setUserCreate] = useState<boolean>(false); */

  /*   const getUserData = async () => {
    if (user) {
      try {
        const docRef = doc(firestore, "chatUsers", user?.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("User Already Created");
          setUserCreate(false);
        } else {
          setUserCreate(true);
        }
      } catch (error) {
        console.log(error);
      }
    } else return;
  };

  const userCreate = async (session: any) => {
    const userDocRef = doc(firestore, "chatUsers", session?.uid);
    await setDoc(userDocRef, JSON.parse(JSON.stringify(session)));

    await updateDoc(userDocRef, {
      updatedAt: serverTimestamp() as Timestamp,
    });
  };

  useEffect(() => {
    getUserData();

    if (userCreates) {
      userCreate(user);
    } else return;
  }, [user, firestore, userCreates]); */

  return (
    <Flex
      bg={bg}
      height="44px"
      padding="6px 12px"
      justify={{ md: "space-between" }}
    >
      <Flex
        align="center"
        width={{ base: "40px", md: "auto" }}
        mr={{ base: 0, md: 2 }}
        cursor="pointer"
        onClick={() => onSelectMenuItem(defaultMenuItem)}
      >
        <Image src="/images/redditFace.svg" height="30px" />
        <Image
          src={
            colorMode === "light"
              ? "/images/redditText.svg"
              : "/images/Reddit-Word-Dark.svg"
          }
          height="46px"
          display={{ base: "none", md: "unset" }}
        />
      </Flex>
      {user && <Directory />}
      <SearchInput user={user} />
      <RightContent user={user} />
    </Flex>
  );
};
export default Navbar;
