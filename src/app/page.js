import "./App.css";
import Side from "./components/Side";
import Nav from "./components/Nav";
import Contenido from "./components/Contenido";

export default function Home() {
  return (
    <div className="cont1">
      <Side></Side>
      <div className="cont12">
        <Nav></Nav>
        <Contenido></Contenido>
      </div>
    </div>
  );
}
