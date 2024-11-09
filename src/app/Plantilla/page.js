import "../App.css";
import Side from "../components/Side";
import Nav from "../components/Nav";
import Content from "../components/Content";

export default function Home() {
  return (
    <div className="cont1">
      <Side></Side>
      <div className="cont12">
        <Nav/>
        <Content/>
      </div>
    </div>
  );
}
