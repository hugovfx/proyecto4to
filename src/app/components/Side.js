import { Button } from "@mui/material";
import "./Side.css";
function Side() {
  return (
    <div className="side">
      <Button
        variant="outlined"
        style={{ width: "80%", height: "8%", marginTop: "10%" }}
        href="/"
      >
        <p>side</p>
      </Button>
      <Button
        variant="outlined"
        style={{ width: "80%", height: "8%", marginTop: "10%" }}
        href="/"
      >
        <p>side</p>
      </Button>
      <Button
        variant="outlined"
        style={{ width: "80%", height: "8%", marginTop: "10%" }}
        href="/"
      >
        <p>side</p>
      </Button>
    </div>
  );
}
export default Side;
