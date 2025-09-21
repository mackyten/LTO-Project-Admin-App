import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import type { AdministratorModel } from "../../../../../models/administrator_model";
import { AccessTime, Delete, Edit } from "@mui/icons-material";
import { mainColor } from "../../../../../themes/colors";

interface IAdminItem {
  item: AdministratorModel;
  onEdit?: (item: AdministratorModel) => void;
  onDelete?: (item: AdministratorModel) => void;
}
const AdminItem: React.FC<IAdminItem> = ({ item, onEdit, onDelete }) => {
  return (
    <Box
      sx={{
        mb: 2,
        display: "flex",
        flexDirection: "row",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "16px",
        boxShadow: "0 2px 4px hsla(0, 0%, 0%, 0.10)",
      }}
    >
      <Badge
        title={item.uuid ? "Verified" : "Pending Verification"}
        badgeContent={
          item.uuid ? null : (
            <AccessTime
              sx={{
                color: mainColor.warning,
              }}
            />
          )
        }
        overlap="circular"
      >
        <Avatar
          src={item.profilePictureUrl}
          alt={item.lastName}
          sx={{ width: "60px", height: "60px" }}
        />
      </Badge>
      <Box
        sx={{
          ml: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <Typography
          variant="body1"
          fontWeight="bold"
          sx={{
            wordBreak: "break-word", // Ensures long names break to fit within the box
          }}
        >
          {item.firstName} {item.lastName}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            wordBreak: "break-all", // Ensures long emails break to fit within the box
          }}
        >
          {item.email}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => onEdit && onEdit(item)}>
            <Edit />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Tooltip title="Remove Admin">
          <IconButton onClick={() => onDelete && onDelete(item)}>
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default AdminItem;
