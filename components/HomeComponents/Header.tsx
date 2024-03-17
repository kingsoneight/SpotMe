import React, { useState } from "react";
import {
  Flex,
  Spacer,
  IconButton,
  Pressable,
  Column,
  Row,
  Text,
  Box,
  Heading,
} from "native-base";
import { Image } from "react-native";
import { IUser } from "@/components/FirebaseUserFunctions";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
interface FriendProps {
  currUser: IUser;
}

const Header: React.FC<FriendProps> = ({ currUser }) => {
  const [isPressed, setIsPressed] = useState<boolean>(false);

  return (
    <Box mb={3}>
      <Box>
        <Flex
          justifyContent={"space-between"}
          flexDirection={"row"}
          alignItems={"center"}
        >
          <Box>
            <Pressable
              onPress={() => router.push("/(tabs)/(GymPage)")}
              onPressOut={() => setIsPressed(false)}
              bg={isPressed ? "trueGray.200" : "#FFF"} // Change background color on hover
            >
              <Heading underline> Back Bay Fitness Center </Heading>
            </Pressable>
            <Text > Click to change your gym </Text>
          </Box>
          <Pressable onPress={() => router.push("./Notifications")}>
          <FontAwesome name="bell" size={45} color="#0C4A6E" />
          </Pressable>
        </Flex>
      </Box>
    </Box>
  );
};
/*
    <Box mb={3}>
      <Row alignItems="center" justifyContent="left">
        <Pressable
            onPress={() => router.push("/(tabs)/(GymPage)")}
            onPressOut={() => setIsPressed(false)}
            bg={isPressed ? "trueGray.200" : "#FFF"} // Change background color on hover
            >
            <Column>    
            <Text color= "trueGray.900" fontSize="xl" fontWeight="bold">{currUser.gym}</Text>
            <Text textDecorationLine="underline" color= "trueGray.900" 
                fontSize="md">Click here to change your gym</Text>
            </Column>
        </Pressable>
        <Spacer />
        <IconButton 
        size="xs"
        onPress={() => router.push("./Notifications")}
        icon={<Image source={require("@/assets/images/bell_icon.png")} />} />
      </Row>
    </Box>
*/

export default Header;