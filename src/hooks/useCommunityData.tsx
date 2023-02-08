import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModelState } from "../atoms/authModalAtom";
import {
  Community,
  CommunitySnippet,
  CommunityState,
} from "../atoms/CommunitiesAtom";
import { auth, firestore } from "../firebase/clientApp";

const useCommunityData = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const setAuthModelState = useSetRecoilState(authModelState);
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(CommunityState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onJoinOrCommunity = (communityData: Community, isJoined: boolean) => {
    if (!user) {
      // model
      setAuthModelState({ open: true, view: "login" });
      return;
    }

    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }
    joinCommunity(communityData);
  };

  const getMySnippets = async () => {
    setLoading(true);
    try {
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );
      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
        snippetsFetched: true,
      }));

      //console.log(snippets, "🙌🚀🚀");
    } catch (error: any) {
      console.log("Get My Snippet Error", error);
      setError(error.message);
    }
    setLoading(false);
  };

  const getCommunityData = async (communityId: string) => {
    try {
      const communityDocRef = doc(firestore, "communities", communityId);
      const communityDoc = await getDoc(communityDocRef);

      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          id: communityDoc.id,
          ...communityDoc.data(),
        } as Community,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user) {
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [],
        snippetsFetched: false,
      }));
      return;
    }
    getMySnippets();
  }, [user]);

  useEffect(() => {
    const { communityId } = router.query;

    if (communityId && !communityStateValue.currentCommunity) {
      getCommunityData(communityId as string);
    }
  }, [router.query, communityStateValue.currentCommunity]);

  const joinCommunity = async (communityData: Community) => {
    try {
      const batch = writeBatch(firestore);

      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageURL: communityData.imageURL || "",
        isModerator: user?.uid === communityData.creatorId,
        updateTimeStamp: serverTimestamp() as Timestamp,
      };

      batch.set(
        doc(
          firestore,
          `users/${user?.uid}/communitySnippets`,
          communityData.id
        ),
        newSnippet
      );

      batch.update(doc(firestore, "communities", communityData.id), {
        numberOfMembers: increment(1),
      });

      await batch.commit();

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
      }));

      updateCommunitySnippet(communityData, user?.uid!);
    } catch (error: any) {
      console.log("JoinCommunity Error", error);
      setError(error.message);
    }
    setLoading(false);
  };

  const updateCommunitySnippet = async (
    communityData: Community,
    userId: string
  ) => {
    if (!communityData && !userId) return;

    try {
      const batch = writeBatch(firestore);

      const newSnippet = {
        userId: userId,
        userEmail: user?.email,
      };

      batch.set(
        doc(
          firestore,
          `communities/${communityData.id}/userInCommunity/${userId}`
        ),
        newSnippet
      );

      await batch.commit();
    } catch (error: any) {
      console.log("JoinCommunity Error", error);
      setError(error.message);
    }
  };

  const leaveCommunity = async (communityId: string) => {
    try {
      const batch = writeBatch(firestore);

      batch.delete(
        doc(firestore, `users/${user?.uid}/communitySnippets`, communityId)
      );

      batch.update(doc(firestore, "communities", communityId), {
        numberOfMembers: increment(-1),
      });

      await batch.commit();

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          (item) => item.communityId !== communityId
        ),
      }));
    } catch (error: any) {
      console.log("JoinCommunity Error", error);
      setError(error.message);
    }
    setLoading(false);
  };

  return {
    communityStateValue,
    onJoinOrCommunity,
    loading,
  };
};
export default useCommunityData;
