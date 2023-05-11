import React, { ReactNode } from "react";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Button,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { BsInfoCircle } from "react-icons/bs";
import {
  BiCustomize,
  BiCategory,
  BiPlusCircle,
  BiCompass,
  BiCog,
  BiInfoCircle,
  BiLogOut,
  BiLogIn,
} from "react-icons/bi";

import { IconType } from "react-icons";
import { ReactText } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface LinkItemProps {
  name: string;
  icon: IconType;
  location: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Generate", icon: BiPlusCircle, location: "/" },
  { name: "Inventory", icon: BiCategory, location: "/inventory" },
  { name: "Explore", icon: BiCompass, location: "/explore" },
  { name: "About", icon: BiInfoCircle, location: "/settings" },
];

export default function Sidebar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const navigate = useNavigate();

  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          Artifact Forge
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} location={link.location}>
          {link.name}
        </NavItem>
      ))}

      {/*logout button*/}
      {localStorage.getItem("userIsLoggedIn") === "true" ? (
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: "gray.700",
            color: "white",
          }}
          onClick={() => {
            axios
              .post(
                import.meta.env.VITE_API_URI + "/user/logout",
                { guestId: localStorage.getItem("guestId") },
                {
                  withCredentials: true,
                }
              )
              .then((res) => {
                localStorage.setItem("userIsLoggedIn", "false");
                navigate("/login");
                window.location.reload();
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={BiLogOut}
          />
          Log out
        </Flex>
      ) : (
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: "gray.700",
            color: "white",
          }}
          onClick={() => {
            navigate("/login");
          }}
        >
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={BiLogIn}
          />
          Sign in
        </Flex>
      )}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  location: string;
  children: ReactText;
}
function NavItem({ icon, location, children, ...rest }: NavItemProps) {
  return (
    <Link
      href={location}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "gray.700",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="2xl" ml="8" fontWeight="bold">
        Artifact Forge
      </Text>
    </Flex>
  );
};
