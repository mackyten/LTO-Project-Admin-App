import { Box, Divider, Typography } from "@mui/material";
import type React from "react";
import { PageMainCont } from "../../../shared/style_props/page_container";
import { PageHeader } from "../../../shared/page_header";
import AccountForm from "./components/form";
import { useAccountPageStore } from "./store";
import { PasswordChangeDialog } from "./components/password_change_dialog";

const AccountPage: React.FC = () => {
  const {
    isEditing,
    isSubmitting,
    handleSave,
    handleCancel,
    toggleEditing,
    setSubmitForm,
    setIsSubmitting,
    setIsPasswordModalOpen,
  } = useAccountPageStore();

  return (
    <Box sx={PageMainCont}>
      <Box
        sx={{
          ...PageMainCont.SubCont,
          alignItems: "stretch",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: {
              xs: 1,
              md: 2,
            },
          }}
        >
          <PageHeader title="Account" variant="simple" />
        </Box>

        <Box
          sx={{
            flex: 1,
            maxHeight: `calc(100vh - 220px)`,
            minHeight: `calc(100vh - 220px)`,
            overflowY: "auto",
          }}
        >
          <AccountForm
            isEditing={isEditing}
            isSubmitting={isSubmitting}
            onEditToggle={toggleEditing}
            onSave={handleSave}
            onCancel={handleCancel}
            onSubmitFormSet={setSubmitForm}
            onSubmittingChange={setIsSubmitting}
          />
          <Divider sx={{ my: 4 }} />
          <Box
            sx={{
              m: 2,
              p: 2,
              borderRadius: 2,
              boxShadow: 2,
              backgroundColor: "background.paper",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 2,
              transition: "box-shadow 0.2s ease-in-out",
              "&:hover": {
                boxShadow: 4,
              },
            }}
            onClick={() => {
              setIsPasswordModalOpen(true);
            }}
          >
            <Box
              component="svg"
              sx={{ width: 24, height: 24, color: "primary.main" }}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18,8H17V6A5,5 0 0,0 12,1A5,5 0 0,0 7,6V8H6A2,2 0 0,0 4,10V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V10A2,2 0 0,0 18,8M12,3A3,3 0 0,1 15,6V8H9V6A3,3 0 0,1 12,3M16,16A2,2 0 0,1 14,18A2,2 0 0,1 12,16A2,2 0 0,1 14,14A2,2 0 0,1 16,16Z" />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight="medium">
                Change Password
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Update your account password
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <PasswordChangeDialog />
    </Box>
  );
};

export default AccountPage;
