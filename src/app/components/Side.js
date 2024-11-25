import { Button } from "@mui/material";
import "./Side.css";
import SideButton from "./SideButton";
function Side() {
  return (
    <div className="side">
      <SideButton url={"/nmap"} name={"NMAP"}/>
      <SideButton url={"/whois"} name={"WHO IS"}/>
      <SideButton url={"/mac-address"} name={"MAC ADDRESS"}/>
      <SideButton url={"/domains-discovery"} name={"DESCUBRIR SUBDOMINIOS"}/>


    </div>
  );
}
export default Side;
