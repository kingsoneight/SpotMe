import { Button, HStack } from "native-base";
import { AntDesign } from "@expo/vector-icons";
export default function ButtonGroup() {
  return (
    <HStack
      space={3}
      justifyContent={"space-around"}
      mt={6}
      textAlign={"center"}
    >
      <Button flexGrow={"1"} variant={"outline"}>
        120 Friends
      </Button>
      <Button
        flexGrow={"1"}
        backgroundColor={"#0284C7"}
        leftIcon={<AntDesign name="check" size={24} color="white" />}
      >
        Check In
      </Button>
      <Button backgroundColor={"#0284C7"} flexGrow={"1"}>
        Edit
      </Button>
    </HStack>
  );
}
