import type { ReactElement } from "react";
import HomeIcon from "@mui/icons-material/Home";
import GavelIcon from "@mui/icons-material/Gavel";
import GroupIcon from "@mui/icons-material/Group";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { DirectionsCar, Gavel } from "@mui/icons-material";

export type DraweItemModel = {
  title: string;
  route: string;
  icon: ReactElement;
};

export const sideDrawerItems: DraweItemModel[] = [
  {
    title: "Home",
    route: "/app",
    icon: <HomeIcon />,
  },
  {
    title: "Violations",
    route: "/app/violations",
    icon: <GavelIcon />,
  },
  {
    title: "Enforcers",
    route: "/app/enforcers",
    icon: <GroupIcon />,
  },
  {
    title: "Drivers",
    route: "/app/drivers",
    icon: <DirectionsCar />,
  },
  {
    title: "Payments",
    route: "/app/payments",
    icon: <ReceiptLongIcon />,
  },
  {
    title: "Appeals",
    route: "/app/appeals",
    icon: <Gavel />,
  },
  {
    title: "Administrators",
    route: "/app/administrators",
    icon: <ManageAccountsIcon />,
  },
  {
    title: "Account",
    route: "/app/account",
    icon: <AccountCircleIcon />,
  },
];
