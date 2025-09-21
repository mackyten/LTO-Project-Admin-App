import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import { Transition } from "../../../../shared/transition";
import { mainColor } from "../../../../../themes/colors";
import useAdministratorsStore from "../store";
import { useDeleteAdmin } from "../hooks";

export const DeleteConfimationDialog: React.FC = () => {
  const deleteAdmin = useDeleteAdmin();
  const {
    isDeleteConfirmationDialogOpen,
    setDeleteConfirmationDialog,
    selectedAdmin,
    setSelectedAdmin,
  } = useAdministratorsStore();
  const handleClose = () => {
    setDeleteConfirmationDialog(false);
    setSelectedAdmin(null);
  };
  const handleDelete = () => {
    deleteAdmin.mutate(selectedAdmin!.documentId!, {
      onSuccess: () => {
        handleClose();
      },
    });
  };
  return (
    <>
      <Dialog
        fullWidth
        maxWidth={"xs"}
        open={isDeleteConfirmationDialogOpen}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          color: "primary.main",
        }}
      >
        <DialogContent>
          <Typography
            variant="h6"
            sx={{
              mb: 1,
            }}
            fontWeight={600}
          >
            Remove {selectedAdmin?.firstName} {selectedAdmin?.lastName} as an
            administrator ?
          </Typography>

          <Typography>
            You are about to remove this administrator. This action cannot be
            undone.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            loading={deleteAdmin.isPending}
            variant="contained"
            sx={{
              backgroundColor: mainColor.accent,
            }}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
