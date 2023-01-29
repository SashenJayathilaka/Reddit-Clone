import {
  Flex,
  Icon,
  MenuItem,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";
import useDirectory from "../../hooks/useDirectory";

type MenuListItemProps = {
  displayText: string;
  link: string;
  icon: IconType;
  iconColor: string;
  imageURL?: string;
};

const MenuListItem: React.FC<MenuListItemProps> = ({
  displayText,
  link,
  icon,
  iconColor,
  imageURL,
}) => {
  const { onSelectMenuItem } = useDirectory();
  const hoverBg = useColorModeValue("gray.100", "#2A4365");

  return (
    <MenuItem
      width="100%"
      fontSize="10pt"
      _hover={{ bg: hoverBg }}
      onClick={() => {
        onSelectMenuItem({ displayText, link, icon, iconColor, imageURL });
      }}
    >
      <Flex alignItems="center">
        {imageURL ? (
          <Image borderRadius="full" boxSize="18px" src={imageURL} mr={2} />
        ) : (
          <Icon fontSize={20} mr={2} as={icon} color={iconColor} />
        )}
        {displayText}
      </Flex>
    </MenuItem>
  );
};
export default MenuListItem;
