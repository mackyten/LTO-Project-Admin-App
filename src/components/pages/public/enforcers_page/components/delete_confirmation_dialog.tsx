import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import useViolationsStore from "../store";
import { Transition } from "../../../../shared/transition";
import { useDeleteEnforcer } from "../hooks";
import { mainColor } from "../../../../../themes/colors";

export const DeleteConfimationDialog: React.FC = () => {
  const deleteEnforcer = useDeleteEnforcer();
  const {
    isDeleteConfirmationDialogOpen,
    selectedEnforcer,
    setSelectedEnforcer,
    setDeleteConfirmationDialog,
  } = useViolationsStore();
  const handleClose = () => {
    setDeleteConfirmationDialog(false);
    setSelectedEnforcer(undefined);
  };
  const handleDelete = () => {
    deleteEnforcer.mutate(selectedEnforcer!.documentId, {
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
            Delete {selectedEnforcer?.firstName} {selectedEnforcer?.lastName}?
          </Typography>

          <Typography>
            You are about to delete this enforcer. This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            loading={deleteEnforcer.isPending}
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
