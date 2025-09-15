import { mainColor } from "../../../themes/colors";

export const TableStyleProps = {
  container: {
    maxHeight: `calc(100vh - 350px)`,
    width: "100%",
    borderTopRightRadius: "16px",
    borderTopLeftRadius: "16px",
  },
  tableHead: {
    backgroundColor: mainColor.tertiary,
    borderTopLeftRadius: "16px",
  },
  tableRow: {
    bgcolor: "tertiary.main",
    boxShadow: 3,
  },
  tableHeadLeft: {
    borderTopLeftRadius: "16px",
  },
  tableHeadRight: {
    borderTopRightRadius: "16px",
  },
  paginationContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    boxShadow: 3,
    padding: "16px",
    backgroundColor: "white",
    borderBottomLeftRadius: "16px",
    borderBottomRightRadius: "16px",
    dataNumber: { mr: 5 },
    button: {
      height: "30px",
    },
  },
};
