import { Box } from "@mui/material";
import type React from "react";
import { PageMainCont } from "../../../shared/style_props/page_container";
import { PageHeader } from "../../../shared/page_header";
import AccountForm from "./components/form";
import { useAccountPageStore } from "./store";

const AccountPage: React.FC = () => {
  const {
    isEditing,
    isSubmitting,
    handleSave,
    handleCancel,
    toggleEditing,
    setSubmitForm,
    setIsSubmitting,
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
        </Box>
      </Box>
    </Box>
  );
};

export default AccountPage;
