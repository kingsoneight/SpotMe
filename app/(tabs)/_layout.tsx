import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Redirect, Tabs } from "expo-router"; // Removed Stack import, as it's not used
import { useAuth } from "../../Context/AuthContext";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  size: number;
}) {
  return <FontAwesome {...props} />;
}

export default function TabLayout() {
  const { User } = useAuth(); 
  if (!User) {
    return <Redirect href="/LogIn" />;
  } else {
    return (
      <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#F97316",
        tabBarInactiveTintColor: "#A5A5A5",
        tabBarStyle:{
          height: 100,
        }
      }}
      >
        <Tabs.Screen
          name="(MessagePage)"
          options={{
            title: "Message",
            headerShown: false,
            tabBarIcon: (props) => <TabBarIcon {...props} name="comments" size={40}/>,
          }}
          
        />
        <Tabs.Screen
          name="(HomePage)"
          options={{
            title: "SpotMe",
            headerShown: false,
            tabBarIcon: (props) => <TabBarIcon {...props} name="group" size={40}/>,
          }}
        />
        <Tabs.Screen
          name="(ProfilePage)"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: (props) => <TabBarIcon {...props} name="user" size={40}/>,
     
          }}
        />
      </Tabs>


    );
  }
}
