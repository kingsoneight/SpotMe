import React, { useEffect } from "react";
import {
  Heading,
  NativeBaseProvider,
  Flex,
  Box,
  Spacer,
  ScrollView,
  Button,
  Row,
} from "native-base";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView, StyleSheet} from "react-native";
import AchievementModal from "../../../components/ProfileComponents/AchievementsModal";
import { firestore } from "../../../firebaseConfig";
import {
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  Achievementprops,
  Achievements,
  getAchievement,
  getCurrUser,
} from "@/components/FirebaseUserFunctions";
import { useAuth } from "@/Context/AuthContext";
import { useLocalSearchParams,router } from "expo-router";
import { SvgUri } from "react-native-svg";
const AchievementPage = () => {
  const { User } = useAuth();
  const { edit } = useLocalSearchParams();
  const [Complete, SetComplete] = React.useState<Achievementprops[]>([]);
  const [Uncomplete, SetUncomplete] = React.useState<Achievementprops[]>([]);
  const [editDisplay, setEditDisplay] = React.useState<string[]>([]);
  const [CompleteSVG, SetCompleteSVG] = React.useState<React.JSX.Element[]>([]);
  const [UncompleteSVG, SetUncompleteSVG] = React.useState<React.JSX.Element[]>([]);
  useEffect(() => {
    GetUserAchievement();

  }, []);
  useEffect(() => {
    console.log(Complete);
    console.log(Uncomplete);  
    AllSvgs();
    console.log(CompleteSVG);
}, [Complete, Uncomplete]);  
  const updateUserDisplay = async () => {
    if (User) {
      try {
        await updateDoc(doc(firestore, "Users", User.uid), { display: editDisplay });
      } catch (error) {
        console.error("Error updating bio: ", error);
      }
    router.back();
  }
  }
  const GetUserAchievement = async () => {
    if (User) {
      try {
        const UserInfo = await getCurrUser(User.uid);
        const DisplayAchievement = UserInfo.display;
        const Achievement = UserInfo.Achievement;
        const CompleteAchievements: Achievementprops[] = [];
        const UncompleteAchievements: Achievementprops[] = [];

        Object.keys(Achievement).forEach((muscleGroup) => {
          const achievements = Achievement[muscleGroup as keyof Achievements];
          if (achievements) {
            achievements.forEach((achievement) => {
              if (achievement.achieved) {
                CompleteAchievements.push(achievement);
              } else {
                UncompleteAchievements.push(achievement);
              }
            });
          }
        });
  
  
  
        SetComplete(CompleteAchievements);
        SetUncomplete(UncompleteAchievements);
        setEditDisplay(DisplayAchievement);
      } catch (error) {
        console.error("Error fetching user achievements: ", error);
      }
    }
  };
  const AllSvgs = async () =>{
    const UnSVGs:  React.JSX.Element[] = [];
    const ComSVGs:  React.JSX.Element[] = [];
    let SVG;
    for (let i = 0; i < Uncomplete.length; i++) {
      const name = Uncomplete[i].name;
      const achievementPath = `/Achievement/Incomplete/${name.replace(/\s/g, '')}Grey.svg`;
      try{
        SVG = await getAchievement(achievementPath);
      }catch(error){
        console.error("Error fetching achievement:", error);
      }
      UnSVGs.push(
        <SvgUri uri={SVG} width="100%" height="100%" />
      );
    }
    for (let i = 0; i < Complete.length; i++) {
      const name = Complete[i].name;
      const achievementPath = `/Achievement/Complete/${name.replace(/\s/g, '')}Colored.svg`;
      try{
        SVG = await getAchievement(achievementPath);
      }catch(error){
        console.error("Error fetching achievement:", error);
      }
      ComSVGs.push(
        <SvgUri uri={SVG} width="100%" height="100%" />
      );
    }  
    SetUncompleteSVG(UnSVGs);
    SetCompleteSVG(ComSVGs);
  }

  return (
    <NativeBaseProvider>
      <SafeAreaView style= {{backgroundColor:"#FFFFFF", flex:1}}>
      <Box p={15} pb={3} alignItems="center" justifyContent="space-between">
            <Row alignItems={"center"}>
              <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
                <FontAwesome name="chevron-left" size={24} color="black" />
              </TouchableOpacity>
              <Spacer/>
              <Box>
                <Heading fontSize="lg" color="trueGray.800">Your Badges</Heading> 
              </Box>
              <Spacer/>
              <TouchableOpacity activeOpacity={0.7}>
                <FontAwesome name="chevron-left" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </Row>
      </Box>
      <ScrollView style={styles.container}>
          <Flex justifyContent={"flex-end"}flexDir={"column"} margin={1}>
            {Complete.length > 0 && <Box marginBottom={5}>
            <Heading marginBottom={2} marginTop={3}> Earned Badges</Heading>
            <Flex flexDirection={"row"} flexWrap={"wrap"}>
              {Complete.map((achievement,index) => (
                <AchievementModal
                  key = {achievement.name}
                  image={CompleteSVG[index]}
                  name={achievement.name}
                  description={achievement.description}
                  current={achievement.curr}
                  max={achievement.max}
                  achieved={true}
                  edit={edit ? true : false}
                  setdisplay={setEditDisplay}
                  display={editDisplay}
                />
              ))}
            </Flex>
            </Box>}
            {!edit && Uncomplete.length > 0 && <Box>
            <Flex>
              <Box
                borderWidth={0.5}
                width={"95%"}
                alignSelf={"center"}
                borderColor={"muted.300"}
              ></Box>
            </Flex>
            <Heading marginTop={5} marginBottom={2}> More Badges</Heading>
            <Flex flexDirection={"row"} flexWrap={"wrap"}>
              {Uncomplete.map((achievement,index) => (
                <AchievementModal
                  key = {achievement.name}
                  image={UncompleteSVG[index]}
                  name={achievement.name}
                  description={achievement.description}
                  current={achievement.curr}
                  max={achievement.max}
                  achieved={false}
                />
              ))}
            </Flex>
            </Box>}
          </Flex>

      </ScrollView>
      {edit && 
      <Flex flexDir={"row"} justifyContent={"space-around"} backgroundColor={"#FFF"} paddingBottom={5}>
         <Button backgroundColor={"#F97316"} width = {"1/3"} borderRadius = {"15"}  onPress={updateUserDisplay}  _pressed={{ opacity: 0.5 }}>Submit</Button>
       <Button backgroundColor={"#F97316"} width={"1/3"} borderRadius = {"15"} onPress={() => router.navigate("/ProfilePage")} _pressed={{ opacity: 0.5 }}>Cancel</Button>
     
      </Flex>
      }
      </SafeAreaView>
    </NativeBaseProvider>
  );
};
export default AchievementPage;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  }
});

/*
        <VStack mt={3}>
          <Spacer />
          <ScrollView>
            <VStack space={4}>
              {ahievements.map((achievement) => (
                <Center>
                  <Flex
                    direction="row"
                    bg="white"
                    shadow={3}
                    rounded="md"
                    p={4}
                    w="90%"
                  >
                    <Box h="20" w="20">
                      <achievement.image />
                    </Box>
                    <Box>
                      <Heading mb={2} fontSize={"sm"}>
                        {achievement.name}
                      </Heading>
                      <Text>{achievement.description}</Text>
                    </Box>
                  </Flex>
                </Center>
              ))}
            </VStack>
          </ScrollView>
        </VStack>

*/
