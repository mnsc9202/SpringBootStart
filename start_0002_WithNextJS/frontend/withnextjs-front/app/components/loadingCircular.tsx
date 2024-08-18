import { Box, CircularProgress } from "@mui/material";

export default function LoadingCircular() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <CircularProgress />
    </Box>
  );
}
